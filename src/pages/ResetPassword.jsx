import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiEye, FiEyeOff, FiKey, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const password = watch('newPassword');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(data.email, data.otp, data.newPassword);
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#122017] relative overflow-hidden font-sans selection:bg-[#38E07B] selection:text-[#122017]">
      
      {/* 🌌 Liquid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-[#38E07B]/15 rounded-full blur-[130px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -50, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[150px]"
        />
      </div>

      {/* 🪟 Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="relative z-10 w-full max-w-md p-8 md:p-10"
      >
        <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"></div>
        
        <div className="relative z-20">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner"
            >
               <FiKey className="text-3xl text-[#38E07B]" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white tracking-tight">New Password</h2>
            <p className="text-gray-400 mt-3 text-sm">
              Create a secure password to access your account.
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B] ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-lg" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 outline-none focus:border-[#38E07B] focus:ring-4 focus:ring-[#38E07B]/10 transition-all"
                  placeholder="Confirm your email"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email.message}</p>}
            </div>

            {/* OTP */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B] ml-1">OTP Code</label>
              <div className="relative group">
                <FiCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-lg" />
                <input
                  type="text"
                  maxLength="6"
                  {...register('otp', { required: 'OTP is required', pattern: { value: /^\d{6}$/, message: 'Must be 6 digits' } })}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 outline-none focus:border-[#38E07B] focus:ring-4 focus:ring-[#38E07B]/10 transition-all tracking-widest font-mono"
                  placeholder="000000"
                />
              </div>
              {errors.otp && <p className="text-xs text-red-400 ml-1">{errors.otp.message}</p>}
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B] ml-1">New Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('newPassword', {
                    required: 'Required',
                    minLength: { value: 6, message: 'Min 6 chars' },
                    pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Uppercase, lowercase & number' }
                  })}
                  className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 outline-none focus:border-[#38E07B] focus:ring-4 focus:ring-[#38E07B]/10 transition-all"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.newPassword && <p className="text-xs text-red-400 ml-1">{errors.newPassword.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B] ml-1">Confirm Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Required',
                    validate: val => val === password || 'Passwords do not match',
                  })}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 outline-none focus:border-[#38E07B] focus:ring-4 focus:ring-[#38E07B]/10 transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400 ml-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#38E07B] text-[#122017] font-bold rounded-xl hover:bg-[#2fc468] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(56,224,123,0.3)] hover:shadow-[0_0_30px_rgba(56,224,123,0.5)] flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#122017] border-t-transparent rounded-full animate-spin" />
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;