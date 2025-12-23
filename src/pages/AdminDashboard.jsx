import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
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
  Filler,
} from "chart.js";
import {
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiBox,
  FiSettings,
  FiLayers,
  FiArrowRight,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/currencyHelper";
import api from "../services/api";
import AdminPageShell from "../components/AdminPageShell";

ChartJS.register(
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
);

const AdminDashboard = () => {
  const { currency } = useAuth();
  const [selectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear] = useState(new Date().getFullYear());

  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats", selectedMonth, selectedYear],
    queryFn: () =>
      api.get(`/admin/dashboard?month=${selectedMonth}&year=${selectedYear}`),
    retry: false,
  });

  const totalRevenue = Number(stats?.totalRevenue || 0);

  const revenueData = useMemo(
    () => ({
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Revenue",
          data: [totalRevenue * 0.15, totalRevenue * 0.45, totalRevenue * 0.75, totalRevenue],
          borderColor: "#38E07B",
          backgroundColor: "rgba(56, 224, 123, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#122017",
          pointBorderColor: "#38E07B",
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }),
    [totalRevenue]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(18, 32, 23, 0.9)",
          titleColor: "#38E07B",
          bodyColor: "#fff",
          padding: 10,
          callbacks: {
            label: (context) => ` ${formatPrice(context.parsed.y || 0, currency)}`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            color: "#6B7280",
            font: { size: 10 },
            maxTicksLimit: 5,
            callback: (value) => formatPrice(Number(value) || 0, currency),
          },
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          border: { display: false },
        },
        x: {
          ticks: { color: "#9CA3AF", font: { size: 11 } },
          grid: { display: false },
          border: { display: false },
        },
      },
    }),
    [currency]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <div className="w-8 h-8 border-4 border-[#38E07B] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium opacity-70">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <AdminPageShell>
      <div className="w-full min-w-0 space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 min-w-0">
          <div className="min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight break-words">
              Executive Dashboard
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Overview of system performance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto min-w-0">
            <Link
              to="/admin/users"
              className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-white/10 border border-white/10 text-white rounded-xl hover:bg-white/20 transition shadow-sm text-sm font-bold w-full sm:w-auto"
            >
              <FiUsers className="text-lg" />
              <span className="truncate">Manage Users</span>
            </Link>
            <Link
              to="/admin/plans"
              className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-[#38E07B] text-[#122017] rounded-xl hover:bg-[#2fc468] transition shadow-lg shadow-[#38E07B]/20 text-sm font-bold w-full sm:w-auto"
            >
              <FiLayers className="text-lg" />
              <span className="truncate">Configure Plans</span>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          <KPICard
            label="Total Revenue"
            value={formatPrice(Number(stats?.totalRevenue || 0), currency)}
            icon={<FiDollarSign className="text-emerald-400 text-xl" />}
            bg="bg-emerald-500/20"
            border="border-emerald-500/30"
          />
          <KPICard
            label="Total Users"
            value={Number(stats?.totalUsers || 0)}
            icon={<FiUsers className="text-blue-400 text-xl" />}
            bg="bg-blue-500/20"
            border="border-blue-500/30"
          />
          <KPICard
            label="Premium Subs"
            value={Number(stats?.premiumUsers || 0)}
            icon={<FiActivity className="text-purple-400 text-xl" />}
            bg="bg-purple-500/20"
            border="border-purple-500/30"
          />
          <KPICard
            label="Items Wasted"
            value={Number(stats?.wastedCount || 0)}
            icon={<FiBox className="text-orange-400 text-xl" />}
            bg="bg-orange-500/20"
            border="border-orange-500/30"
          />
        </div>

        {/* Management Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-5 lg:p-6 shadow-lg min-w-0">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <FiSettings className="text-[#38E07B]" /> System Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div className="p-4 lg:p-5 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center group hover:bg-white/10 hover:border-[#38E07B]/30 transition-all min-w-0">
              <div className="flex-1 mr-2 min-w-0">
                <h4 className="font-bold text-white group-hover:text-[#38E07B] transition-colors text-sm lg:text-base truncate">
                  Subscription Plans
                </h4>
                <p className="text-xs text-gray-400 mt-1 break-words">
                  Set prices (Monthly/Yearly) and edit features.
                </p>
              </div>
              <Link
                to="/admin/plans"
                className="w-10 h-10 min-w-[40px] rounded-full bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#38E07B] group-hover:bg-[#38E07B]/10 transition-all"
              >
                <FiArrowRight />
              </Link>
            </div>

            <div className="p-4 lg:p-5 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center group hover:bg-white/10 hover:border-[#38E07B]/30 transition-all min-w-0">
              <div className="flex-1 mr-2 min-w-0">
                <h4 className="font-bold text-white group-hover:text-[#38E07B] transition-colors text-sm lg:text-base truncate">
                  User Database
                </h4>
                <p className="text-xs text-gray-400 mt-1 break-words">
                  View, delete, or monitor user accounts.
                </p>
              </div>
              <Link
                to="/admin/users"
                className="w-10 h-10 min-w-[40px] rounded-full bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#38E07B] group-hover:bg-[#38E07B]/10 transition-all"
              >
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full min-w-0">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-5 lg:p-6 shadow-lg min-w-0">
            <div className="flex items-center justify-between mb-6 gap-3 min-w-0">
              <h3 className="font-bold text-white truncate">Revenue Trends</h3>
              <span className="text-xs font-medium text-[#38E07B] bg-[#38E07B]/10 px-2 py-1 rounded-md border border-[#38E07B]/20 whitespace-nowrap">
                This Month
              </span>
            </div>

            <div className="h-64 lg:h-80 w-full relative min-w-0 overflow-hidden">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
};

const KPICard = ({ label, value, icon, bg, border }) => (
  <div className="bg-white/5 backdrop-blur-xl p-4 lg:p-5 rounded-2xl lg:rounded-3xl border border-white/10 shadow-lg flex items-center gap-4 hover:bg-white/[0.07] transition-all min-w-0">
    <div className={`w-10 h-10 lg:w-12 lg:h-12 min-w-[40px] lg:min-w-[48px] rounded-xl lg:rounded-2xl flex items-center justify-center ${bg} border ${border}`}>
      {icon}
    </div>
    <div className="min-w-0 overflow-hidden">
      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest truncate">
        {label}
      </p>
      <h3 className="text-xl lg:text-2xl font-bold text-white truncate">
        {value}
      </h3>
    </div>
  </div>
);

export default AdminDashboard;