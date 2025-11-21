import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await login(data.email, data.password);
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!window.google) {
      toast.error('Google sign-in unavailable.');
      return;
    }
    setGoogleLoading(true);
    
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (googleRes) => {
        try {
          const response = await loginWithGoogle(googleRes.credential);
          if (response.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } catch (err) {
          console.error(err);
          toast.error("Google login failed");
        } finally {
          setGoogleLoading(false);
        }
      },
    });
    window.google.accounts.id.prompt();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#122017] relative overflow-hidden font-sans selection:bg-[#38E07B] selection:text-[#122017]">
      
      {/* 🌌 Liquid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Left Blob */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-[#38E07B]/20 rounded-full blur-[120px]"
        />
        {/* Bottom Right Blob */}
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px]"
        />
      </div>

      {/* 🪟 Glass Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="relative z-10 w-full max-w-md p-8 md:p-10"
      >
        {/* Frosted Glass Effect */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"></div>
        
        <div className="relative z-20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#38E07B]/20 text-[#38E07B] mb-4 border border-[#38E07B]/30 shadow-[0_0_15px_rgba(56,224,123,0.3)]">
              <FiLock className="text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-400">
              Sign in to manage your inventory smarter.
            </p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-md mb-6 active:scale-[0.98]"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase font-bold tracking-wider">Or with email</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B] ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-lg" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  className={`w-full pl-12 pr-4 py-3.5 bg-white/5 border ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#38E07B]'} rounded-xl text-white placeholder-gray-600 outline-none focus:ring-4 focus:ring-[#38E07B]/10 transition-all`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 ml-1 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1 mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B]">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-gray-400 hover:text-[#38E07B] transition">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className={`w-full pl-12 pr-12 py-3.5 bg-white/5 border ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#38E07B]'} rounded-xl text-white placeholder-gray-600 outline-none focus:ring-4 focus:ring-[#38E07B]/10 transition-all`}
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 ml-1 mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#38E07B] text-[#122017] font-bold py-3.5 rounded-xl hover:bg-[#2fc468] hover:shadow-[0_0_20px_rgba(56,224,123,0.4)] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#122017] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Log In <FiArrowRight /></>
              )}
            </button>

            <p className="text-center text-sm text-gray-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[#38E07B] hover:underline transition">
                Sign up free
              </Link>
            </p>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;