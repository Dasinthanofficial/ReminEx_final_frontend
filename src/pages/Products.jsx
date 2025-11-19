import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Removed Fi icon imports and replaced with inline SVGs below
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';

// --- Inline SVG Icon Definitions (Lucide equivalents) to avoid external dependency errors ---

const IconPlus = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}><path d="M12 5v14M5 12h14"/></svg>);
const IconPencil = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>);
const IconTrash2 = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>);
const IconSearch = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>);
const IconFilter = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}><path d="M22 3H2l8 12.46V19l4 2v-5.54L22 3z"/></svg>);
const IconLock = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
const IconAlertTriangle = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}><path d="m21.73 18-9-16a2 2 0 0 0-3.46 0l-9 16a2 2 0 0 0 1.73 3H20a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>);


// Helper component for the delete confirmation modal
const DeleteConfirmationModal = ({ productName, onConfirm, onCancel, isDeleting }) => (
  // Backdrop
  <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
    {/* Modal Container */}
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100">
      <div className="text-center">
        <IconAlertTriangle className="mx-auto h-10 w-10 text-red-600 mb-4" />
        <h3 className="text-lg leading-6 font-bold text-gray-900">Confirm Deletion</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete the product: <span className="font-semibold text-gray-700">{productName}</span>? This action cannot be undone.
          </p>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 space-y-3">
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="w-full inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 disabled:opacity-50 transition"
        >
          {isDeleting ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <IconTrash2 className="mr-2" />
          )}
          {isDeleting ? 'Deleting...' : 'Yes, Delete'}
        </button>
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);


const Products = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // State for confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState({ id: null, name: '' });

  // Admin restriction check
  if (user?.role === 'admin') {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <IconLock className="text-red-600 text-4xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Admin Access Restricted</h2>
          <p className="text-gray-600 mb-6">
            Administrators cannot add or manage products. This feature is exclusively for regular users 
            to track their personal inventory.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-yellow-900 mb-3">Why this restriction?</h3>
            <ul className="text-left text-yellow-800 space-y-2 text-sm">
              <li>• Products are personal inventory items for individual users</li>
              <li>• Admins manage system-wide settings, not user data</li>
              <li>• This ensures data privacy and proper access control</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              to="/admin"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              Go to Admin Panel
            </Link>
            <Link
              to="/"
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Back to Home
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            To use product tracking, create a regular user account.
          </p>
        </div>
      </div>
    );
  }

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      // The toast is handled in confirmDelete
    },
    onError: () => {
      // The toast is handled in confirmDelete
    },
  });

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  // Show the custom modal instead of window.confirm
  const handleDelete = (id, name) => {
    setProductToDelete({ id, name });
    setIsModalOpen(true);
  };
  
  // Function to execute the delete mutation after confirmation
  const confirmDelete = () => {
    if (productToDelete.id) {
      deleteMutation.mutate(productToDelete.id, {
        onSuccess: () => {
          queryClient.invalidateQueries(['products']);
          setIsModalOpen(false);
          setProductToDelete({ id: null, name: '' });
          toast.success('Product deleted successfully');
        },
        onError: () => {
          setIsModalOpen(false);
          toast.error('Failed to delete product');
        }
      });
    }
  };


  const getExpiryStatus = (expiryDate) => {
    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: 'Expired', color: 'text-red-600 bg-red-50' };
    if (days <= 7) return { text: `${days} days`, color: 'text-yellow-600 bg-yellow-50' };
    if (days <= 30) return { text: `${days} days`, color: 'text-blue-600 bg-blue-50' };
    return { text: `${days} days`, color: 'text-green-600 bg-green-50' };
  };

  const canAddMore = user?.plan !== 'Free' || (products?.length || 0) < 5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Products</h1>
          <p className="text-gray-600 mt-1">
            {products?.length || 0} product{(products?.length || 0) !== 1 ? 's' : ''} tracked
            {user?.plan === 'Free' && ` (${products?.length || 0}/5 limit)`}
          </p>
        </div>
        {canAddMore ? (
          <Link
            to="/products/add"
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition flex items-center"
          >
            <IconPlus className="mr-2 w-5 h-5" /> Add Product
          </Link>
        ) : (
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Product limit reached</p>
            <Link to="/plans" className="text-primary-500 hover:text-primary-600 text-sm">
              Upgrade to add more
            </Link>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <IconFilter className="text-gray-400 w-5 h-5" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Food">Food</option>
              <option value="Non-Food">Non-Food</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const status = getExpiryStatus(product.expiryDate);
            return (
              <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>Category: <span className="font-medium text-gray-800">{product.category}</span></p>
                    <p>Expiry: <span className="font-medium text-gray-800">
                      {format(new Date(product.expiryDate), 'MMM dd, yyyy')}
                    </span></p>
                    {product.price && (
                      <p>Price: <span className="font-medium text-gray-800">${product.price}</span></p>
                    )}
                    {product.weight && (
                      <p>Weight: <span className="font-medium text-gray-800">{product.weight}g</span></p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/products/edit/${product._id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
                    >
                      <IconPencil className="mr-1 w-5 h-5" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition flex items-center justify-center"
                    >
                      <IconTrash2 className="mr-1 w-5 h-5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 mb-4">
            {searchTerm || filterCategory !== 'all' 
              ? 'No products found matching your filters'
              : 'You haven\'t added any products yet'}
          </p>
          {canAddMore && !searchTerm && filterCategory === 'all' && (
            <Link
              to="/products/add"
              className="text-primary-500 hover:text-primary-600 font-semibold"
            >
              Add Your First Product
            </Link>
          )}
        </div>
      )}
      
      {/* Render the confirmation modal if open */}
      {isModalOpen && (
        <DeleteConfirmationModal
          productName={productToDelete.name}
          onConfirm={confirmDelete}
          onCancel={() => setIsModalOpen(false)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

export default Products;