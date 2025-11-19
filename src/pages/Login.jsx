// src/pages/Login.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
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


 const onSubmit = async (data) => {
   setIsLoading(true);
   try {
     await login(data.email, data.password);
     navigate('/dashboard');
   } catch (error) {
     console.error('Login error:', error);
   } finally {
     setIsLoading(false);
   }
 };


 const handleGoogleLogin = () => {
   console.log('Verifying Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
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
         console.error('Google login failed:', err);
       } finally {
         setGoogleLoading(false);
       }
     },
   });

   window.google.accounts.id.prompt();
 };


 return (
   <div
     className="min-h-screen flex items-center justify-center p-4 bg-center bg-cover"
     style={{ backgroundImage: `url(${loginimage})` }}
   >
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="p-8 rounded-2xl shadow-xl w-full max-w-md bg-white/20 backdrop-blur-lg border border-white/30"
     >
       <h2 className="text-3xl font-bold text-center mb-8 text-white">Welcome Back</h2>


       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         {/* ... (rest of the form is unchanged) ... */}
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
               placeholder="Enter your email"
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
               })}
               className="w-full pl-10 pr-10 py-2 bg-transparent border border-white/30 rounded-lg text-white placeholder:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
               placeholder="Enter your password"
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

         <div className="flex justify-end items-center">
           <Link
             to="/forgot-password"
             className="text-sm text-white hover:underline"
           >
             Forgot Password?
           </Link>
         </div>

         <button
           type="submit"
           disabled={isLoading}
           className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {isLoading ? 'Logging in...' : 'Login'}
         </button>
       </form>


       <div className="my-4 flex items-center">
         <div className="flex-1 h-px bg-white/40" />
         <span className="px-3 text-gray-200 text-sm">or</span>
         <div className="flex-1 h-px bg-white/40" />
       </div>


       <button
         type="button"
         onClick={handleGoogleLogin}
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
           Don't have an account?{' '}
           <Link to="/register" className="font-semibold text-white hover:underline">
             Sign up
           </Link>
         </p>
       </div>
     </motion.div>
   </div>
 );
};


export default Login;