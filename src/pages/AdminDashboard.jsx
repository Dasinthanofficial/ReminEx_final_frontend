import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiPackage,
  FiSettings,
  FiImage,
  FiCalendar
} from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
  Legend
} from 'chart.js';
import api from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats', selectedMonth, selectedYear],
    queryFn: () => api.get(`/admin/dashboard?month=${selectedMonth}&year=${selectedYear}`),
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Chart data
  const revenueChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Revenue',
        data: [1200, 1900, 1500, 2500],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.3,
      },
    ],
  };

  const userDistributionData = {
    labels: ['Free', 'Monthly', 'Yearly'],
    datasets: [
      {
        data: [
          stats?.totalUsers - stats?.premiumUsers || 0,
          Math.floor((stats?.premiumUsers || 0) * 0.6),
          Math.floor((stats?.premiumUsers || 0) * 0.4),
        ],
        backgroundColor: [
          'rgba(156, 163, 175, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const wasteAnalysisData = {
    labels: ['Food', 'Non-Food'],
    datasets: [
      {
        label: 'Waste Value',
        data: [stats?.totalWaste * 0.7 || 0, stats?.totalWaste * 0.3 || 0],
        backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(245, 158, 11, 0.8)'],
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor platform performance and user activity</p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/admin/plans"
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition flex items-center"
          >
            <FiSettings className="mr-2" /> Manage Plans
          </Link>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <FiCalendar className="text-gray-500" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <FiUsers className="text-blue-500 text-2xl" />
            <span className="text-3xl font-bold">{stats?.totalUsers || 0}</span>
          </div>
          <p className="text-gray-600">Total Users</p>
          <p className="text-sm text-green-500 mt-2">+12% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <FiTrendingUp className="text-purple-500 text-2xl" />
            <span className="text-3xl font-bold">{stats?.premiumUsers || 0}</span>
          </div>
          <p className="text-gray-600">Premium Users</p>
          <p className="text-sm text-green-500 mt-2">+8% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <FiDollarSign className="text-green-500 text-2xl" />
            <span className="text-3xl font-bold">${stats?.totalRevenue || 0}</span>
          </div>
          <p className="text-gray-600">Monthly Revenue</p>
          <p className="text-sm text-green-500 mt-2">+25% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <FiPackage className="text-red-500 text-2xl" />
            <span className="text-3xl font-bold">${stats?.totalWaste || 0}</span>
          </div>
          <p className="text-gray-600">Total Waste</p>
          <p className="text-sm text-red-500 mt-2">{stats?.wastedCount || 0} items</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Revenue Trend</h2>
          <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">User Distribution</h2>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut data={userDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Waste Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">Waste Analysis by Category</h2>
        <Bar
          data={wasteAnalysisData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value) {
                    return '$' + value;
                  }
                }
              }
            }
          }}
          height={200}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium">New premium subscription</p>
                <p className="text-sm text-gray-500">John Doe upgraded to Monthly plan</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium">New user registered</p>
                <p className="text-sm text-gray-500">jane@example.com joined the platform</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium">High waste alert</p>
                <p className="text-sm text-gray-500">$500+ worth of products expired today</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;