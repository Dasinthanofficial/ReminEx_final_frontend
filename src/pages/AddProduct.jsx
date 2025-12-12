import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { productService } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import { convertLocalToUSD } from "../utils/currencyHelper";
import { FiUpload, FiLink, FiCamera, FiX } from "react-icons/fi";
import api from "../services/api";
import { BrowserMultiFormatReader } from "@zxing/browser";

const AddProduct = () => {
  const navigate = useNavigate();
  const { currency } = useAuth();

  const [form, setForm] = useState({
    name: "",
    category: "Food",
    expiryDate: "",
    price: "",
    weight: "",
    unit: "g",
    image: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [barcode, setBarcode] = useState("");

  // Scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(false);        // barcode auto‑fill
  const [labelScanning, setLabelScanning] = useState(false); // label OCR

  // Camera refs
  const videoRef = useRef(null);
  const readerRef = useRef(null);

  // 🔍 Start / stop barcode scanner
  useEffect(() => {
    if (!showScanner) return;

    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;
    let active = true;

    reader
      .decodeFromVideoDevice(
        undefined,          // let ZXing choose default camera
        videoRef.current,
        (result, err) => {
          if (!active) return;

          if (result) {
            const code = result.getText();
            console.log("✅ Barcode scanned:", code);
            setBarcode(code);
            setShowScanner(false);
            handleAutoFill(code);
            try {
              reader.reset();
            } catch (e) {
              console.warn("ZXing reset error:", e);
            }
          }

          if (err && err.name !== "NotFoundException") {
            console.warn("ZXing decode error:", err);
          }
        }
      )
      .catch((err) => {
        console.error("Camera/decoder error:", err);
        toast.error("Unable to access camera or decode barcode.");
        setShowScanner(false);
      });

    return () => {
      active = false;
      if (readerRef.current && typeof readerRef.current.reset === "function") {
        try {
          readerRef.current.reset();
        } catch (e) {
          console.warn("ZXing reset error on cleanup:", e);
        }
      }
    };
  }, [showScanner]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Image upload handler (for product image & label OCR)
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      if (!f.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5MB");
        return;
      }

      setFile(f);
      setPreview(URL.createObjectURL(f));
      setForm((prev) => ({ ...prev, image: "" }));
    }
  };

  // 🔁 Auto-fill using backend /products/scan/barcode/:code
  const handleAutoFill = async (code) => {
    const trimmed = (code || "").trim();
    if (!trimmed) {
      toast.error("Please enter or scan a barcode first.");
      return;
    }

    setScanning(true);
    try {
      const info = await api.get(`/products/scan/barcode/${trimmed}`);

      if (!info || typeof info !== "object") {
        toast.error("Unexpected response from barcode API");
        return;
      }

      setForm((prev) => {
        let weightVal = prev.weight;
        let unitVal = prev.unit;

        // Parse "500 g"
        if (info.quantity) {
          const match = info.quantity.match(/(\d+\.?\d*)\s*(g|kg|ml|l|L)/i);
          if (match) {
            weightVal = match[1];
            unitVal = match[2];
          }
        }

        return {
          ...prev,
          name: info.name || prev.name,
          category: "Food",
          weight: weightVal,
          unit: unitVal,
          image: info.image || prev.image,
        };
      });

      if (info.image) {
        setPreview(info.image);
        setFile(null);
      }

      toast.success("✓ Auto-filled! Add expiry date & price.", {
        icon: "📦",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to auto-fill");
    } finally {
      setScanning(false);
    }
  };

  // 🔍 Scan label (OCR) to guess expiry date / weight / unit
  const handleScanLabel = async () => {
    if (!file) {
      toast.error("Upload or capture a label image first");
      return;
    }

    const fd = new FormData();
    fd.append("image", file);

    setLabelScanning(true);
    try {
      const res = await api.post("/products/scan/label", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const guessed = res.guessed || {};
      const { expiryDate, weight, unit } = guessed;

      setForm((prev) => ({
        ...prev,
        expiryDate: expiryDate || prev.expiryDate,
        weight: weight || prev.weight,
        unit: unit || prev.unit,
      }));

      toast.success("Label scanned. Please confirm expiry & weight.");
    } catch (err) {
      console.error("Label scan error:", err);
      toast.error(err.response?.data?.message || "Failed to scan label");
    } finally {
      setLabelScanning(false);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("category", form.category);
      fd.append("expiryDate", form.expiryDate);

      if (form.price) {
        const priceInUSD = convertLocalToUSD(
          parseFloat(form.price),
          currency
        );
        fd.append("price", priceInUSD);
      }

      if (form.weight) {
        fd.append("weight", form.weight);
        fd.append("unit", form.unit);
      }

      if (file) {
        fd.append("image", file);
      } else if (form.image) {
        fd.append("image", form.image);
      }

      await productService.addProduct(fd);
      toast.success("Product added!");
      navigate("/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle =
    "w-full p-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] outline-none transition-all";
  const labelStyle =
    "block text-xs font-bold text-[#38E07B] uppercase tracking-wider mb-2";

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl my-8">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Add New Product
        </h1>
        <p className="text-gray-300 mt-1">
          Enter details below to track your inventory.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Barcode Section */}
        <div>
          <label className={labelStyle}>Barcode</label>

          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="e.g. 5601234567890"
              className={`${inputStyle} flex-1`}
            />

            {/* Scan Button */}
            <button
              type="button"
              onClick={() => setShowScanner(!showScanner)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                showScanner
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-[#38E07B] text-[#122017] hover:bg-[#2fc468]"
              }`}
            >
              {showScanner ? <FiX /> : <FiCamera />}
              {showScanner ? "Close" : "Scan"}
            </button>

            {/* Manual Auto-fill */}
            <button
              type="button"
              onClick={() => handleAutoFill(barcode)}
              disabled={scanning || !barcode.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {scanning ? "Loading..." : "Auto-fill"}
            </button>
          </div>

          {/* Scanner UI */}
          {showScanner && (
            <div className="relative mt-4 rounded-xl overflow-hidden border-2 border-[#38E07B] bg-black">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover"
                autoPlay
                playsInline
                muted
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-[#38E07B] rounded-lg animate-pulse" />
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-xs font-bold">
                📷 Position barcode inside the frame
              </div>
            </div>
          )}

          <p className="text-[10px] text-gray-500 mt-1">
            Scan barcode or enter manually to auto-fill.
          </p>
        </div>

        {/* Product Name & Category */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Milk, Apples..."
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`${inputStyle} cursor-pointer`}
            >
              <option value="Food">Food</option>
              <option value="Non-Food">Non-Food</option>
            </select>
          </div>
        </div>

        {/* Expiry Date */}
        <div>
          <label className={labelStyle}>Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            required
            className={inputStyle}
          />
        </div>

        {/* Price and Weight */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Price ({currency})</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              className={inputStyle}
              step="0.01"
            />
          </div>

          <div>
            <label className={labelStyle}>Quantity / Size</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="500"
                className={`${inputStyle} flex-1`}
              />
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="bg-black/40 border border-white/10 rounded-xl text-white px-4 font-bold cursor-pointer"
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="L">L</option>
                <option value="pcs">pcs</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="border-white/10 my-6" />

        {/* Image Upload + Label Scan */}
        <div>
          <label className={labelStyle}>Product Image / Label</label>
          <div className="grid md:grid-cols-2 gap-6">
            {/* LEFT: Image + Scan Label */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              {/* Image area with file overlay */}
              <div className="relative h-40 rounded-xl border-2 border-dashed border-white/20 overflow-hidden cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFile}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />

                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border border-white/10"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#38E07B]/10 flex items-center justify-center mb-3 text-[#38E07B]">
                      <FiUpload className="text-xl" />
                    </div>
                    <span className="text-sm text-gray-300">
                      Tap to capture or upload photo
                    </span>
                  </div>
                )}
              </div>

              {/* Scan Label Button – outside overlay */}
              <button
                type="button"
                onClick={handleScanLabel}
                disabled={!file || labelScanning}
                className="mt-4 w-full text-xs font-bold bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 transition disabled:opacity-60"
              >
                {labelScanning ? "Scanning label..." : "Scan Label (OCR)"}
              </button>
            </div>

            {/* RIGHT: URL input */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                <FiLink className="text-[#38E07B]" /> Or paste image URL
              </p>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={inputStyle}
                disabled={!!file}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <Link
            to="/products"
            className="flex-1 text-center py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-[#38E07B] text-[#122017] font-bold py-3.5 rounded-xl hover:bg-[#2fc468] transition disabled:opacity-60"
          >
            {saving ? "Adding..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;