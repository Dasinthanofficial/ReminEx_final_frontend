import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCurrencyList } from '../utils/currencyHelper'; // 👈 Import Helper
import { FiMenu, FiX, FiLogOut, FiSettings, FiChevronDown, FiGrid, FiGlobe } from 'react-icons/fi'; // 👈 Import Globe
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // 1. Get Currency props from Auth
  const { user, logout, isAuthenticated, isAdmin, currency, changeCurrency } = useAuth();
  
  // 2. Local state for the list of currencies
  const [currencies, setCurrencies] = useState(["USD"]);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // 3. Fetch currency list (delayed slightly to ensure API cache is ready)
    const timer = setTimeout(() => {
      setCurrencies(getCurrencyList());
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getAvatarSrc = (url) => {
    const fallback = '/uploads/default_avatar.png';
    if (!url) url = fallback;
    if (url.startsWith('blob:') || url.startsWith('http')) return url;
    const base = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';
    return `${base}${url.startsWith('/') ? url : `/${url}`}`;
  };

  const navLinkStyle = ({ isActive }) =>
    `text-sm font-medium transition-all duration-300 px-4 py-2 rounded-full ${
      isActive 
        ? 'bg-[#38E07B]/10 text-[#38E07B] shadow-[0_0_15px_rgba(56,224,123,0.2)] border border-[#38E07B]/20' 
        : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#122017]/80 backdrop-blur-xl border-b border-white/10 shadow-lg' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <img src={Logo} alt="ReminEx" className="h-10 w-auto group-hover:scale-105 transition-transform duration-300" />
            <span className="text-xl font-bold text-white tracking-wide group-hover:text-[#38E07B] transition-colors">
              ReminEx
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={navLinkStyle} end>Home</NavLink>
            <NavLink to="/about" className={navLinkStyle}>About</NavLink>
            <NavLink to="/plans" className={navLinkStyle}>Pricing</NavLink>

            {/* 🌍 GLOBAL CURRENCY SELECTOR (DESKTOP) */}
            <div className="ml-2 flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg border border-white/10 hover:border-[#38E07B]/50 transition-colors">
                <FiGlobe className="text-[#38E07B] text-xs" />
                <select 
                    value={currency} 
                    onChange={(e) => changeCurrency(e.target.value)}
                    className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer appearance-none w-10 uppercase"
                >
                    {currencies.map(c => (
                        <option key={c} value={c} className="text-black">{c}</option>
                    ))}
                </select>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-4 ml-6 pl-6 border-l border-white/10">
                <NavLink to="/dashboard" className={navLinkStyle}>
                  Dashboard
                </NavLink>
                
                {isAdmin && (
                  <NavLink to="/admin" className="text-[#38E07B] hover:text-white transition-colors">
                    <FiGrid className="text-xl" title="Admin Panel" />
                  </NavLink>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 focus:outline-none group"
                  >
                    <div className="relative">
                      <img
                        src={getAvatarSrc(user?.avatar)}
                        alt="Avatar"
                        className="w-9 h-9 rounded-full object-cover border-2 border-[#38E07B]/50 group-hover:border-[#38E07B] transition-colors"
                      />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#38E07B] rounded-full border-2 border-[#122017]"></div>
                    </div>
                    <FiChevronDown className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-64 bg-[#1a2c23]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden origin-top-right"
                      >
                        <div className="p-4 border-b border-white/5 bg-gradient-to-r from-[#38E07B]/10 to-transparent">
                          <p className="text-white font-bold truncate">{user?.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                          {user?.plan !== 'Free' && (
                            <span className="mt-2 inline-block px-2 py-0.5 bg-[#38E07B] text-[#122017] text-[10px] font-bold rounded-full uppercase tracking-wider">
                              {user?.plan} PRO
                            </span>
                          )}
                        </div>
                        
                        <div className="p-2">
                          <NavLink 
                            to="/profile" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 group-hover:bg-[#38E07B]/20 group-hover:text-[#38E07B] transition-colors">
                              <FiSettings />
                            </div>
                            Settings
                          </NavLink>
                          
                          <button
                            onClick={() => { handleLogout(); setIsDropdownOpen(false); }}
                            className="w-full flex items-center px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all group mt-1"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center mr-3 group-hover:bg-red-500/20 transition-colors">
                              <FiLogOut />
                            </div>
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-6">
                <NavLink to="/login" className="text-white hover:text-[#38E07B] font-medium transition-colors">
                  Log In
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-5 py-2.5 bg-[#38E07B] text-[#122017] font-bold rounded-xl hover:bg-[#2fc468] hover:shadow-[0_0_20px_rgba(56,224,123,0.3)] transition-all transform hover:scale-105"
                >
                  Get Started
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white text-2xl focus:outline-none">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#122017]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-4">
              
              {/* 🌍 MOBILE CURRENCY SELECTOR */}
              <div className="flex justify-between items-center text-gray-300 pb-4 border-b border-white/10">
                  <span className="flex items-center gap-2"><FiGlobe className="text-[#38E07B]" /> Currency:</span>
                  <select 
                    value={currency} 
                    onChange={(e) => changeCurrency(e.target.value)}
                    className="bg-white/10 text-white p-2 rounded border border-white/20 text-sm outline-none"
                  >
                    {currencies.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
                  </select>
              </div>

              <NavLink to="/" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-gray-300 hover:text-white">Home</NavLink>
              <NavLink to="/about" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-gray-300 hover:text-white">About</NavLink>
              <NavLink to="/plans" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-gray-300 hover:text-white">Pricing</NavLink>
              
              {isAuthenticated ? (
                <>
                  <div className="h-px bg-white/10 my-4"></div>
                  <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-[#38E07B]">Dashboard</NavLink>
                  <NavLink to="/profile" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-gray-300 hover:text-white">Profile Settings</NavLink>
                  <button onClick={handleLogout} className="block w-full text-left text-lg font-medium text-red-400 mt-4">Sign Out</button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <NavLink to="/login" onClick={() => setIsOpen(false)} className="py-3 text-center rounded-xl bg-white/5 text-white border border-white/10">Log In</NavLink>
                  <NavLink to="/register" onClick={() => setIsOpen(false)} className="py-3 text-center rounded-xl bg-[#38E07B] text-[#122017] font-bold">Sign Up</NavLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;