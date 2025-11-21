import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { productService } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import { convertLocalToUSD } from "../utils/currencyHelper";
import { FiImage, FiUpload, FiLink } from "react-icons/fi";

const AddProduct = () => {
  const navigate = useNavigate();
  const { currency } = useAuth();

  const [form, setForm] = useState({
    name: "",
    category: "Food",
    expiryDate: "",
    price: "",
    weight: "",
    image: "", 
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
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
        const priceInUSD = convertLocalToUSD(parseFloat(form.price), currency);
        fd.append("price", priceInUSD);
      }

      if (form.weight) fd.append("weight", form.weight);
      if (file) fd.append("image", file);
      else if (form.image) fd.append("image", form.image);

      await productService.addProduct(fd);
      toast.success(`Product added!`);
      navigate("/products");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add product";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Common Input Style
  const inputStyle = "w-full p-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] outline-none transition-all";
  const labelStyle = "block text-xs font-bold text-[#38E07B] uppercase tracking-wider mb-2";

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl my-8">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">Add New Product</h1>
        <p className="text-gray-300 mt-1">Enter details below to track your inventory.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
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
              <option value="Food" className="bg-[#122017] text-white">Food</option>
              <option value="Non-Food" className="bg-[#122017] text-white">Non-Food</option>
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
             style={{ colorScheme: "dark" }} // 👈 Forces calendar picker to be dark mode
           />
        </div>

        {/* Price & Weight */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>
              Price ({currency})
            </label>
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
            <label className={labelStyle}>Weight (g)</label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="e.g. 500"
              className={inputStyle}
            />
          </div>
        </div>

        <hr className="border-white/10 my-6" />

        {/* Image Upload Section */}
        <div>
          <label className={labelStyle}>Product Image</label>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* File Upload */}
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white/5 hover:bg-white/10 transition cursor-pointer relative group">
               <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
               {preview ? (
                 <div className="relative w-full h-40">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-lg border border-white/10" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-white font-bold text-sm">Change Image</div>
                 </div>
               ) : (
                 <>
                   <div className="w-12 h-12 rounded-full bg-[#38E07B]/10 flex items-center justify-center mb-3 text-[#38E07B]">
                      <FiUpload className="text-xl" />
                   </div>
                   <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">Click to Upload Photo</span>
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