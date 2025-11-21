import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { FiUsers, FiDollarSign, FiActivity, FiBox, FiSettings, FiLayers, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currencyHelper';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const { currency } = useAuth();
  const [selectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear] = useState(new Date().getFullYear());

  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats', selectedMonth, selectedYear],
    queryFn: () => api.get(`/admin/dashboard?month=${selectedMonth}&year=${selectedYear}`),
  });

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
      borderColor: '#38E07B',
      backgroundColor: 'rgba(56, 224, 123, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#122017',
      pointBorderColor: '#38E07B',
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#9CA3AF' } },
    },
    scales: {
      y: { ticks: { color: '#6B7280' }, grid: { color: '#374151' } },
      x: { ticks: { color: '#9CA3AF' }, grid: { display: false } },
    },
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen text-white">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen space-y-8">
      
      {/* 1. Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm">Overview of system performance.</p>
        </div>
        
        <div className="flex gap-3">
           <Link 
             to="/admin/users"
             className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 text-white rounded-lg hover:bg-white/20 transition shadow-sm text-sm font-bold"
           >
             <FiUsers /> Manage Users
           </Link>
           <Link 
             to="/admin/plans"
             className="flex items-center gap-2 px-4 py-2 bg-[#38E07B] text-[#122017] rounded-lg hover:bg-[#2fc468] transition shadow-lg shadow-[#38E07B]/20 text-sm font-bold"
           >
             <FiLayers /> Configure Plans
           </Link>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          label="Total Revenue"
          value={formatPrice(stats?.totalRevenue || 0, currency)}
          icon={<FiDollarSign className="text-emerald-400 text-xl" />}
          bg="bg-emerald-500/20"
          border="border-emerald-500/30"
        />
        <KPICard
          label="Total Users"
          value={stats?.totalUsers || 0}
          icon={<FiUsers className="text-blue-400 text-xl" />}
          bg="bg-blue-500/20"
          border="border-blue-500/30"
        />
        <KPICard
          label="Premium Subscribers"
          value={stats?.premiumUsers || 0}
          icon={<FiActivity className="text-purple-400 text-xl" />}
          bg="bg-purple-500/20"
          border="border-purple-500/30"
        />
        <KPICard
          label="Items Wasted"
          value={stats?.wastedCount || 0}
          icon={<FiBox className="text-orange-400 text-xl" />}
          bg="bg-orange-500/20"
          border="border-orange-500/30"
        />
      </div>

      {/* 3. Management Section */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg">
         <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <FiSettings className="text-[#38E07B]" /> System Configuration
         </h3>
         <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center group hover:bg-white/10 hover:border-[#38E07B]/30 transition-all cursor-pointer">
               <div>
                  <h4 className="font-bold text-white group-hover:text-[#38E07B] transition-colors">Subscription Plans</h4>
                  <p className="text-xs text-gray-400 mt-1">Set prices (Monthly/Yearly) and edit features.</p>
               </div>
               <Link to="/admin/plans" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#38E07B] group-hover:bg-[#38E07B]/10 transition-all">
                  <FiArrowRight />
               </Link>
            </div>

            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center group hover:bg-white/10 hover:border-[#38E07B]/30 transition-all cursor-pointer">
               <div>
                  <h4 className="font-bold text-white group-hover:text-[#38E07B] transition-colors">User Database</h4>
                  <p className="text-xs text-gray-400 mt-1">View, delete, or monitor user accounts.</p>
               </div>
               <Link to="/admin/users" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#38E07B] group-hover:bg-[#38E07B]/10 transition-all">
                  <FiArrowRight />
               </Link>
            </div>
         </div>
      </div>

      {/* 4. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg">
          <h3 className="font-bold text-white mb-6">Revenue Trends</h3>
          <div className="h-72">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ label, value, icon, bg, border }) => (
  <div className={`bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-lg flex items-center gap-4 hover:bg-white/[0.07] transition-all`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} border ${border}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{label}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
  </div>
);

export default AdminDashboard;