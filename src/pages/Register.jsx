import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import registerimage from '../assets/register.png';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register: registerUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleContinue = () => {
    if (!window.google) {
      toast.error('Google sign-in unavailable.');
      return;
    }
    setGoogleLoading(true);
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          await loginWithGoogle(response.credential);
          navigate('/dashboard', { replace: true });
        } catch (err) {
          console.error(err);
        } finally {
          setGoogleLoading(false);
        }
      },
    });
    window.google.accounts.id.prompt();
  };

  return (
    <div className="min-h-screen flex bg-[#122017] font-sans selection:bg-[#38E07B] selection:text-[#122017] overflow-hidden">
      
      {/* Left Side - Image & Branding (Hidden on Mobile, Visible on LG screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#122017] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={registerimage} 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 flex flex-col justify-between w-full h-full p-12 text-white">
          <div className="font-bold text-2xl tracking-wide flex items-center gap-2">
             <span className="w-2 h-2 bg-[#38E07B] rounded-full"></span> ReminEx
          </div>
          
          <div className="space-y-6 mb-12">
            <h1 className="text-5xl font-bold leading-tight">
              Stop wasting food. <br/> 
              <span className="text-[#38E07B]">Start saving money.</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-md border-l-4 border-[#38E07B] pl-4">
              Join thousands of smart households tracking their inventory and reducing waste every single day.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Responsive Modern Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        
        {/* 🌌 Liquid Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#38E07B]/10 rounded-full blur-[80px] md:blur-[100px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-blue-600/10 rounded-full blur-[80px] md:blur-[120px]"
          />
        </div>

        {/* 🪟 Glass Card (Responsive Width) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-sm md:max-w-md p-6 md:p-10 rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl bg-white/5"
        >
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden text-center mb-6">
             <div className="font-bold text-2xl tracking-wide flex items-center justify-center gap-2 text-white">
                <span className="w-2 h-2 bg-[#38E07B] rounded-full"></span> ReminEx
             </div>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Create Account</h2>
            <p className="mt-2 text-sm text-gray-400">Get started with your free account.</p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleContinue}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-md mb-6 active:scale-[0.98] text-sm md:text-base"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            {googleLoading ? 'Connecting...' : 'Sign up with Google'}
          </button>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase font-bold tracking-wider">Or via email</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
            
            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B] ml-1">Full Name</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-lg" />
                <input
                  type="text"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
                  className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#38E07B]'} rounded-xl text-white placeholder-gray-600 outline-none focus:ring-4 focus:ring-[#38E07B]/10 transition-all text-sm md:text-base`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="text-xs text-red-400 ml-1 mt-1">{errors.name.message}</p>}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B] ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-lg" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                  className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#38E07B]'} rounded-xl text-white placeholder-gray-600 outline-none focus:ring-4 focus:ring-[#38E07B]/10 transition-all text-sm md:text-base`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 ml-1 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Inputs (Stacked on Mobile, Grid on Desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B] ml-1">Password</label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-lg" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Min 6 characters' },
                      validate: {
                        hasUpper: (v) =>
                          /[A-Z]/.test(v) || 'Must contain an uppercase letter',
                        hasLower: (v) =>
                          /[a-z]/.test(v) || 'Must contain a lowercase letter',
                        hasNumber: (v) =>
                          /[0-9]/.test(v) || 'Must contain a number',
                      },
                    })}
                    className={`w-full pl-12 pr-10 py-3 bg-white/5 border ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#38E07B]'} rounded-xl text-white placeholder-gray-600 outline-none focus:ring-4 focus:ring-[#38E07B]/10 transition-all text-sm md:text-base`}
                    placeholder="••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 ml-1 mt-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B] ml-1">Confirm</label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-lg" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', { required: 'Required', validate: v => v === password || 'Mismatch' })}
                    className={`w-full pl-12 pr-10 py-3 bg-white/5 border ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#38E07B]'} rounded-xl text-white placeholder-gray-600 outline-none focus:ring-4 focus:ring-[#38E07B]/10 transition-all text-sm md:text-base`}
                    placeholder="••••••"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-400 ml-1 mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start pt-2">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  {...register('terms', { required: 'Required' })}
                  className="w-4 h-4 rounded border-gray-600 bg-white/10 text-[#38E07B] focus:ring-[#38E07B] focus:ring-offset-0 checked:bg-[#38E07B] cursor-pointer"
                />
              </div>
              <div className="ml-3 text-xs text-gray-400">
                <label htmlFor="terms" className="cursor-pointer">
                  I agree to the <Link to="/terms" className="text-[#38E07B] hover:underline hover:text-white transition">Terms</Link> and <Link to="/privacy" className="text-[#38E07B] hover:underline hover:text-white transition">Privacy Policy</Link>
                </label>
                {errors.terms && <p className="text-red-400 mt-1">Required</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#38E07B] text-[#122017] font-bold py-3.5 rounded-xl hover:bg-[#2fc468] hover:shadow-[0_0_20px_rgba(56,224,123,0.4)] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 text-sm md:text-base"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#122017] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <FiArrowRight /></>
              )}
            </button>

            <p className="text-center text-sm text-gray-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#38E07B] hover:text-white hover:underline transition">
                Log in
              </Link>
            </p>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;