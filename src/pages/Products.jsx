import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiLock } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Admin restriction check
  if (user?.role === 'admin') {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiLock className="text-red-600 text-4xl" />
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
      queryClient.invalidateQueries(['products']);
      toast.success('Product deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMutation.mutate(id);
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
            <FiPlus className="mr-2" /> Add Product
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
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
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
                      <FiEdit className="mr-1" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition flex items-center justify-center"
                    >
                      <FiTrash2 className="mr-1" /> Delete
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
    </div>
  );
};

export default Products;