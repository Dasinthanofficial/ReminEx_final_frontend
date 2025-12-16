import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiX, FiGlobe, FiStar } from "react-icons/fi";
import { paymentService } from "../services/paymentService";
import { useAuth } from "../context/AuthContext";
import { formatPrice, getCurrencyList } from "../utils/currencyHelper";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Plans = () => {
  const { user, isAuthenticated, currency, changeCurrency } = useAuth();
  const navigate = useNavigate();
  const [currencyList, setCurrencyList] = useState(["USD"]);
  const [loadingPlan, setLoadingPlan] = useState(null);

  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: paymentService.getPlans,
  });

  useEffect(() => {
    const t = setTimeout(() => setCurrencyList(getCurrencyList()), 500);
    return () => clearTimeout(t);
  }, []);

  const handleSubscribe = async (planId, planName) => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe");
      navigate("/login");
      return;
    }

    if (planName === "Free") {
      toast.info("You are already on the free plan");
      return;
    }

    try {
      setLoadingPlan(planId);

      const response = await paymentService.createCheckoutSession(planId, currency);

      if (response?.url) {
        window.location.href = response.url;
        return;
      }

      toast.error("Stripe did not return a checkout URL.");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to create checkout session";
      toast.error(msg);
    } finally {
      setLoadingPlan(null);
    }
  };

  const planFeatures = {
    Free: [
      { text: "Track up to 5 products", included: true },
      { text: "7-day expiry notifications", included: true },
      { text: "Basic dashboard", included: true },
    ],
    Monthly: [
      { text: "Unlimited products", included: true },
      { text: "7-day expiry notifications", included: true },
      { text: "Advanced dashboard", included: true },
      { text: "AI recipe suggestions", included: true },
      { text: "Monthly reports", included: true },
    ],
    Yearly: [
      { text: "Unlimited products", included: true },
      { text: "7-day expiry notifications", included: true },
      { text: "Advanced dashboard", included: true },
      { text: "AI recipe suggestions", included: true },
      { text: "Monthly reports", included: true },
      { text: "25% Discount", included: true },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#122017]">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-t-4 border-[#38E07B] rounded-full animate-spin"></div>
          <div className="absolute inset-3 border-t-4 border-white/20 rounded-full animate-spin-reverse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#122017] overflow-hidden font-sans selection:bg-[#38E07B] selection:text-[#122017] py-20 px-6">
      {/* Currency Dropdown */}
      <div className="absolute top-6 right-6 z-30">
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-2xl hover:bg-white/10 transition-all group cursor-pointer">
          <FiGlobe className="text-[#38E07B] group-hover:rotate-180 transition-transform duration-500" />
          <select
            value={currency}
            onChange={(e) => changeCurrency(e.target.value)}
            className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer appearance-none uppercase w-12 text-center"
          >
            {currencyList.map((c) => (
              <option key={c} value={c} className="text-black">
                {c}
              </option>
            ))}
          </select>
          <div className="w-2 h-2 bg-[#38E07B] rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-16 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-white"
        >
        <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38E07B] to-emerald-400">
            Pricing
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 leading-relaxed"
        >
          Choose the perfect plan for your kitchen. <br className="hidden md:block" />
          No hidden fees. Cancel anytime.
        </motion.p>
      </div>

      {/* Cards Grid */}
      <div className="relative z-10 grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans?.map((plan, idx) => {
          const isCurrentPlan = user?.plan === plan.name;
          const isPro = plan.name === "Yearly";

          return (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 ${
                isPro
                  ? "bg-gradient-to-b from-white/10 to-white/5 border-[#38E07B]/50 shadow-[0_0_50px_-12px_rgba(56,224,123,0.3)]"
                  : "bg-white/5 border-white/10 hover:bg-white/[0.07]"
              } border backdrop-blur-xl`}
            >
              {isPro && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#38E07B] text-[#122017] px-6 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(56,224,123,0.4)] flex items-center gap-2">
                  <FiStar className="fill-current" /> Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-4">
                  {plan.name}
                </h3>

                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl font-black tracking-tighter ${isPro ? "text-white" : "text-gray-200"}`}>
                    {plan.name === "Free" ? "Free" : formatPrice(plan.price, currency)}
                  </span>

                  {/* ✅ Only show /month or /year for paid plans */}
                  {plan.name !== "Free" && (
                    <span className="text-gray-500 font-medium">
                      /{plan.name === "Yearly" ? "year" : "month"}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                  {plan.description || "The perfect plan to get you started with tracking."}
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

              <ul className="space-y-4 mb-8 flex-1">
                {planFeatures[plan.name]?.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div
                      className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        feature.included
                          ? "bg-[#38E07B]/20 text-[#38E07B]"
                          : "bg-white/5 text-gray-500"
                      }`}
                    >
                      {feature.included ? <FiCheck size={12} /> : <FiX size={12} />}
                    </div>
                    <span
                      className={`text-sm ${
                        feature.included ? "text-gray-200" : "text-gray-500 line-through decoration-white/10"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan._id, plan.name)}
                disabled={isCurrentPlan || loadingPlan === plan._id}
                className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 ${
                  isCurrentPlan
                    ? "bg-white/10 text-gray-500 cursor-not-allowed border border-white/5"
                    : isPro
                    ? "bg-[#38E07B] text-[#122017] hover:bg-[#2fc468] shadow-lg hover:shadow-[#38E07B]/40 hover:scale-[1.02]"
                    : "bg-white text-[#122017] hover:bg-gray-200 hover:scale-[1.02]"
                }`}
              >
                {loadingPlan === plan._id
                  ? "Processing..."
                  : isCurrentPlan
                  ? "Current Plan"
                  : plan.name === "Free"
                  ? "Get Started Free"
                  : "Start 7-Day Free Trial"}
              </button>

              {!isCurrentPlan && plan.name !== "Free" && (
                <p className="text-[10px] text-center mt-2 text-gray-400">
                  Then {formatPrice(plan.price, currency)}/{plan.name === "Yearly" ? "yr" : "mo"}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Plans;