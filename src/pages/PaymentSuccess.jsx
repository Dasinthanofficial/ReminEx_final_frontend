import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FiCheckCircle,
  FiLoader,
  FiXCircle,
  FiArrowRight,
  FiPlus,
} from "react-icons/fi";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { updateUser } = useAuth();

  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus("error");
        return;
      }

      try {
        const res = await api.get(
          `/payment/verify?sessionId=${sessionId}`
        );

        if (res.success) {
          updateUser((prev) =>
            prev
              ? { ...prev, plan: res.plan, planExpiry: res.planExpiry }
              : prev
          );

          setStatus("success");

          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#38E07B", "#122017", "#FFFFFF"],
          });
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [sessionId, updateUser]);

  // --- RENDER STATES ---

  if (status === "loading") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center text-white">
        <FiLoader className="text-[#38E07B] text-6xl animate-spin mb-6" />
        <h2 className="text-3xl font-bold tracking-tight">
          Verifying Payment...
        </h2>
        <p className="text-gray-400 mt-2 text-sm">
          Please wait while we update your account.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center text-white">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <FiXCircle className="text-red-500 text-5xl" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          Verification Failed
        </h2>
        <p className="text-gray-400 mt-2 mb-8 max-w-md leading-relaxed">
          We couldn't verify the payment session. Please contact support
          if you were charged.
        </p>
        <Link
          to="/dashboard"
          className="bg-white/10 border border-white/10 text-white px-8 py-3 rounded-xl hover:bg-white/20 transition font-bold text-sm"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-lg w-full"
      >
        <div className="w-24 h-24 bg-[#38E07B]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#38E07B]/20 shadow-[0_0_40px_rgba(56,224,123,0.2)]">
          <FiCheckCircle className="text-[#38E07B] text-5xl" />
        </div>

        <h1 className="text-4xl font-extrabold mb-4 text-white tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-400 mb-10 leading-relaxed">
          Welcome to Premium! Your subscription has been activated.
        </p>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-10 text-left shadow-2xl">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
            Your New Powers
          </h3>
          <ul className="space-y-4">
            <FeatureItem text="Unlimited Product Storage" />
            <FeatureItem text="AI Chef Recipe Suggestions" />
            <FeatureItem text="Detailed Monthly Reports" />
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            to="/dashboard"
            className="w-full bg-[#38E07B] text-[#122017] font-bold py-4 rounded-xl hover:bg-[#2fc468] transition shadow-lg shadow-[#38E07B]/20 flex items-center justify-center gap-2 group"
          >
            Go to Dashboard{" "}
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/products/add"
            className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition flex items-center justify-center gap-2"
          >
            <FiPlus /> Add First Product
          </Link>
        </div>

        {sessionId && (
          <p className="text-[10px] text-gray-600 mt-8 font-mono uppercase tracking-widest">
            Ref: {sessionId.slice(0, 16)}...
          </p>
        )}
      </motion.div>
    </div>
  );
};

const FeatureItem = ({ text }) => (
  <li className="flex items-center gap-3 text-gray-300 font-medium">
    <div className="w-5 h-5 rounded-full bg-[#38E07B]/20 flex items-center justify-center text-[#38E07B]">
      <FiCheckCircle size={12} />
    </div>
    {text}
  </li>
);

export default PaymentSuccess;