import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiSave, FiArrowLeft, FiImage, FiLink } from "react-icons/fi";

import { productService } from "../services/productService";
import { getImageUrl } from "../utils/imageHelper";
import { useAuth } from "../context/AuthContext";
import { convertUSDToLocal, convertLocalToUSD } from "../utils/currencyHelper";
import { toDateInputValue } from "../utils/dateHelper";
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
      } catch (err) {
        toast.error("Failed to load product.");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, currency]);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", product.name);
      fd.append("category", product.category);
      fd.append("expiryDate", product.expiryDate);

      if (product.price !== "" && product.price !== null && product.price !== undefined) {
        const priceInUSD = convertLocalToUSD(parseFloat(product.price), currency);
        fd.append("price", priceInUSD);
      }

      if (product.weight !== "" && product.weight !== null && product.weight !== undefined) {
        fd.append("weight", product.weight);
        fd.append("unit", product.unit);
      }

      if (file) {
        fd.append("image", file);
      } else if (product.image) {
        fd.append("image", product.image);
      }

      await productService.updateProduct(id, fd);
      toast.success("Product updated!");
      navigate("/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-white">Loading product details...</div>;
  }

  const inputStyle =
    "w-full p-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] outline-none transition-all";
  const labelStyle =
    "block text-xs font-bold text-[#38E07B] uppercase tracking-wider mb-2";

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
            Update details for <span className="text-[#38E07B]">{product.name}</span>
          </p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-0">
          {/* Left: Image */}
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
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
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

          {/* Right: Form */}
          <div className="md:col-span-2 p-8 space-y-6">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className={labelStyle}>Product Name</label>
                <input
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>

              {/* Category + Expiry */}
              <div className="grid grid-cols-2 gap-6">
                {/* ✅ Custom dropdown */}
                <SelectMenu
                  label="Category"
                  value={product.category}
                  onChange={(val) => setProduct((p) => ({ ...p, category: val }))}
                  options={CATEGORY_OPTIONS}
                />

                <div>
                  <label className={labelStyle}>Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={product.expiryDate}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                    min={todayISO}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>

              {/* Price + Quantity */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Price ({currency})</label>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    className={inputStyle}
                    placeholder="0.00"
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
                      value={product.weight ?? ""}
                      onChange={handleChange}
                      className={`${inputStyle} flex-1`}
                      placeholder="0"
                      min="0"
                    />

                    {/* ✅ Custom dropdown for unit */}
                    <SelectMenu
                      value={product.unit}
                      onChange={(val) => setProduct((p) => ({ ...p, unit: val }))}
                      options={UNIT_OPTIONS}
                      className="w-28"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
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