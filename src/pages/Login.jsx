import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import loginimage from '../assets/login.png';
import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // ✅ FIXED: Check role after login
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await login(data.email, data.password);
      
      // Check User Role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Optional: Display specific error message from backend
      // toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FIXED: Check role after Google login
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
          
          // Check User Role
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
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left Side - Image & Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#122017] overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img 
          src={loginimage} 
          alt="Login Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 flex flex-col justify-between w-full h-full p-12 text-white">
          <div className="font-bold text-2xl tracking-wide flex items-center gap-2">
             <span className="w-2 h-2 bg-[#38E07B] rounded-full"></span> ReminEx
          </div>
          
          <div className="space-y-6 mb-12">
            <h1 className="text-5xl font-bold leading-tight">
              Welcome back to <br/> 
              <span className="text-[#38E07B]">smarter tracking.</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-md border-l-4 border-[#38E07B] pl-4">
              Manage your inventory efficiently and save money by reducing household waste.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 overflow-y-auto bg-gray-50/30">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100"
        >
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Log In</h2>
            <p className="mt-2 text-gray-500 text-sm">Enter your details to access your account.</p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition font-medium shadow-sm mb-6"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-semibold tracking-wider">Or with email</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#38E07B] transition-colors" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#38E07B] focus:ring-[#38E07B]'} rounded-xl outline-none transition-all`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-[#38E07B] hover:text-[#2fc468] hover:underline transition">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#38E07B] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#38E07B] focus:ring-[#38E07B]'} rounded-xl outline-none transition-all`}
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#38E07B] text-[#122017] font-bold py-3.5 rounded-xl hover:bg-[#2fc468] hover:shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? 'Logging in...' : (
                <>Log In <FiArrowRight /></>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-[#38E07B] hover:underline transition">
                Sign up for free
              </Link>
            </p>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;