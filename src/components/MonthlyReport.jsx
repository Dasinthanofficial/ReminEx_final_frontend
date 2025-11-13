import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import { FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import api from '../services/api';

const MonthlyReport = ({ month, year }) => {
  const { data: report, isLoading } = useQuery({
    queryKey: ['monthlyReport', month, year],
    queryFn: () => api.get(`/user/reports?month=${month}&year=${year}`),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6">Monthly Waste Report</h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <FiTrendingDown className="text-red-500 text-2xl" />
            <span className="text-2xl font-bold">${report?.totalWaste || 0}</span>
          </div>
          <p className="text-gray-600 mt-2">Total Waste Value</p>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <FiDollarSign className="text-orange-500 text-2xl" />
            <span className="text-2xl font-bold">{report?.wastedCount || 0}</span>
          </div>
          <p className="text-gray-600 mt-2">Products Wasted</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Tips to Reduce Waste:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Plan meals ahead using expiring products</li>
          <li>• Set reminders for products expiring soon</li>
          <li>• Store products properly to extend shelf life</li>
          <li>• Use FIFO (First In, First Out) method</li>
        </ul>
      </div>
    </div>
  );
};

export default MonthlyReport;