import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiTrendingDown, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currencyHelper';

const MonthlyReport = ({ month, year }) => {
  const { currency } = useAuth();

  const { data: report, isLoading } = useQuery({
    queryKey: ['monthlyReport', month, year],
    queryFn: async () => {
      const response = await api.get(`/user/reports?month=${month}&year=${year}`);
      return response;
    }
  });

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col justify-between animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/2 mb-4"></div>
        <div className="grid gap-4 flex-1">
           <div className="h-20 bg-white/10 rounded-2xl"></div>
           <div className="h-20 bg-white/10 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col relative overflow-hidden shadow-lg"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[60px] pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
           <FiAlertCircle size={20} />
        </div>
        <h2 className="text-lg font-bold text-white">Monthly Waste Report</h2>
      </div>
      
      <div className="grid gap-4 mb-6 relative z-10">
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-red-300 uppercase font-bold mb-1">Total Waste Value</p>
            <span className="text-2xl font-bold text-white">
              {formatPrice(report?.totalWaste || 0, currency)}
            </span>
          </div>
          <FiTrendingDown className="text-3xl text-red-500 opacity-50" />
        </div>
        
        <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-orange-300 uppercase font-bold mb-1">Items Wasted</p>
            <span className="text-2xl font-bold text-white">
              {report?.wastedCount || 0}
            </span>
          </div>
          <FiDollarSign className="text-3xl text-orange-500 opacity-50" />
        </div>
      </div>

      <div className="bg-black/20 border border-white/5 rounded-2xl p-4 relative z-10 mt-auto">
        <h3 className="font-bold text-[#38E07B] text-sm mb-2 flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-[#38E07B]"></span>
           Reduce Waste Tips
        </h3>
        <ul className="text-xs text-gray-400 space-y-2 pl-2">
          <li className="flex items-start gap-2">
             <span className="text-[#38E07B] mt-0.5">•</span> Plan meals ahead using expiring items.
          </li>
          <li className="flex items-start gap-2">
             <span className="text-[#38E07B] mt-0.5">•</span> Use FIFO (First In, First Out) method.
          </li>
          <li className="flex items-start gap-2">
             <span className="text-[#38E07B] mt-0.5">•</span> Store products properly to extend life.
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default MonthlyReport;