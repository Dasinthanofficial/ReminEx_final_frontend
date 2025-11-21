import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productService } from "../services/productService";
import { getImageUrl } from "../utils/imageHelper";
import { FiSave, FiArrowLeft, FiImage, FiCalendar, FiDollarSign, FiBox } from "react-icons/fi";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  // Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProduct(id);
        
        // Format date for input (YYYY-MM-DD)
        const formattedDate = data.expiryDate 
          ? new Date(data.expiryDate).toISOString().split('T')[0] 
          : "";

        setProduct({
          ...data,
          expiryDate: formattedDate
        });

        // Set initial preview using helper
        setPreview(getImageUrl(data.image));
      } catch (err) {
        toast.error("Failed to load product.");
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

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
      
      if (product.price) fd.append("price", product.price);
      if (product.weight) fd.append("weight", product.weight);
      
      // Logic: If new file, send file. Else if URL string changed, send string. 
      // If neither changed, backend keeps existing.
      if (file) {
        fd.append("image", file);
      } else if (product.image) {
        fd.append("image", product.image);
      }

      await productService.updateProduct(id, fd);
      toast.success("Product updated successfully!");
      navigate("/products");
    } catch (err) {
      const msg = err.response?.data?.message || "Update failed.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading product details...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/products" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
           <FiArrowLeft size={24} />
        </Link>
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
           <p className="text-sm text-gray-500">Update details for {product.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-0">
          
          {/* Left Column: Image Upload */}
          <div className="p-8 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center">
             <div className="w-full aspect-square rounded-xl overflow-hidden bg-white border-2 border-dashed border-gray-300 flex items-center justify-center relative group mb-4">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <FiImage className="mx-auto text-4xl mb-2" />
                    <span className="text-sm">No Image</span>
                  </div>
                )}
                
                {/* Overlay for file input */}
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-semibold">
                   Change Image
                   <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
             </div>

             <div className="w-full">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Or paste Image URL</p>
                <input
                  type="url"
                  name="image"
                  value={product.image && !product.image.startsWith('/uploads') && !file ? product.image : ''}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full p-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#38E07B]"
                />
             </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="md:col-span-2 p-8 space-y-6">
             
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                   <input
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#38E07B] focus:ring-0 outline-none transition"
                      required
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                      <select
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#38E07B] outline-none cursor-pointer"
                      >
                        <option value="Food">Food</option>
                        <option value="Non-Food">Non-Food</option>
                      </select>
                   </div>
                   
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Expiry Date</label>
                      <div className="relative">
                         <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
                         <input
                           type="date"
                           name="expiryDate"
                           value={product.expiryDate}
                           onChange={handleChange}
                           className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#38E07B] outline-none"
                           required
                         />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                      <div className="relative">
                         <FiDollarSign className="absolute left-3 top-3.5 text-gray-400" />
                         <input
                           type="number"
                           name="price"
                           value={product.price}
                           onChange={handleChange}
                           className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#38E07B] outline-none"
                           placeholder="0.00"
                         />
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Weight (g)</label>
                      <div className="relative">
                         <FiBox className="absolute left-3 top-3.5 text-gray-400" />
                         <input
                           type="number"
                           name="weight"
                           value={product.weight}
                           onChange={handleChange}
                           className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#38E07B] outline-none"
                           placeholder="0"
                         />
                      </div>
                   </div>
                </div>
             </div>

             <div className="pt-4 flex gap-3">
                <button 
                  type="submit"
                  disabled={saving} 
                  className="flex-1 bg-[#38E07B] text-[#122017] font-bold py-3 rounded-xl hover:bg-[#2fc468] hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                   {saving ? 'Saving...' : <><FiSave /> Save Changes</>}
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/products')}
                  className="px-6 py-3 font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
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