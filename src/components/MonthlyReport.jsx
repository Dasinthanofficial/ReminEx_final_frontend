import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FiTrendingDown,
  FiDollarSign,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiPackage,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currencyHelper';

const MonthlyReport = () => {
  const { currency } = useAuth();

  // Initialize with current month/year
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [direction, setDirection] = useState(0);

  // Generate available years (last 5 years)
  const availableYears = useMemo(() => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 4; i--) {
      years.push(i);
    }
    return years;
  }, []);

  // Month names
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const {
    data: report,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['monthlyReport', selectedMonth, selectedYear],
    queryFn: () => api.get(`/user/reports?month=${selectedMonth}&year=${selectedYear}`),
    retry: false,
    keepPreviousData: true,
  });

  // Navigation handlers
  const goToPreviousMonth = () => {
    setDirection(-1);
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    setDirection(1);
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const goToCurrentMonth = () => {
    setDirection(0);
    setSelectedMonth(currentDate.getMonth() + 1);
    setSelectedYear(currentDate.getFullYear());
  };

  // Check if we're at the current month
  const isCurrentMonth =
    selectedMonth === currentDate.getMonth() + 1 &&
    selectedYear === currentDate.getFullYear();

  // Check if next month is in the future
  const isNextMonthFuture =
    selectedYear > currentDate.getFullYear() ||
    (selectedYear === currentDate.getFullYear() &&
      selectedMonth >= currentDate.getMonth() + 1);

  // Label for the selected month/year
  const monthLabel = useMemo(() => {
    const labelDate = new Date(selectedYear, selectedMonth - 1, 1);
    return labelDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
  }, [selectedMonth, selectedYear]);

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  // Navigation Header Component
  const NavigationHeader = () => (
    <div className="mb-6">
      {/* Title */}
      <h2 className="text-lg font-bold text-white mb-4 text-center">
        Monthly Waste Report
      </h2>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Previous Button */}
        <button
          onClick={goToPreviousMonth}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
          aria-label="Previous month"
        >
          <FiChevronLeft size={20} />
        </button>

        {/* Month/Year Selectors */}
        <div className="flex items-center justify-center gap-2 flex-1">
          <select
            value={selectedMonth}
            onChange={(e) => {
              setDirection(0);
              setSelectedMonth(Number(e.target.value));
            }}
            className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#38E07B]/50 cursor-pointer hover:bg-white/20 transition-colors"
          >
            {months.map((month) => (
              <option
                key={month.value}
                value={month.value}
                className="bg-gray-900 text-white"
              >
                {month.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => {
              setDirection(0);
              setSelectedYear(Number(e.target.value));
            }}
            className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#38E07B]/50 cursor-pointer hover:bg-white/20 transition-colors"
          >
            {availableYears.map((year) => (
              <option
                key={year}
                value={year}
                className="bg-gray-900 text-white"
              >
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Next Button */}
        <button
          onClick={goToNextMonth}
          disabled={isNextMonthFuture}
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
            isNextMonthFuture
              ? 'bg-white/5 text-gray-500 cursor-not-allowed'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          aria-label="Next month"
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      {/* Today Button */}
      {!isCurrentMonth && (
        <div className="flex justify-center mt-3">
          <button
            onClick={goToCurrentMonth}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#38E07B]/20 text-[#38E07B] hover:bg-[#38E07B]/30 transition-all duration-200"
          >
            Go to Current Month
          </button>
        </div>
      )}
    </div>
  );

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col">
        <NavigationHeader />
        <div className="animate-pulse flex-1 space-y-4">
          <div className="h-24 bg-white/10 rounded-2xl" />
          <div className="h-24 bg-white/10 rounded-2xl" />
          <div className="h-32 bg-white/10 rounded-2xl mt-auto" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      'Unable to load monthly report.';
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col">
        <NavigationHeader />
        <div className="flex-1 flex flex-col justify-center items-center text-center border border-red-500/30 rounded-2xl p-6">
          <FiAlertCircle className="text-4xl text-red-400 mb-3" />
          <p className="text-sm font-semibold text-red-300">{msg}</p>
        </div>
      </div>
    );
  }

  const totalWaste = report?.totalWaste || 0;
  const wastedCount = report?.wastedCount || 0;

  // No waste this month
  if (totalWaste === 0 && wastedCount === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col shadow-lg"
      >
        <NavigationHeader />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${selectedMonth}-${selectedYear}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col items-center justify-center text-center px-4"
          >
            <div className="w-16 h-16 rounded-full bg-[#38E07B]/20 flex items-center justify-center text-[#38E07B] mb-4">
              <FiTrendingDown size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No Waste Recorded
            </h3>
            <p className="text-sm text-gray-400 mb-2">{monthLabel}</p>
            <p className="text-sm text-gray-300">
              Great job! No items were wasted during this month.
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-1.5 mt-4">
          {months.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index + 1 > selectedMonth ? 1 : -1);
                setSelectedMonth(index + 1);
              }}
              className={`h-2 rounded-full transition-all duration-200 ${
                index + 1 === selectedMonth
                  ? 'bg-[#38E07B] w-6'
                  : 'bg-white/20 hover:bg-white/40 w-2'
              }`}
              aria-label={`Go to ${months[index].label}`}
            />
          ))}
        </div>
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
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[60px] pointer-events-none" />

      <NavigationHeader />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${selectedMonth}-${selectedYear}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 flex flex-col relative z-10"
        >
          {/* Stats Grid */}
          <div className="space-y-4 mb-6">
            {/* Total Waste Value Card */}
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-red-300 uppercase font-bold tracking-wide mb-1">
                    Total Waste Value
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {formatPrice(totalWaste, currency)}
                  </p>
                </div>
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <FiTrendingDown className="text-2xl text-red-400" />
                </div>
              </div>
            </div>

            {/* Items Wasted Card */}
            <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-orange-300 uppercase font-bold tracking-wide mb-1">
                    Items Wasted
                  </p>
                  <p className="text-2xl font-bold text-white">{wastedCount}</p>
                </div>
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <FiPackage className="text-2xl text-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-black/20 border border-white/5 rounded-2xl p-4 mt-auto">
            <h3 className="font-bold text-[#38E07B] text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38E07B]" />
              Reduce Waste Tips
            </h3>
            <ul className="text-xs text-gray-400 space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-[#38E07B] mt-0.5 flex-shrink-0">•</span>
                <span>Plan meals ahead using expiring items.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#38E07B] mt-0.5 flex-shrink-0">•</span>
                <span>Use FIFO (First In, First Out) method.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#38E07B] mt-0.5 flex-shrink-0">•</span>
                <span>Store products properly to extend life.</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-1.5 mt-4 relative z-10">
        {months.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index + 1 > selectedMonth ? 1 : -1);
              setSelectedMonth(index + 1);
            }}
            className={`h-2 rounded-full transition-all duration-200 ${
              index + 1 === selectedMonth
                ? 'bg-[#38E07B] w-6'
                : 'bg-white/20 hover:bg-white/40 w-2'
            }`}
            aria-label={`Go to ${months[index].label}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default MonthlyReport;