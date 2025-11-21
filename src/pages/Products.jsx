import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2, FiAlertTriangle, FiCalendar, FiArchive } from 'react-icons/fi';
import { format, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch Products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      setIsModalOpen(false);
      toast.success('Product removed');
    },
    onError: () => {
      setIsModalOpen(false);
      toast.error('Could not remove product');
    }
  });

  // Filter Logic
  const filteredProducts = products?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  // Helper: Get Badge Style
  const getStatusBadge = (expiryDate) => {
    const today = new Date();
    const days = differenceInDays(new Date(expiryDate), today);

    if (days < 0) return { text: 'Expired', className: 'bg-red-100 text-red-700 border-red-200' };
    if (days === 0) return { text: 'Expires Today', className: 'bg-red-100 text-red-700 border-red-200' };
    if (days <= 3) return { text: `${days} Days Left`, className: 'bg-orange-100 text-orange-700 border-orange-200' };
    if (days <= 7) return { text: `${days} Days Left`, className: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    return { text: 'Fresh', className: 'bg-green-100 text-green-700 border-green-200' };
  };

  // Helper: Resolve Image
  const getProductImage = (imgUrl) => {
    if (!imgUrl) return null; // Will show placeholder
    if (imgUrl.startsWith('blob:') || imgUrl.startsWith('http')) return imgUrl;
    const base = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';
    return `${base}${imgUrl.startsWith('/') ? imgUrl : `/${imgUrl}`}`;
  };

  if (user?.role === 'admin') return <div className="p-8 text-center">Admin restricted.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Inventory</h1>
          <p className="text-gray-500 mt-1">Manage your food and household items.</p>
        </div>

        <Link 
          to="/products/add" 
          className="bg-[#38E07B] hover:bg-[#2fc468] text-[#122017] px-5 py-2.5 rounded-xl font-bold shadow-md flex items-center gap-2 transition-colors"
        >
          <FiPlus size={20} /> Add Product
        </Link>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for apples, milk, etc..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-0 rounded-xl transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-0 rounded-xl outline-none appearance-none cursor-pointer"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Food">Food</option>
            <option value="Non-Food">Non-Food</option>
          </select>
        </div>
      </div>

      {/* 3. Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const status = getStatusBadge(product.expiryDate);
            const imgSrc = getProductImage(product.image);

            return (
              <div key={product._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                
                {/* Card Image */}
                <div className="relative h-48 bg-gray-50 overflow-hidden">
                   {imgSrc ? (
                     <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-4xl">
                        {product.category === 'Food' ? '🥗' : '📦'}
                     </div>
                   )}
                   
                   {/* Status Badge */}
                   <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${status.className}`}>
                     {status.text}
                   </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{product.category}</p>
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-1" title={product.name}>{product.name}</h3>
                    </div>
                    {product.price && <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">${product.price}</span>}
                  </div>

                  <div className="mt-auto pt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiCalendar className="mr-2" />
                      <span>Exp: {format(new Date(product.expiryDate), 'MMM dd, yyyy')}</span>
                    </div>
                    {product.weight && (
                       <div className="flex items-center text-sm text-gray-500">
                         <FiArchive className="mr-2" />
                         <span>{product.weight}g</span>
                       </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-gray-50">
                    <Link 
                      to={`/products/edit/${product._id}`} 
                      className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiEdit2 /> Edit
                    </Link>
                    <button 
                      onClick={() => { setProductToDelete(product); setIsModalOpen(true); }}
                      className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🤷‍♂️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or add a new item.</p>
          <Link to="/products/add" className="inline-flex items-center gap-2 text-[#122017] font-bold hover:underline">
            <FiPlus /> Add New Product
          </Link>
        </div>
      )}

      {/* Delete Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <FiAlertTriangle />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to remove <strong>{productToDelete?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteMutation.mutate(productToDelete._id)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;