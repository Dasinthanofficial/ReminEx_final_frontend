import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { FiUpload, FiLink, FiCamera, FiX } from "react-icons/fi";

import api from "../services/api";
import { productService } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import { convertLocalToUSD } from "../utils/currencyHelper";
import SelectMenu from "../components/SelectMenu";

const CATEGORY_OPTIONS = [
  { value: "Food", label: "Food" },
  { value: "Non-Food", label: "Non-Food" },
];

const UNIT_OPTIONS = [
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
  { value: "ml", label: "ml" },
  { value: "L", label: "L" },
  { value: "pcs", label: "pcs" },
];

const AddProduct = () => {
  const navigate = useNavigate();
  const { currency } = useAuth();

  const todayISO = useMemo(() => {
    const d = new Date();
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }, []);

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

  // Scanner + AI
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [predicting, setPredicting] = useState(false);

  const videoRef = useRef(null);
  const readerRef = useRef(null);

  useEffect(() => {
    if (!showScanner) return;

    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;
    let cancelled = false;

    reader
      .decodeFromConstraints(
        {
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        videoRef.current,
        (result, err) => {
          if (cancelled) return;

          if (result) {
            const code = result.getText();
            setBarcode(code);
            setShowScanner(false);
            handleAutoFill(code);

            try {
              reader.reset();
            } catch {}
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
      cancelled = true;
      if (readerRef.current?.reset) {
        try {
          readerRef.current.reset();
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showScanner]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) return toast.error("Please upload an image file");
    if (f.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setForm((prev) => ({ ...prev, image: "" }));
  };

  // Barcode auto-fill
  const handleAutoFill = async (code) => {
    const trimmed = (code || "").trim();
    if (!trimmed) return toast.error("Please enter or scan a barcode first.");

    setScanning(true);
    try {
      const info = await api.get(`/products/scan/barcode/${trimmed}`);

      setForm((prev) => {
        let weightVal = prev.weight;
        let unitVal = prev.unit;

        if (info?.quantity) {
          const match = info.quantity.match(/(\d+\.?\d*)\s*(g|kg|ml|l|L)/i);
          if (match) {
            weightVal = match[1];
            unitVal = match[2];
            if (unitVal === "l") unitVal = "L";
          }
        }

        return {
          ...prev,
          name: info?.name || prev.name,
          category: "Food",
          weight: weightVal,
          unit: unitVal,
          image: info?.image || prev.image,
        };
      });

      if (info?.image) {
        setPreview(info.image);
        setFile(null);
      }

      toast.success("✓ Auto-filled! Add expiry date & price.", { icon: "📦" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to auto-fill");
    } finally {
      setScanning(false);
    }
  };

  // AI spoilage prediction
  const handlePredictFromImage = async () => {
    if (!file) return toast.error("Upload or capture a produce image first");

    const fd = new FormData();
    fd.append("image", file);

    setPredicting(true);
    try {
      const res = await api.post("/products/predict-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res?.success || !res?.expiryDateISO) {
        toast.error(res?.message || "Could not predict from image");
        return;
      }

      setForm((prev) => ({ ...prev, expiryDate: res.expiryDateISO }));
      toast.success(`AI: ${res.condition}, likely spoils in ${res.days} day(s).`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to analyze image");
    } finally {
      setPredicting(false);
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("category", form.category);
      fd.append("expiryDate", form.expiryDate);

      if (form.price) {
        const priceInUSD = convertLocalToUSD(parseFloat(form.price), currency);
        fd.append("price", priceInUSD);
      }

      if (form.weight) {
        fd.append("weight", form.weight);
        fd.append("unit", form.unit);
      }

      if (file) fd.append("image", file);
      else if (form.image) fd.append("image", form.image);

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
        <h1 className="text-3xl font-bold text-white tracking-tight">Add New Product</h1>
        <p className="text-gray-300 mt-1">Enter details below to track your inventory.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Barcode */}
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

            <button
              type="button"
              onClick={() => handleAutoFill(barcode)}
              disabled={scanning || !barcode.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {scanning ? "Loading..." : "Auto-fill"}
            </button>
          </div>

          {showScanner && (
            <div className="relative mt-4 rounded-xl overflow-hidden border-2 border-[#38E07B] bg-black">
              <video ref={videoRef} className="w-full h-64 object-cover" autoPlay playsInline muted />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-[#38E07B] rounded-lg animate-pulse" />
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-xs font-bold">
                📷 Position barcode inside the frame
              </div>
            </div>
          )}

          <p className="text-[10px] text-gray-500 mt-1">Scan barcode or enter manually to auto-fill.</p>
        </div>

        {/* Name + Category */}
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

          {/* ✅ Custom dropdown */}
          <SelectMenu
            label="Category"
            value={form.category}
            onChange={(val) => setForm((p) => ({ ...p, category: val }))}
            options={CATEGORY_OPTIONS}
          />
        </div>

        {/* Expiry */}
        <div>
          <label className={labelStyle}>Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            required
            min={todayISO}
            className={inputStyle}
            style={{ colorScheme: "dark" }}
          />
        </div>

        {/* Price + Weight + Unit */}
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
              min="0"
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
                min="0"
              />

              {/* ✅ Custom dropdown */}
              <SelectMenu
                value={form.unit}
                onChange={(val) => setForm((p) => ({ ...p, unit: val }))}
                options={UNIT_OPTIONS}
                className="w-28"
              />
            </div>
          </div>
        </div>

        <hr className="border-white/10 my-6" />

        {/* Image Upload + AI Predict */}
        <div>
          <label className={labelStyle}>Product Image (Produce)</label>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
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
                      Tap to capture or upload produce photo
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handlePredictFromImage}
                disabled={!file || predicting}
                className="mt-4 w-full text-xs font-bold bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 transition disabled:opacity-60"
              >
                {predicting ? "Predicting..." : "Predict spoilage from image"}
              </button>
            </div>

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

        {/* Buttons */}
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