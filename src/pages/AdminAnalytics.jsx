import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currencyHelper';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminAnalytics = () => {
  const { currency } = useAuth();

  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['adminStats'],
    // api.get already returns JSON body, not AxiosResponse
    queryFn: () => api.get('/admin/dashboard'),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="text-white text-center py-20">
        Loading Analytics...
      </div>
    );
  }

  if (isError || !stats) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      'Unable to load admin analytics.';
    return (
      <div className="text-red-300 text-center py-20">
        <p className="font-semibold">{msg}</p>
      </div>
    );
  }

  // Safe numeric values
  const totalWaste = Number(stats.totalWaste || 0);
  const wastedCount = Number(stats.wastedCount || 0);
  const totalRevenue = Number(stats.totalRevenue || 0);
  const totalUsers = Number(stats.totalUsers || 0);

  const avgRevenuePerUser =
    totalUsers > 0 ? totalRevenue / totalUsers : 0;

  // Label for current dashboard month/year
  const labelDate = new Date(stats.year, stats.month - 1, 1);
  const monthLabel = labelDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  // Show single bar for total waste
  const wasteData = {
    labels: ['Total Waste'],
    datasets: [
      {
        label: 'Total Waste',
        data: [totalWaste],
        backgroundColor: ['#EF4444'],
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
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${formatPrice(ctx.parsed.y || 0, currency)} wasted`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#6B7280',
          callback: (value) => formatPrice(value, currency),
        },
        grid: { color: '#374151' },
      },
      x: {
        ticks: { color: '#9CA3AF' },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Detailed Analytics
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Overview for {monthLabel}.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 📊 Waste Chart */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Waste Overview
          </h3>
          <div className="h-72">
            {totalWaste > 0 ? (
              <Bar data={wasteData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No recorded waste for this period.
              </div>
            )}
          </div>
        </div>

        {/* 📈 Text Summary */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#38E07B] rounded-full animate-pulse" />
            Key Insights
          </h3>

          <div className="space-y-4">
            {/* ARPU Card */}
            <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl hover:bg-blue-500/20 transition-colors">
              <p className="text-xs text-blue-400 uppercase font-bold tracking-wider mb-1">
                Avg. Revenue Per User
              </p>
              <p className="text-3xl font-bold text-white">
                {formatPrice(avgRevenuePerUser, currency)}
              </p>
            </div>

            {/* Wasted Items Card */}
            <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500/20 transition-colors">
              <p className="text-xs text-red-400 uppercase font-bold tracking-wider mb-1">
                Total Items Wasted
              </p>
              <p className="text-3xl font-bold text-white">
                {wastedCount}{' '}
                <span className="text-base font-normal text-gray-400">
                  Items
                </span>
              </p>
            </div>

            {/* Total Waste Value Card */}
            <div className="p-5 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl hover:bg-yellow-500/20 transition-colors">
              <p className="text-xs text-yellow-300 uppercase font-bold tracking-wider mb-1">
                Total Waste Value
              </p>
              <p className="text-3xl font-bold text-white">
                {formatPrice(totalWaste, currency)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;