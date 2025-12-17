import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiSave, FiArrowLeft, FiImage, FiLink, FiMic } from "react-icons/fi";

import { productService } from "../services/productService";
import { getImageUrl } from "../utils/imageHelper";
import { useAuth } from "../context/AuthContext";
import { convertUSDToLocal, convertLocalToUSD } from "../utils/currencyHelper";
import { toDateInputValue } from "../utils/dateHelper";
import SelectMenu from "../components/SelectMenu";

import { useSpeechRecognition as useSpeechRecognitionHook } from "../hooks/useSpeechRecognition.js";
import {
  extractFirstNumber,
  parseSpokenDateToISO,
  parseUnitFromText,
  parseCategoryFromText,
} from "../utils/speechParsers.js";

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

const VOICE_LANGS = [
  { label: "English", code: "en-US" },
  { label: "Tamil", code: "ta-IN" },
  { label: "Sinhala", code: "si-LK" },
  { label: "Hindi", code: "hi-IN" },
  { label: "Arabic", code: "ar-SA" },
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currency } = useAuth();

  const todayISO = useMemo(() => {
    const d = new Date();
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }, []);

  const [product, setProduct] = useState({
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Voice
  const [voiceLang, setVoiceLang] = useState("en-US");
  const { isSupported: voiceSupported, listening, listenOnce } =
    useSpeechRecognitionHook();

  // Cleanup blob previews
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProduct(id);

        setProduct({
          ...data,
          expiryDate: toDateInputValue(data.expiryDate),
          price: data.price ? convertUSDToLocal(data.price, currency) : "",
          unit: data.unit || "g",
          image: data.image || "",
        });

        setPreview(getImageUrl(data.image));
      } catch {
        toast.error("Failed to load product.");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, currency, convertUSDToLocal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));

    if (name === "image") {
      setFile(null);
      setPreview(getImageUrl(value));
    }
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) return toast.error("Please upload an image file");
    if (f.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");

    setFile(f);

    setPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
  };

  const speakToFill = async (field) => {
    if (!voiceSupported) {
      toast.error("Voice input not supported in this browser. Use Chrome/Edge.");
      return;
    }

    try {
      toast.loading("Listening...", { id: "voice" });
      const text = await listenOnce({ lang: voiceLang, timeoutMs: 12000 });
      toast.dismiss("voice");

      if (!text) return toast.error("Didn't catch that. Try again.");

      if (field === "name") {
        setProduct((p) => ({ ...p, name: text }));
        return;
      }

      if (field === "category") {
        const cat = parseCategoryFromText(text);
        if (!cat) return toast.error("Say 'Food' or 'Non food'.");
        setProduct((p) => ({ ...p, category: cat }));
        return;
      }

      if (field === "expiryDate") {
        const iso = parseSpokenDateToISO(text);
        if (!iso) return toast.error("Say '2025-12-31' or 'tomorrow'.");
        setProduct((p) => ({ ...p, expiryDate: iso }));
        return;
      }

      if (field === "price") {
        const n = extractFirstNumber(text);
        if (n == null) return toast.error("Could not find a number for price.");
        setProduct((p) => ({ ...p, price: String(n) }));
        return;
      }

      if (field === "weight") {
        const n = extractFirstNumber(text);
        if (n == null) return toast.error("Could not find a number for quantity.");
        const unit = parseUnitFromText(text);
        setProduct((p) => ({ ...p, weight: String(n), unit: unit || p.unit }));
        return;
      }
    } catch {
      toast.dismiss("voice");
      toast.error("Voice input failed. Try again or type manually.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", product.name);
      fd.append("category", product.category);
      fd.append("expiryDate", product.expiryDate);

      if (product.price !== "" && product.price != null) {
        const priceInUSD = convertLocalToUSD(parseFloat(product.price), currency);
        fd.append("price", priceInUSD);
      }

      if (product.weight !== "" && product.weight != null) {
        fd.append("weight", product.weight);
        fd.append("unit", product.unit);
      }

      if (file) fd.append("image", file);
      else if (product.image) fd.append("image", product.image);

      await productService.updateProduct(id, fd);
      toast.success("Product updated!");
      navigate("/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-white">
        Loading product details...
      </div>
    );

  const inputStyle =
    "w-full p-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] outline-none transition-all";
  const labelStyle =
    "block text-xs font-bold text-[#38E07B] uppercase tracking-wider mb-2";

  const micBtnOuter =
    "w-12 h-[52px] rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 flex items-center justify-center";

  const voiceLangOptions = VOICE_LANGS.map((l) => ({
    value: l.code,
    label: l.label,
  }));

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/products"
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition border border-white/5"
        >
          <FiArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Product</h1>
          <p className="text-sm text-gray-400">
            Update details for{" "}
            <span className="text-[#38E07B]">{product.name}</span>
          </p>
        </div>
      </div>

      {/* Voice language block – higher stacking context */}
      {voiceSupported && (
        <div className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 relative z-[80]">
          <label className={labelStyle}>Voice Language</label>
          <SelectMenu
            value={voiceLang}
            onChange={(val) => setVoiceLang(val)}
            options={voiceLangOptions}
            size="sm"
            className="mt-1"
          />
          <p className="text-[10px] text-gray-500 mt-2">
            Use mic buttons to fill fields. If voice fails, type manually.
          </p>
        </div>
      )}

      {/* Main card – lower stacking index */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-[10]">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-0">
          {/* Left image */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-center bg-black/20">
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-black/40 border-2 border-dashed border-white/10 flex items-center justify-center relative group mb-6">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <FiImage className="mx-auto text-4xl mb-2" />
                  <span className="text-sm">No Image</span>
                </div>
              )}

              <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold text-sm">
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>
            </div>

            <div className="w-full">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                <FiLink /> Or paste Image URL
              </p>
              <input
                type="url"
                name="image"
                value={file ? "" : product.image || ""}
                onChange={handleChange}
                placeholder="https://..."
                className={`${inputStyle} text-sm`}
                disabled={!!file}
              />
            </div>
          </div>

          {/* Right form */}
          <div className="md:col-span-2 p-8 space-y-6">
            <div className="space-y-6">
              <div>
                <label className={labelStyle}>Product Name</label>
                <div className="flex gap-2 items-stretch">
                  <input
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    className={`${inputStyle} flex-1`}
                    required
                  />
                  {voiceSupported && (
                    <button
                      type="button"
                      onClick={() => speakToFill("name")}
                      disabled={listening}
                      className={micBtnOuter}
                      title="Voice: name"
                    >
                      <FiMic />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Category</label>
                  <div className="flex gap-2 items-stretch">
                    <div className="flex-1">
                      <SelectMenu
                        value={product.category}
                        onChange={(val) =>
                          setProduct((p) => ({ ...p, category: val }))
                        }
                        options={CATEGORY_OPTIONS}
                        size="sm"
                      />
                    </div>
                    {voiceSupported && (
                      <button
                        type="button"
                        onClick={() => speakToFill("category")}
                        disabled={listening}
                        className={micBtnOuter}
                        title="Voice: category"
                      >
                        <FiMic />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Expiry Date</label>
                  <div className="flex gap-2 items-stretch">
                    <input
                      type="date"
                      name="expiryDate"
                      value={product.expiryDate}
                      onChange={handleChange}
                      className={`${inputStyle} flex-1`}
                      required
                      min={todayISO}
                      style={{ colorScheme: "dark" }}
                    />
                    {voiceSupported && (
                      <button
                        type="button"
                        onClick={() => speakToFill("expiryDate")}
                        disabled={listening}
                        className={micBtnOuter}
                        title="Voice: expiry date"
                      >
                        <FiMic />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Price ({currency})</label>
                  <div className="flex gap-2 items-stretch">
                    <input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      className={`${inputStyle} flex-1`}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                    {voiceSupported && (
                      <button
                        type="button"
                        onClick={() => speakToFill("price")}
                        disabled={listening}
                        className={micBtnOuter}
                        title="Voice: price"
                      >
                        <FiMic />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Quantity / Size</label>
                  <div className="flex gap-2 items-stretch">
                    <div className="flex gap-2 flex-1">
                      <input
                        type="number"
                        name="weight"
                        value={product.weight ?? ""}
                        onChange={handleChange}
                        className={`${inputStyle} flex-1`}
                        placeholder="0"
                        min="0"
                      />
                      <SelectMenu
                        value={product.unit}
                        onChange={(val) =>
                          setProduct((p) => ({ ...p, unit: val }))
                        }
                        options={UNIT_OPTIONS}
                        className="w-28"
                        size="sm"
                      />
                    </div>

                    {voiceSupported && (
                      <button
                        type="button"
                        onClick={() => speakToFill("weight")}
                        disabled={listening}
                        className={micBtnOuter}
                        title="Voice: quantity"
                      >
                        <FiMic />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex gap-4 border-t border-white/10 mt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#38E07B] text-[#122017] font-bold py-3.5 rounded-xl hover:bg-[#2fc468] transition-all disabled:opacity-70"
              >
                {saving ? "Saving..." : (
                  <span className="flex items-center justify-center gap-2">
                    <FiSave /> Save Changes
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="px-6 py-3.5 font-bold text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition border border-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;