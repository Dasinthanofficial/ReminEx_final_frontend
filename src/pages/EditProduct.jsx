import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productService } from "../services/productService";
import { getImageUrl } from "../utils/imageHelper";
import { useAuth } from "../context/AuthContext";
import { convertUSDToLocal, convertLocalToUSD } from "../utils/currencyHelper";
import { FiSave, FiArrowLeft, FiImage, FiCalendar, FiUpload, FiLink } from "react-icons/fi";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currency } = useAuth();

  const [product, setProduct] = useState({
    name: "",
    category: "Food",
    expiryDate: "",
    price: "",
    weight: "",
    image: ""
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProduct(id);
        const formattedDate = data.expiryDate 
          ? new Date(data.expiryDate).toISOString().split('T')[0] 
          : "";

        const localPrice = data.price 
          ? convertUSDToLocal(data.price, currency) 
          : "";

        setProduct({
          ...data,
          price: localPrice,
          expiryDate: formattedDate
        });

        setPreview(getImageUrl(data.image));
      } catch (err) {
        toast.error("Failed to load product.");
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, currency]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
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
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", product.name);
      fd.append("category", product.category);
      fd.append("expiryDate", product.expiryDate);
      
      if (product.price) {
        const priceInUSD = convertLocalToUSD(parseFloat(product.price), currency);
        fd.append("price", priceInUSD);
      }

      if (product.weight) fd.append("weight", product.weight);
      
      if (file) {
        fd.append("image", file);
      } else if (product.image) {
        fd.append("image", product.image);
      }

      await productService.updateProduct(id, fd);
      toast.success(`Product updated!`);
      navigate("/products");
    } catch (err) {
      const msg = err.response?.data?.message || "Update failed.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-white">Loading product details...</div>;

  // Styles
  const inputStyle = "w-full p-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] outline-none transition-all";
  const labelStyle = "block text-xs font-bold text-[#38E07B] uppercase tracking-wider mb-2";

  return (
    <div className="max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/products" className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition border border-white/5">
           <FiArrowLeft size={24} />
        </Link>
        <div>
           <h1 className="text-2xl font-bold text-white">Edit Product</h1>
           <p className="text-sm text-gray-400">Update details for <span className="text-[#38E07B]">{product.name}</span></p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-0">
          
          {/* Left Column: Image Upload */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-center bg-black/20">
             <div className="w-full aspect-square rounded-xl overflow-hidden bg-black/40 border-2 border-dashed border-white/10 flex items-center justify-center relative group mb-6">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
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
                  value={product.image && !product.image.startsWith('/uploads') && !file ? product.image : ''}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={`${inputStyle} text-sm`}
                />
             </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="md:col-span-2 p-8 space-y-6">
             
             <div className="space-y-6">
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

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className={labelStyle}>Category</label>
                      <select
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        className={`${inputStyle} appearance-none cursor-pointer`}
                      >
                        <option value="Food" className="bg-[#122017]">Food</option>
                        <option value="Non-Food" className="bg-[#122017]">Non-Food</option>
                      </select>
                   </div>
                   
                   <div>
                      <label className={labelStyle}>Expiry Date</label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={product.expiryDate}
                        onChange={handleChange}
                        className={inputStyle}
                        required
                        style={{ colorScheme: "dark" }}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className={labelStyle}>Price ({currency})</label>
                      <div className="relative">
                         <span className="absolute left-4 top-3.5 text-gray-500 text-sm font-bold pointer-events-none">
                           {currency}
                         </span>
                         <input
                           type="number"
                           name="price"
                           value={product.price}
                           onChange={handleChange}
                           className={`${inputStyle} pl-16`}
                           placeholder="0.00"
                           step="0.01"
                         />
                      </div>
                   </div>

                   <div>
                      <label className={labelStyle}>Weight (g)</label>
                      <input
                        type="number"
                        name="weight"
                        value={product.weight}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder="0"
                      />
                   </div>
                </div>
             </div>

             <div className="pt-6 flex gap-4 border-t border-white/10 mt-6">
                <button 
                  type="submit"
                  disabled={saving} 
                  className="flex-1 bg-[#38E07B] text-[#122017] font-bold py-3.5 rounded-xl hover:bg-[#2fc468] hover:shadow-[0_0_20px_rgba(56,224,123,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
                >
                   {saving ? 'Saving...' : <><FiSave /> Save Changes</>}
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/products')}
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