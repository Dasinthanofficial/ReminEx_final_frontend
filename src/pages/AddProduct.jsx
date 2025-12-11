import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { productService } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import { convertLocalToUSD } from "../utils/currencyHelper";
import { FiUpload, FiLink, FiCamera, FiX } from "react-icons/fi";
import { useZxing } from "react-zxing";
import api from "../services/api";

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

  // 🆕 Scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      // ✅ Validate file type
      if (!f.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      // ✅ Validate file size (5MB)
      if (f.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5MB");
        return;
      }
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setForm((prev) => ({ ...prev, image: "" }));
    }
  };

  // 🆕 Barcode Scanner Hook
  const { ref: videoRef } = useZxing({
    onDecodeResult(result) {
      const scannedCode = result.getText();
      console.log("📷 Scanned:", scannedCode);
      setBarcode(scannedCode);
      setShowScanner(false); // Close scanner
      handleAutoFill(scannedCode); // Auto-fill form
    },
    onError(error) {
      console.error("Scanner error:", error);
      toast.error("Camera access denied or not available");
    },
  });

  // Auto-fill product details from barcode
  const handleAutoFill = async (code) => {
    const trimmed = (code || "").trim();
    if (!trimmed) {
      toast.error("Please enter or scan a barcode first.");
      return;
    }

    setScanning(true);
    try {
      // ⚠️ api.get already returns data (not { data: ... })
      const res = await api.get(`/products/scan/barcode/${trimmed}`);
      const info = res || {};

      if (!info || typeof info !== "object") {
        toast.error("Unexpected response from barcode API");
        return;
      }

      setForm((prev) => {
        let weightVal = prev.weight;
        let unitVal = prev.unit;

        // Parse quantity like "500 g" or "1 L"
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
        setFile(null); // we are using a URL, not a local file
      }

      toast.success(
        "✓ Name, image & weight auto-filled. Please enter expiry date & price.",
        {
          duration: 4000,
          icon: "📦",
        }
      );
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to scan barcode";
      toast.error(msg);
    } finally {
      setScanning(false);
    }
  };

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
      const msg = err.response?.data?.message || "Failed to add product";
      toast.error(msg);
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
        {/* 🆕 Barcode Scanner Section */}
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
              {showScanner ? (
                <>
                  <FiX /> Close
                </>
              ) : (
                <>
                  <FiCamera /> Scan
                </>
              )}
            </button>

            {/* Manual Auto-fill Button */}
            <button
              type="button"
              onClick={() => handleAutoFill(barcode)}
              disabled={scanning || !barcode.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {scanning ? "Loading..." : "Auto-fill"}
            </button>
          </div>

          {/* Camera Scanner UI */}
          {showScanner && (
            <div className="relative mt-4 rounded-xl overflow-hidden border-2 border-[#38E07B] bg-black">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-4 border-[#38E07B] rounded-lg animate-pulse" />
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-xs font-bold">
                📷 Position barcode within the frame
              </div>
            </div>
          )}

          <p className="text-[10px] text-gray-500 mt-1">
            Scan barcode or enter manually to auto-fill product details.
          </p>
        </div>

        {/* Name & Category */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Milk, Apples"
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
              className={`${inputStyle} appearance-none cursor-pointer`}
            >
              <option value="Food" className="bg-[#122017] text-white">
                Food
              </option>
              <option value="Non-Food" className="bg-[#122017] text-white">
                Non-Food
              </option>
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
            style={{ colorScheme: "dark" }}
          />
        </div>

        {/* Price & Weight/Unit */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Price ({currency})</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400 text-sm font-bold pointer-events-none">
                {currency}
              </span>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                className={`${inputStyle} pl-16`}
              />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Quantity / Size</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="e.g. 500"
                className={`${inputStyle} flex-1`}
              />
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="bg-black/40 border border-white/10 rounded-xl text-white px-4 outline-none focus:border-[#38E07B] cursor-pointer font-bold"
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

        {/* Image Upload Section */}
        <div>
          <label className={labelStyle}>Product Image</label>

          <div className="grid md:grid-cols-2 gap-6">
            {/* File Upload (with instant capture on mobile) */}
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white/5 hover:bg-white/10 transition cursor-pointer relative group">
              <input
                type="file"
                accept="image/*"
                capture="environment" // opens camera on mobile
                onChange={handleFile}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              {preview ? (
                <div className="relative w-full h-40">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg shadow-lg border border-white/10"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-white font-bold text-sm">
                    Change Image
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-[#38E07B]/10 flex items-center justify-center mb-3 text-[#38E07B]">
                    <FiUpload className="text-xl" />
                  </div>
                  <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">
                    Tap to capture or upload photo
                  </span>
                </>
              )}
            </div>

            {/* URL Input */}
            <div className="flex flex-col justify-center p-6 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                <FiLink className="text-[#38E07B]" /> Or paste Image URL
              </p>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={`${inputStyle} text-sm`}
                disabled={!!file}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <Link
            to="/products"
            className="flex-1 text-center py-3.5 rounded-xl font-bold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-[#38E07B] text-[#122017] font-bold py-3.5 rounded-xl hover:bg-[#2fc468] hover:shadow-[0_0_20px_rgba(56,224,123,0.4)] transition-all disabled:opacity-70 active:scale-[0.98]"
          >
            {saving ? "Adding Product..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
