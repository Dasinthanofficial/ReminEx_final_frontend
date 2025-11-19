// src/components/Navbar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiSettings,
  FiChevronDown,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import Logo from '../assets/logo.png';

// Active/inactive link styles
const activeLinkClass = 'text-[#FFA500] font-semibold';
const inactiveLinkClass = 'text-white hover:text-[#FFA500] transition';

const getNavLinkClass = ({ isActive }) =>
  isActive ? activeLinkClass : inactiveLinkClass;

/**
 * Normalize avatar URL:
 * - blob:... (local preview) -> use as-is
 * - http(s)://... -> use as-is
 * - /uploads/...  -> prefix with API base (http://localhost:5000 or VITE_API_URL)
 */
const getAvatarSrc = (url) => {
  // Fallback avatar path from backend
  const fallback = '/uploads/default_avatar.png';

  if (!url) url = fallback;

  // Local preview blob
  if (url.startsWith('blob:')) return url;

  // Already full URL
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // Relative path from backend (e.g. /uploads/xxx.png)
  const base =
    import.meta.env.VITE_API_URL?.replace(/\/api$/, '') ||
    'http://localhost:5000';

  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const ProfileDropdown = () => (
    <div className="relative z-50">
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="flex items-center space-x-2 text-white hover:text-[#FFA500] transition p-1 rounded-full focus:outline-none"
      >
        {user?.avatar ? (
          <img
            src={getAvatarSrc(user.avatar)}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-[#FFA500]"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white border-2 border-transparent hover:border-[#FFA500] transition">
            <FiUser className="w-4 h-4" />
          </div>
        )}
        <FiChevronDown
          className={`w-4 h-4 transition-transform ${
            isDropdownOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 origin-top-right bg-[#1e3025] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="py-1">
              <div className="px-4 py-2 text-sm text-white border-b border-gray-700">
                <p className="font-semibold truncate">
                  {user?.name || 'User Profile'}
                </p>
                {user?.plan !== 'Free' && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full mt-1 inline-block">
                    {user?.plan}
                  </span>
                )}
              </div>

              <NavLink
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-[#FFA500] transition"
              >
                <FiSettings className="mr-3 w-4 h-4" />
                Profile Settings
              </NavLink>

              <button
                onClick={() => {
                  handleLogout();
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-900/50 transition border-t border-gray-700"
              >
                <FiLogOut className="mr-3 w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <nav className="bg-[#122017] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/">
            <img src={Logo} alt="App Logo" className="h-40 mt-5" />
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={getNavLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/about" className={getNavLinkClass}>
              About
            </NavLink>
            <NavLink to="/plans" className={getNavLinkClass}>
              Plans
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={getNavLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/products" className={getNavLinkClass}>
                  Products
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className={getNavLinkClass}>
                    Admin
                  </NavLink>
                )}
                <ProfileDropdown />
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink to="/login" className={inactiveLinkClass}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-[#38E07B] text-black px-4 py-2 rounded-lg hover:bg-[#FFA500] transition"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen((prev) => !prev)}
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
              className="md:hidden overflow-hidden bg-white/10"
            >
              <div className="py-4 space-y-3">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block p-2 rounded ${
                      isActive
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-white hover:bg-gray-700'
                    }`
                  }
                  end
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `block p-2 rounded ${
                      isActive
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-white hover:bg-gray-700'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  About
                </NavLink>
                <NavLink
                  to="/plans"
                  className={({ isActive }) =>
                    `block p-2 rounded ${
                      isActive
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-white hover:bg-gray-700'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Plans
                </NavLink>

                {isAuthenticated ? (
                  <>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        `block p-2 rounded ${
                          isActive
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-white hover:bg-gray-700'
                        }`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/products"
                      className={({ isActive }) =>
                        `block p-2 rounded ${
                          isActive
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-white hover:bg-gray-700'
                        }`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      Products
                    </NavLink>
                    {isAdmin && (
                      <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                          `block p-2 rounded ${
                            isActive
                              ? 'bg-blue-100 text-blue-600'
                              : 'text-white hover:bg-gray-700'
                          }`
                        }
                        onClick={() => setIsOpen(false)}
                      >
                        Admin
                      </NavLink>
                    )}

                    {/* Profile Settings link */}
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded ${
                          isActive
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-white hover:bg-gray-700'
                        }`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      <FiSettings className="mr-2" />
                      Profile Settings
                    </NavLink>

                    <div className="pt-3 border-t border-gray-700 text-white">
                      <div className="flex items-center space-x-2 mb-3">
                        {user?.avatar ? (
                          <img
                            src={getAvatarSrc(user.avatar)}
                            alt="User Avatar"
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <FiUser />
                        )}
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
                        className="flex items-center text-red-500 hover:text-red-400 transition"
                      >
                        <FiLogOut className="mr-1" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="pt-3 border-t border-gray-700 space-y-3">
                    <NavLink
                      to="/login"
                      className="block text-center bg-gray-200 py-2 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="block text-center bg-[#38E07B] text-black py-2 rounded-lg hover:bg-[#FFA500] transition"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </NavLink>
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