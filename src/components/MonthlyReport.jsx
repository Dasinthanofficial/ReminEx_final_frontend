import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiTrendingDown,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiPackage,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/currencyHelper";
import SelectMenu from "./SelectMenu";

const MonthlyReport = () => {
  const { currency } = useAuth();

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [direction, setDirection] = useState(0);

  const months = useMemo(
    () => [
      { value: 1, label: "January" },
      { value: 2, label: "February" },
      { value: 3, label: "March" },
      { value: 4, label: "April" },
      { value: 5, label: "May" },
      { value: 6, label: "June" },
      { value: 7, label: "July" },
      { value: 8, label: "August" },
      { value: 9, label: "September" },
      { value: 10, label: "October" },
      { value: 11, label: "November" },
      { value: 12, label: "December" },
    ],
    []
  );

  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = currentYear; i >= currentYear - 4; i--) {
      years.push({ value: i, label: String(i) });
    }
    return years;
  }, [currentYear]);

  const { data: report, isLoading, isError, error } = useQuery({
    queryKey: ["monthlyReport", selectedMonth, selectedYear],
    queryFn: () =>
      api.get(`/user/reports?month=${selectedMonth}&year=${selectedYear}`),
    retry: false,
    keepPreviousData: true,
  });

  const isCurrentMonth =
    selectedMonth === currentMonth && selectedYear === currentYear;

  // Disable next if next month would be in the future
  const isNextMonthFuture =
    selectedYear > currentYear ||
    (selectedYear === currentYear && selectedMonth >= currentMonth);

  const monthLabel = useMemo(() => {
    const d = new Date(selectedYear, selectedMonth - 1, 1);
    return d.toLocaleString("default", { month: "long", year: "numeric" });
  }, [selectedMonth, selectedYear]);

  const goPrev = () => {
    setDirection(-1);
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((p) => p - 1);
    } else {
      setSelectedMonth((p) => p - 1);
    }
  };

  const goNext = () => {
    setDirection(1);
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((p) => p + 1);
    } else {
      setSelectedMonth((p) => p + 1);
    }
  };

  const goCurrent = () => {
    setDirection(0);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  };

  const slide = {
    enter: (dir) => ({ x: dir > 0 ? 70 : -70, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 70 : -70, opacity: 0 }),
  };

  const Header = () => (
    <div className="mb-5">
      <h2 className="text-base md:text-lg font-bold text-white text-center">
        Monthly Waste Report
      </h2>

      {/* ✅ compact, mobile-friendly row */}
      <div className="mt-4 grid grid-cols-[36px_1fr_36px] items-center gap-2">
        {/* Prev */}
        <button
          onClick={goPrev}
          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white transition grid place-items-center"
          aria-label="Previous month"
        >
          <FiChevronLeft size={16} />
        </button>

        {/* Month + Year */}
        <div className="flex gap-2 min-w-0">
          <div className="flex-1 min-w-0 relative z-[9999]">
            <SelectMenu
              value={selectedMonth}
              onChange={(val) => {
                setDirection(0);
                setSelectedMonth(val);
              }}
              options={months}
              size="sm"           // ✅ key fix
              maxHeight="max-h-56"
            />
          </div>

          <div className="w-[96px] shrink-0 relative z-[9999]">
            <SelectMenu
              value={selectedYear}
              onChange={(val) => {
                setDirection(0);
                setSelectedYear(val);
              }}
              options={yearOptions}
              size="sm"           // ✅ key fix
              maxHeight="max-h-56"
            />
          </div>
        </div>

        {/* Next */}
        <button
          onClick={goNext}
          disabled={isNextMonthFuture}
          className={`w-9 h-9 rounded-xl transition grid place-items-center ${
            isNextMonthFuture
              ? "bg-white/5 text-gray-500 cursor-not-allowed"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          aria-label="Next month"
        >
          <FiChevronRight size={16} />
        </button>
      </div>

      {!isCurrentMonth && (
        <div className="flex justify-center mt-3">
          <button
            onClick={goCurrent}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#38E07B]/20 text-[#38E07B] hover:bg-[#38E07B]/30 transition"
          >
            Go to Current Month
          </button>
        </div>
      )}

      <p className="text-center text-[11px] text-gray-500 mt-2">
        Showing: <span className="text-gray-300">{monthLabel}</span>
      </p>
    </div>
  );

  const Shell = ({ children }) => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 md:p-6 shadow-lg relative overflow-visible">
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <Shell>
        <Header />
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-white/10 rounded-2xl" />
          <div className="h-20 bg-white/10 rounded-2xl" />
          <div className="h-24 bg-white/10 rounded-2xl" />
        </div>
      </Shell>
    );
  }

  if (isError) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to load monthly report.";
    return (
      <Shell>
        <Header />
        <div className="border border-red-500/30 rounded-2xl p-5 flex items-center gap-3 text-red-300">
          <FiAlertCircle className="text-xl shrink-0" />
          <p className="text-sm font-semibold">{msg}</p>
        </div>
      </Shell>
    );
  }

  const totalWaste = Number(report?.totalWaste || 0);
  const wastedCount = Number(report?.wastedCount || 0);

  return (
    <Shell>
      <Header />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${selectedMonth}-${selectedYear}`}
          custom={direction}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="space-y-4"
        >
          {/* Waste Value */}
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-red-300 uppercase font-extrabold tracking-wider mb-1">
                  Total Waste Value
                </p>
                <p className="text-2xl font-black text-white">
                  {formatPrice(totalWaste, currency)}
                </p>
              </div>
              <div className="w-11 h-11 rounded-full bg-red-500/20 flex items-center justify-center">
                <FiTrendingDown className="text-red-300 text-xl" />
              </div>
            </div>
          </div>

          {/* Items Wasted */}
          <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-orange-300 uppercase font-extrabold tracking-wider mb-1">
                  Items Wasted
                </p>
                <p className="text-2xl font-black text-white">{wastedCount}</p>
              </div>
              <div className="w-11 h-11 rounded-full bg-orange-500/20 flex items-center justify-center">
                <FiPackage className="text-orange-300 text-xl" />
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
            <p className="text-xs font-bold text-[#38E07B] mb-2">
              Tips to reduce waste
            </p>
            <ul className="text-[12px] text-gray-400 space-y-1.5">
              <li>• Plan meals using items expiring soon.</li>
              <li>• Keep “first in, first out” in your fridge.</li>
              <li>• Freeze leftovers or extra produce early.</li>
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </Shell>
  );
};

export default MonthlyReport;