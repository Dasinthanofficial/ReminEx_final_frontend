import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// ✅ Added FiLock to the import
import { FiMail, FiArrowLeft, FiCheckCircle, FiLock } from 'react-icons/fi';
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
    <div className="min-h-screen flex items-center justify-center bg-[#122017] relative overflow-hidden px-4">
      
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#38E07B] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse delay-1000"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 md:p-10 text-white"
      >
        {emailSent ? (
          // Success State
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-[#38E07B]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#38E07B]/50"
            >
              <FiCheckCircle className="text-[#38E07B] text-4xl" />
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-3">Check your email</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              We've sent a 6-digit OTP to your inbox. <br/>
              Please enter it to verify your identity.
            </p>

            <Link
              to="/reset-password"
              className="block w-full py-3.5 bg-[#38E07B] text-[#122017] font-bold rounded-xl hover:bg-[#2fc468] transition-all transform hover:scale-[1.02] shadow-lg shadow-green-900/20"
            >
              Enter OTP
            </Link>

            <p className="text-sm text-gray-400 mt-6">
              Didn't receive it?{' '}
              <button
                onClick={() => setEmailSent(false)}
                className="text-[#38E07B] hover:text-white font-medium transition-colors underline underline-offset-4"
              >
                Resend email
              </button>
            </p>
          </div>
        ) : (
          // Form State
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                 <FiLock className="text-3xl text-[#38E07B]" />
              </div>
              <h2 className="text-3xl font-bold">Reset Password</h2>
              <p className="text-gray-400 mt-2 text-sm">
                Enter your email and we'll send you instructions to reset your password.
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-xl" />
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className={`w-full pl-12 pr-4 py-3.5 bg-black/20 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#38E07B] focus:ring-[#38E07B]/50'} rounded-xl text-white placeholder-gray-500 outline-none transition-all focus:ring-2`}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#38E07B] text-[#122017] font-bold rounded-xl hover:bg-[#2fc468] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[#122017] border-t-transparent rounded-full animate-spin" />
                ) : 'Send Instructions'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors font-medium group"
              >
                <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;