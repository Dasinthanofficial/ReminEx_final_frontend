import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
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
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleContinue = () => {
    if (!window.google) {
      console.error('Google script not loaded');
      toast.error('Google sign-in is not available right now.');
      return;
    }


    setGoogleLoading(true);


    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const idToken = response.credential;
          await loginWithGoogle(idToken);
          navigate('/dashboard');
        } catch (err) {
          console.error('Google sign-up/login failed:', err);
        } finally {
          setGoogleLoading(false);
        }
      },
    });



    window.google.accounts.id.prompt();
  };


  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${registerimage})` }}
    >
      <div className="flex">
        <div className=" w-1/2">

        </div>
       

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-1/2 h-screen py-[80px] px-[150px] border border-white/30 rounded-2xl shadow-xl bg-white/20 backdrop-blur-lg"
        >
          <h2 className="text-3xl font-bold w-full text-center mb-8 text-white">
            Create Account
          </h2>


          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: 'Name can only contain letters and spaces',
                    },
                  })}
                  className="w-full pl-10 pr-3 py-2 bg-transparent border border-white/30 rounded-lg text-white placeholder:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full pl-10 pr-3 py-2 bg-transparent border border-white/30 rounded-lg text-white placeholder:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        'Password must contain uppercase, lowercase, and number',
                    },
                  })}
                  className="w-full pl-10 pr-10 py-2 bg-transparent border border-white/30 rounded-lg text-white placeholder:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  className="w-full pl-10 pr-10 py-2 bg-transparent border border-white/30 rounded-lg text-white placeholder:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                {...register('terms', {
                  required: 'You must accept the terms and conditions',
                })}
                className="mt-1 mr-2 accent-primary-500 bg-transparent"
              />
              <label className="text-sm text-gray-200">
                I agree to the{' '}
                <Link
                  to="/terms"
                  className="font-semibold text-white hover:underline"
                >
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  className="font-semibold text-white hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-sm">{errors.terms.message}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>


          <div className="my-4 flex items-center">
            <div className="flex-1 h-px bg-white/40" />
            <span className="px-3 text-gray-200 text-sm">or</span>
            <div className="flex-1 h-px bg-white/40" />
          </div>


          <button
            type="button"
            onClick={handleGoogleContinue}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2 border border-white/40 text-white py-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>


          <div className="mt-6 text-center">
            <p className="text-gray-200">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-white hover:underline">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


export default Register;