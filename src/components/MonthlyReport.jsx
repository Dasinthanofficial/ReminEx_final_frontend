import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiTrendingDown, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currencyHelper';

const MonthlyReport = ({ month, year }) => {
  const { currency } = useAuth();

  const {
    data: report,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['monthlyReport', month, year],
    queryFn: () => api.get(`/user/reports?month=${month}&year=${year}`),
    retry: false,
  });

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col justify-between animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/2 mb-4" />
        <div className="grid gap-4 flex-1">
          <div className="h-20 bg-white/10 rounded-2xl" />
          <div className="h-20 bg-white/10 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Error state (e.g. non-premium, server error)
  if (isError) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      'Unable to load monthly report.';
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-red-500/30 rounded-3xl p-6 h-full flex flex-col justify-center text-center text-red-300">
        <div className="flex justify-center mb-3">
          <FiAlertCircle className="text-3xl" />
        </div>
        <p className="text-sm font-semibold">{msg}</p>
      </div>
    );
  }

  const totalWaste = report?.totalWaste || 0;
  const wastedCount = report?.wastedCount || 0;

  // Label for the selected month/year
  const labelDate = new Date(year, month - 1, 1);
  const monthLabel = labelDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  // If there is no waste at all this month, show a positive message
  if (totalWaste === 0 && wastedCount === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col items-center justify-center text-center shadow-lg"
      >
        <div className="w-12 h-12 rounded-full bg-[#38E07B]/20 flex items-center justify-center text-[#38E07B] mb-4">
          <FiTrendingDown size={22} />
        </div>
        <h2 className="text-lg font-bold text-white mb-1">
          Monthly Waste Report
        </h2>
        <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider">
          {monthLabel}
        </p>
        <p className="text-sm text-gray-300">
          No items were wasted this month. Keep it up!
        </p>
      </motion.div>
    );
  }

  // Normal report with waste
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col relative overflow-hidden shadow-lg"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
          <FiAlertCircle size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">
            Monthly Waste Report
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            {monthLabel}
          </p>
        </div>
      </div>

      <div className="grid gap-4 mb-6 mt-4 relative z-10">
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-red-300 uppercase font-bold mb-1">
              Total Waste Value
            </p>
            <span className="text-2xl font-bold text-white">
              {formatPrice(totalWaste, currency)}
            </span>
          </div>
          <FiTrendingDown className="text-3xl text-red-500 opacity-50" />
        </div>

        <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-orange-300 uppercase font-bold mb-1">
              Items Wasted
            </p>
            <span className="text-2xl font-bold text-white">
              {wastedCount}
            </span>
          </div>
          <FiDollarSign className="text-3xl text-orange-500 opacity-50" />
        </div>
      </div>

      <div className="bg-black/20 border border-white/5 rounded-2xl p-4 relative z-10 mt-auto">
        <h3 className="font-bold text-[#38E07B] text-sm mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38E07B]" />
          Reduce Waste Tips
        </h3>
        <ul className="text-xs text-gray-400 space-y-2 pl-2">
          <li className="flex items-start gap-2">
            <span className="text-[#38E07B] mt-0.5">•</span> Plan meals ahead
            using expiring items.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#38E07B] mt-0.5">•</span> Use FIFO (First
            In, First Out) method.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#38E07B] mt-0.5">•</span> Store products
            properly to extend life.
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default MonthlyReport;