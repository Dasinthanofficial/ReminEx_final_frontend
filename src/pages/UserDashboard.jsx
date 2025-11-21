import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiAlertTriangle, FiTrendingUp } from 'react-icons/fi';
import { format, differenceInDays } from 'date-fns';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import RecipeSuggestions from '../components/RecipeSuggestions';
import MonthlyReport from '../components/MonthlyReport';

const UserDashboard = () => {
  const { user, isPremium } = useAuth();
  const today = new Date();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
    enabled: user?.role !== 'admin',
  });

  const stats = {
    total: products?.length || 0,
    expiring: products?.filter(p => {
      const diff = differenceInDays(new Date(p.expiryDate), today);
      return diff >= 0 && diff <= 7;
    }).length || 0,
    expired: products?.filter(p => new Date(p.expiryDate) < today).length || 0,
    value: products?.reduce((sum, p) => sum + (p.price || 0), 0) || 0,
  };

  const expiringProducts = products?.filter(p => {
      const diff = differenceInDays(new Date(p.expiryDate), today);
      return diff >= 0 && diff <= 7;
    })
    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
    .slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
         <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Here's what's happening with your inventory.</p>
         </div>
         <div className="text-sm text-gray-400 font-medium">
            {format(today, 'EEEE, MMM do')}
         </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard title="Total Products" value={stats.total} icon={<FiPackage />} color="text-blue-600 bg-blue-50" />
         <StatCard title="Expiring Soon" value={stats.expiring} icon={<FiClock />} color="text-yellow-600 bg-yellow-50" />
         <StatCard title="Expired Items" value={stats.expired} icon={<FiAlertTriangle />} color="text-red-600 bg-red-50" />
         <StatCard title="Total Value" value={`$${stats.value}`} icon={<FiTrendingUp />} color="text-green-600 bg-green-50" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Left: Main Actions & Lists */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Expiring List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Expiring Within 7 Days</h3>
                  <Link to="/products" className="text-sm text-green-600 font-medium hover:underline">View All</Link>
               </div>
               
               {isLoading ? (
                 <div className="h-32 bg-gray-50 animate-pulse rounded-xl"></div>
               ) : expiringProducts.length > 0 ? (
                 <div className="space-y-3">
                    {expiringProducts.map(p => (
                       <div key={p._id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                          <div className="flex items-center gap-4">
                             <div className="text-2xl">{p.category === 'Food' ? '🥗' : '📦'}</div>
                             <div>
                                <p className="font-bold text-gray-800">{p.name}</p>
                                <p className="text-xs text-gray-500">Expires {format(new Date(p.expiryDate), 'MMM dd')}</p>
                             </div>
                          </div>
                          <span className="text-xs font-bold text-yellow-700 bg-yellow-200 px-2 py-1 rounded">
                             {differenceInDays(new Date(p.expiryDate), today)} days left
                          </span>
                       </div>
                    ))}
                 </div>
               ) : (
                 <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    No items expiring soon. Great job!
                 </div>
               )}
            </div>

            {/* AI Recipes */}
            {isPremium ? <RecipeSuggestions /> : (
               <div className="bg-gradient-to-r from-[#122017] to-gray-900 text-white rounded-2xl p-8 text-center">
                  <h3 className="text-xl font-bold mb-2">Unlock AI Recipes 👩‍🍳</h3>
                  <p className="text-gray-400 mb-6">Get cooking ideas based on your inventory.</p>
                  <Link to="/plans" className="bg-[#38E07B] text-black px-6 py-2 rounded-lg font-bold hover:bg-white transition">Upgrade to Pro</Link>
               </div>
            )}
         </div>

         {/* Right: Reports Widget */}
         <div>
            {isPremium ? (
               <MonthlyReport month={today.getMonth()+1} year={today.getFullYear()} />
            ) : (
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center text-center opacity-70">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl mb-4">📊</div>
                  <h3 className="font-bold text-gray-800">Monthly Reports</h3>
                  <p className="text-sm text-gray-500 mt-2">Premium feature locked</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
   <motion.div 
     initial={{ opacity: 0, y: 10 }}
     animate={{ opacity: 1, y: 0 }}
     className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
   >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>
         {icon}
      </div>
      <div>
         <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">{title}</p>
         <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
      </div>
   </motion.div>
);

export default UserDashboard;