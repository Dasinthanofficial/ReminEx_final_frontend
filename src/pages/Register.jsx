// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { useAuth } from '../context/AuthContext';
// import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
// import { motion } from 'framer-motion';

// const Register = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { register: registerUser } = useAuth();
//   const navigate = useNavigate();
//   const { register, handleSubmit, formState: { errors }, watch } = useForm();

//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     try {
//       await registerUser(data);
//       navigate('/dashboard');
//     } catch (error) {
//       console.error('Registration error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-[80vh] flex items-center justify-center">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
//       >
//         <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
        
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Full Name
//             </label>
//             <div className="relative">
//               <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 {...register('name', {
//                   required: 'Name is required',
//                   minLength: { value: 2, message: 'Name must be at least 2 characters' },
//                   pattern: {
//                     value: /^[a-zA-Z\s]+$/,
//                     message: 'Name can only contain letters and spaces',
//                   },
//                 })}
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                 placeholder="John Doe"
//               />
//             </div>
//             {errors.name && (
//               <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
//             )}
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address
//             </label>
//             <div className="relative">
//               <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="email"
//                 {...register('email', {
//                   required: 'Email is required',
//                   pattern: {
//                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                     message: 'Invalid email address',
//                   },
//                 })}
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                 placeholder="john@example.com"
//               />
//             </div>
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 {...register('password', {
//                   required: 'Password is required',
//                   minLength: {
//                     value: 6,
//                     message: 'Password must be at least 6 characters',
//                   },
//                   pattern: {
//                     value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//                     message: 'Password must contain uppercase, lowercase, and number',
//                   },
//                 })}
//                 className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                 placeholder="••••••••"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? <FiEyeOff /> : <FiEye />}
//               </button>
//             </div>
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
//             )}
//           </div>

//           {/* Terms */}
//           <div className="flex items-start">
//             <input
//               type="checkbox"
//               {...register('terms', {
//                 required: 'You must accept the terms and conditions',
//               })}
//               className="mt-1 mr-2"
//             />
//             <label className="text-sm text-gray-600">
//               I agree to the{' '}
//               <Link to="/terms" className="text-primary-500 hover:text-primary-600">
//                 Terms and Conditions
//               </Link>{' '}
//               and{' '}
//               <Link to="/privacy" className="text-primary-500 hover:text-primary-600">
//                 Privacy Policy
//               </Link>
//             </label>
//           </div>
//           {errors.terms && (
//             <p className="text-red-500 text-sm">{errors.terms.message}</p>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? 'Creating Account...' : 'Sign Up'}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <p className="text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold">
//               Login
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Register;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const password = watch('password'); // watch the password field

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

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  pattern: { value: /^[a-zA-Z\s]+$/, message: 'Name can only contain letters and spaces' },
                })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain uppercase, lowercase, and number',
                  },
                })}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start">
            <input
              type="checkbox"
              {...register('terms', { required: 'You must accept the terms and conditions' })}
              className="mt-1 mr-2"
            />
            <label className="text-sm text-gray-600">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-500 hover:text-primary-600">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-500 hover:text-primary-600">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
