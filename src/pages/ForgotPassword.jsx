import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiArrowLeft, FiCheckCircle, FiLock, FiKey } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setEmailSent(true);
      toast.success('OTP sent to your email!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#122017] relative overflow-hidden font-sans selection:bg-[#38E07B] selection:text-[#122017]">
      
      {/* 🌌 Liquid Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#38E07B]/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px]"
        />
      </div>

      {/* 🪟 Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        // ✅ FIXED: Changed "outCirc" to "circOut"
        transition={{ duration: 0.6, ease: "circOut" }}
        className="relative z-10 w-full max-w-md p-8 md:p-10"
      >
        <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"></div>
        
        <div className="relative z-20">
          {emailSent ? (
            // ✅ Success State
            <div className="text-center py-4">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 bg-gradient-to-tr from-[#38E07B]/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#38E07B]/50 shadow-[0_0_30px_rgba(56,224,123,0.2)]"
              >
                <FiCheckCircle className="text-[#38E07B] text-5xl drop-shadow-lg" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Check your email</h2>
              <p className="text-gray-400 mb-8 leading-relaxed text-sm">
                We've sent a 6-digit secure code to your inbox.<br/>
                Please enter it to verify your identity.
              </p>

              <Link
                to="/reset-password"
                className="block w-full py-4 bg-[#38E07B] text-[#122017] font-bold rounded-xl hover:bg-[#2fc468] transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(56,224,123,0.4)] flex items-center justify-center gap-2"
              >
                <FiKey /> Enter OTP Code
              </Link>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  Didn't receive it?{' '}
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-[#38E07B] hover:text-white font-medium transition-colors underline underline-offset-4 decoration-[#38E07B]/50 hover:decoration-white"
                  >
                    Try again
                  </button>
                </p>
              </div>
            </div>
          ) : (
            // 🔒 Form State
            <div>
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
                   <FiLock className="text-3xl text-[#38E07B]" />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Reset Password</h2>
                <p className="text-gray-400 mt-3 text-sm leading-relaxed">
                  Enter your registered email address and we'll send you instructions to reset your password.
                </p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B] ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-xl z-10" />
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${
                        errors.email 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-white/10 focus:border-[#38E07B] focus:ring-[#38E07B]/20'
                      } rounded-xl text-white placeholder-gray-600 outline-none transition-all focus:ring-4 focus:bg-white/10`}
                      placeholder="name@example.com"
                    />
                  </div>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 ml-1 flex items-center gap-1 font-medium"
                    >
                      <span className="w-1 h-1 rounded-full bg-red-400"></span>
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#38E07B] text-[#122017] font-bold rounded-xl hover:bg-[#2fc468] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(56,224,123,0.3)] hover:shadow-[0_0_30px_rgba(56,224,123,0.5)] flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[#122017] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Send Instructions <FiArrowLeft className="rotate-180" /></>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-gray-400 hover:text-white transition-colors font-medium group text-sm"
                >
                  <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform text-[#38E07B]" />
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;