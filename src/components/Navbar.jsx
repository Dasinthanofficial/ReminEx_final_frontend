import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import Logo from '../assets/logo.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    
    <nav className="bg-[#122017] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" >

           <img src={Logo} alt="" className=' h-40 mt-5' />
            
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-primary-500 transition">
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-primary-500 transition">
              About
            </Link>
            <Link to="/plans" className="text-white hover:text-primary-500 transition">
              Plans
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-primary-500 transition">
                  Dashboard
                </Link>
                <Link to="/products" className="text-white hover:text-primary-500 transition">
                  Products
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-white hover:text-primary-500 transition">
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <FiUser className="text-gray-600" />
                    <span className="text-white">{user?.name}</span>
                    {user?.plan !== 'Free' && (
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                        {user?.plan}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white hover:text-primary-500 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#38E07B] text-black px-4 py-2 rounded-lg hover:bg-[#FFA500] transition"
                >
                  Register
                </Link>
              </div>

              
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-3">
                <Link
                  to="/"
                  className="block text-gray-700 hover:text-primary-500"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="block text-gray-700 hover:text-primary-500"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/plans"
                  className="block text-gray-700 hover:text-primary-500"
                  onClick={() => setIsOpen(false)}
                >
                  Plans
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block text-gray-700 hover:text-primary-500"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/products"
                      className="block text-gray-700 hover:text-primary-500"
                      onClick={() => setIsOpen(false)}
                    >
                      Products
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block text-gray-700 hover:text-primary-500"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <div className="pt-3 border-t">
                      <div className="flex items-center space-x-2 mb-3">
                        <FiUser />
                        <span>{user?.name}</span>
                        {user?.plan !== 'Free' && (
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                            {user?.plan}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="text-red-500"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="pt-3 border-t space-y-3">
                    <Link
                      to="/login"
                      className="block text-center bg-gray-200 py-2 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block text-center bg-primary-500 text-white py-2 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;