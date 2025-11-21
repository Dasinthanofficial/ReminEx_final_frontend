import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currencyHelper';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminAnalytics = () => {
  const { currency } = useAuth(); // 👈 Get currency

  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'], 
    queryFn: () => api.get(`/admin/dashboard`),
  });

  if (isLoading) return <div className="text-white text-center py-20">Loading Analytics...</div>;

  const wasteData = {
    labels: ['Food', 'Non-Food'],
    datasets: [
      {
        label: 'Waste Cost',
        data: [stats?.totalWaste * 0.7 || 0, stats?.totalWaste * 0.3 || 0],
        backgroundColor: ['#EF4444', '#F59E0B'],
        borderRadius: 8,
        barThickness: 40,
      },
    ],
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Detailed Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Deep dive into system performance.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* 📊 Waste Chart */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Waste Breakdown
          </h3>
          <div className="h-72">
            <Bar data={wasteData} options={chartOptions} />
          </div>
        </div>

        {/* 📈 Text Summary */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#38E07B] rounded-full animate-pulse"></span>
            Key Insights
          </h3>
          
          <div className="space-y-4">
             {/* ARPU Card */}
             <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl hover:bg-blue-500/20 transition-colors">
                <p className="text-xs text-blue-400 uppercase font-bold tracking-wider mb-1">Avg. Revenue Per User</p>
                <p className="text-3xl font-bold text-white">
                   {formatPrice(stats?.totalUsers ? (stats.totalRevenue / stats.totalUsers) : 0, currency)}
                </p>
             </div>

             {/* Wasted Items Card */}
             <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500/20 transition-colors">
                <p className="text-xs text-red-400 uppercase font-bold tracking-wider mb-1">Total Items Wasted</p>
                <p className="text-3xl font-bold text-white">
                  {stats?.wastedCount || 0} <span className="text-base font-normal text-gray-400">Items</span>
                </p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;