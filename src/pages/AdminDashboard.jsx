import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiBox,
  FiSettings, 
  FiLayers,  
  FiArrowRight
} from 'react-icons/fi';
import api from '../services/api';

// Register Charts
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch Stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats', selectedMonth, selectedYear],
    queryFn: () => api.get(`/admin/dashboard?month=${selectedMonth}&year=${selectedYear}`),
  });

  // Chart Data Logic (Simplified for brevity, keep your existing logic)
  const revenueData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Revenue',
      data: [
        (stats?.totalRevenue || 0) * 0.15,
        (stats?.totalRevenue || 0) * 0.45,
        (stats?.totalRevenue || 0) * 0.75,
        stats?.totalRevenue || 0
      ],
      borderColor: '#0f172a',
      backgroundColor: 'rgba(15, 23, 42, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen text-gray-500">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 space-y-8">
      
      {/* 1. Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Executive Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of system performance.</p>
        </div>
        
        {/* 🟢 NEW: QUICK ACTION BUTTONS */}
        <div className="flex gap-3">
           <Link 
             to="/admin/users"
             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm"
           >
             <FiUsers /> Manage Users
           </Link>
           <Link 
             to="/admin/plans"
             className="flex items-center gap-2 px-4 py-2 bg-[#122017] text-white rounded-lg hover:bg-black transition shadow-lg shadow-gray-900/20"
           >
             <FiLayers /> Configure Premium Plans
           </Link>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          label="Total Revenue"
          value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={<FiDollarSign className="text-emerald-600 text-xl" />}
          bg="bg-emerald-50"
        />
        <KPICard
          label="Total Users"
          value={stats?.totalUsers || 0}
          icon={<FiUsers className="text-blue-600 text-xl" />}
          bg="bg-blue-50"
        />
        <KPICard
          label="Premium Subscribers"
          value={stats?.premiumUsers || 0}
          icon={<FiActivity className="text-purple-600 text-xl" />}
          bg="bg-purple-50"
        />
        <KPICard
          label="Items Wasted"
          value={stats?.wastedCount || 0}
          icon={<FiBox className="text-orange-600 text-xl" />}
          bg="bg-orange-50"
        />
      </div>

      {/* 3. 🟢 NEW: Management Section Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
         <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiSettings /> System Configuration
         </h3>
         <div className="grid md:grid-cols-2 gap-6">
            {/* Plan Management Card */}
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center group hover:border-blue-200 transition-all cursor-pointer">
               <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Subscription Plans</h4>
                  <p className="text-sm text-gray-500 mt-1">Set prices (Monthly/Yearly) and edit features.</p>
               </div>
               <Link to="/admin/plans" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:shadow-md transition-all">
                  <FiArrowRight />
               </Link>
            </div>

            {/* User Management Card */}
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center group hover:border-blue-200 transition-all cursor-pointer">
               <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">User Database</h4>
                  <p className="text-sm text-gray-500 mt-1">View, delete, or monitor user accounts.</p>
               </div>
               <Link to="/admin/users" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:shadow-md transition-all">
                  <FiArrowRight />
               </Link>
            </div>
         </div>
      </div>

      {/* 4. Charts Section (Existing Logic) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Revenue Trends</h3>
          <div className="h-72">
            <Line data={revenueData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        {/* ... other charts ... */}
      </div>
    </div>
  );
};

// Simple KPI Card Component
const KPICard = ({ label, value, icon, bg }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

export default AdminDashboard;