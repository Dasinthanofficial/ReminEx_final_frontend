import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
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

  if (emailSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMail className="text-green-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a 6-digit OTP to your email address. 
            Use it to reset your password.
          </p>
          <Link
            to="/reset-password"
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition inline-block"
          >
            Enter OTP
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={() => setEmailSent(false)}
              className="text-primary-500 hover:text-primary-600"
            >
              try again
            </button>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-2">Forgot Password?</h2>
        <p className="text-gray-600 text-center mb-8">
          No worries! Enter your email and we'll send you an OTP to reset your password.
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <div className="mt-6">
          <Link
            to="/login"
            className="flex items-center justify-center text-gray-600 hover:text-primary-500 transition"
          >
            <FiArrowLeft className="mr-2" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;