import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPackage, FiAlertTriangle, FiDollarSign, FiPlus, FiChevronRight } from 'react-icons/fi';
import { format } from 'date-fns';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import RecipeSuggestions from '../components/RecipeSuggestions';
import MonthlyReport from '../components/MonthlyReport';

const UserDashboard = () => {
  const { user, isPremium } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  // Calculate statistics
  const stats = {
    totalProducts: products?.length || 0,
    expiringThisWeek: products?.filter(p => {
      const daysUntilExpiry = Math.ceil((new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
    }).length || 0,
    expiredProducts: products?.filter(p => new Date(p.expiryDate) < new Date()).length || 0,
    totalValue: products?.reduce((sum, p) => sum + (p.price || 0), 0) || 0,
  };

  const recentProducts = products?.slice(0, 5) || [];
  const expiringProducts = products?.filter(p => {
    const daysUntilExpiry = Math.ceil((new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  }).slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-primary-100 mb-4">
          Plan: <span className="font-semibold">{user?.plan}</span>
          {user?.planExpiry && (
            <span className="ml-2">
              (Expires: {format(new Date(user.planExpiry), 'MMM dd, yyyy')})
            </span>
          )}
        </p>
        {!isPremium && (
          <Link
            to="/plans"
            className="inline-flex items-center bg-white text-primary-500 px-4 py-2 rounded-lg hover:bg-primary-50 transition"
          >
            Upgrade to Premium <FiChevronRight className="ml-1" />
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <FiPackage className="text-primary-500 text-2xl" />
            <span className="text-2xl font-bold">{stats.totalProducts}</span>
          </div>
          <p className="text-gray-600">Total Products</p>
          {user?.plan === 'Free' && (
            <p className="text-xs text-gray-500 mt-2">Max 5 products</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <FiAlertTriangle className="text-yellow-500 text-2xl" />
            <span className="text-2xl font-bold">{stats.expiringThisWeek}</span>
          </div>
          <p className="text-gray-600">Expiring This Week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <FiAlertTriangle className="text-red-500 text-2xl" />
            <span className="text-2xl font-bold">{stats.expiredProducts}</span>
          </div>
          <p className="text-gray-600">Expired Products</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <FiDollarSign className="text-green-500 text-2xl" />
            <span className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</span>
          </div>
          <p className="text-gray-600">Total Value</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Products</h2>
            <Link
              to="/products/add"
              className="text-primary-500 hover:text-primary-600 flex items-center"
            >
              <FiPlus className="mr-1" /> Add New
            </Link>
          </div>
          
          {recentProducts.length > 0 ? (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div key={product._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                      Expires: {format(new Date(product.expiryDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    ${product.price || 0}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No products added yet</p>
          )}
          
          <Link
            to="/products"
            className="mt-4 block text-center text-primary-500 hover:text-primary-600"
          >
            View All Products
          </Link>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Expiring Soon</h2>
          
          {expiringProducts.length > 0 ? (
            <div className="space-y-3">
              {expiringProducts.map((product) => {
                const daysUntilExpiry = Math.ceil((new Date(product.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={product._id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600">
                          {product.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-yellow-700">
                          {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''} left
                        </p>
                        <p className="text-xs text-gray-500">
                          ${product.price || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No products expiring soon</p>
          )}
        </div>
      </div>

      {/* Premium Features */}
      {isPremium && (
        <>
          <MonthlyReport month={selectedMonth} year={selectedYear} />
          <RecipeSuggestions />
        </>
      )}

      {/* Upgrade CTA for Free Users */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Unlock Premium Features</h2>
          <p className="mb-6">Get unlimited products, AI recipes, and detailed reports</p>
          <Link
            to="/plans"
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Upgrade Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;