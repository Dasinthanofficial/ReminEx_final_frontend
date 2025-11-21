import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';

const AdminAnalytics = () => {
  const { data: stats } = useQuery({
    queryKey: ['adminStats', 12, 2024], // Defaulting to current date or adding date pickers here
    queryFn: () => api.get('/admin/dashboard'),
  });

  const wasteData = {
    labels: ['Food', 'Non-Food'],
    datasets: [
      {
        label: 'Waste Cost ($)',
        data: [stats?.totalWaste * 0.7 || 0, stats?.totalWaste * 0.3 || 0],
        backgroundColor: ['#EF4444', '#F59E0B'],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Detailed Analytics</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Waste Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">Waste Breakdown by Category</h3>
          <div className="h-64">
            <Bar data={wasteData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Text Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">Insights</h3>
          <div className="space-y-4">
             <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 mb-1">Average Revenue Per User</p>
                <p className="text-2xl font-bold text-blue-800">
                   ${stats?.totalUsers ? (stats.totalRevenue / stats.totalUsers).toFixed(2) : 0}
                </p>
             </div>
             <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600 mb-1">Total Items Wasted</p>
                <p className="text-2xl font-bold text-red-800">{stats?.wastedCount || 0} Items</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;