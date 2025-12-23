import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/currencyHelper";
import AdminPageShell from "../components/AdminPageShell";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminAnalytics = () => {
  const { currency } = useAuth();

  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => api.get("/admin/dashboard"),
    retry: false,
  });

  // ✅ Always compute "safe" values so hooks below run on every render
  const safe = stats || {};
  const totalWaste = Number(safe.totalWaste || 0);
  const wastedCount = Number(safe.wastedCount || 0);
  const totalRevenue = Number(safe.totalRevenue || 0);
  const totalUsers = Number(safe.totalUsers || 0);

  const avgRevenuePerUser = totalUsers > 0 ? totalRevenue / totalUsers : 0;

  // month label (safe fallback if stats not loaded yet)
  const monthLabel = useMemo(() => {
    const year = Number(safe.year || new Date().getFullYear());
    const month = Number(safe.month || new Date().getMonth() + 1);
    const d = new Date(year, month - 1, 1);
    return d.toLocaleString("default", { month: "long", year: "numeric" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safe.year, safe.month]);

  const wasteData = useMemo(
    () => ({
      labels: ["Total Waste"],
      datasets: [
        {
          label: "Total Waste",
          data: [totalWaste],
          backgroundColor: ["#EF4444"],
          borderRadius: 8,
          barThickness: "flex",
          maxBarThickness: 60,
        },
      ],
    }),
    [totalWaste]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(18, 32, 23, 0.9)",
          titleColor: "#38E07B",
          bodyColor: "#fff",
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => ` Value: ${formatPrice(ctx.parsed.y || 0, currency)}`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            color: "#9CA3AF",
            font: { size: 10 },
            maxTicksLimit: 5,
            callback: (value) => formatPrice(Number(value) || 0, currency),
          },
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          border: { display: false },
        },
        x: {
          ticks: { color: "#9CA3AF", font: { size: 12 } },
          grid: { display: false },
          border: { display: false },
        },
      },
    }),
    [currency]
  );

  // ✅ Returns AFTER hooks (no hook order issues)
  if (isLoading) {
    return (
      <div className="text-white text-center py-20 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#38E07B] border-t-transparent rounded-full animate-spin mb-4" />
        <p>Loading Analytics...</p>
      </div>
    );
  }

  if (isError || !stats) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to load admin analytics.";
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center text-red-200 my-10 mx-4">
        <p className="font-semibold text-lg">Error Loading Data</p>
        <p className="text-sm mt-2 opacity-80">{msg}</p>
      </div>
    );
  }

  return (
    <AdminPageShell>
      <div className="space-y-6 lg:space-y-8 w-full min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight break-words">
              Detailed Analytics
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Overview for{" "}
              <span className="text-[#38E07B] font-medium">{monthLabel}</span>
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-w-0">
          {/* Waste Chart */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg order-2 lg:order-1 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                Waste Overview
              </h3>
            </div>

            <div className="h-64 sm:h-80 w-full relative min-w-0 overflow-hidden">
              {totalWaste > 0 ? (
                <Bar data={wasteData} options={chartOptions} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm border-2 border-dashed border-white/10 rounded-xl">
                  <p>No recorded waste</p>
                  <span className="text-xs opacity-50 mt-1">for this period</span>
                </div>
              )}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg flex flex-col justify-between order-1 lg:order-2 h-full">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-2 h-2 bg-[#38E07B] rounded-full animate-pulse shadow-[0_0_10px_rgba(56,224,123,0.5)]" />
              Key Insights
            </h3>

            <div className="flex-1 flex flex-col justify-center space-y-3 sm:space-y-4">
              <div className="p-4 sm:p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl sm:rounded-2xl">
                <p className="text-[10px] sm:text-xs text-blue-400 uppercase font-bold tracking-wider mb-1">
                  Avg. Revenue Per User
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {formatPrice(avgRevenuePerUser, currency)}
                </p>
              </div>

              <div className="p-4 sm:p-5 bg-red-500/10 border border-red-500/20 rounded-xl sm:rounded-2xl">
                <p className="text-[10px] sm:text-xs text-red-400 uppercase font-bold tracking-wider mb-1">
                  Total Items Wasted
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {wastedCount}{" "}
                  <span className="text-sm sm:text-base font-normal text-gray-400 ml-1">
                    Items
                  </span>
                </p>
              </div>

              <div className="p-4 sm:p-5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl sm:rounded-2xl">
                <p className="text-[10px] sm:text-xs text-yellow-300 uppercase font-bold tracking-wider mb-1">
                  Total Waste Value
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {formatPrice(totalWaste, currency)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
};

export default AdminAnalytics;