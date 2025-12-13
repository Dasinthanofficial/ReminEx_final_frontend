import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiBox, FiPlusCircle, FiUser, FiLogOut, FiCreditCard, FiMenu, FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/logo.png';

const UserLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: <FiHome />, label: 'Overview' },
    { path: '/products', icon: <FiBox />, label: 'My Inventory' },
    { path: '/products/add', icon: <FiPlusCircle />, label: 'Add Product' },
    { path: '/plans', icon: <FiCreditCard />, label: 'Subscription' },
    { path: '/profile', icon: <FiUser />, label: 'Profile Settings' },
  ];

  return (
    <div className="flex min-h-screen md:h-screen bg-[#122017] font-sans selection:bg-[#38E07B] selection:text-[#122017] overflow-hidden relative">
      
      {/* 🌌 Global Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#38E07B]/10 rounded-full blur-[150px]"
        />
      </div>

      {/* 📱 Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#122017]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 z-40">
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-8" />
          <span className="font-bold text-white">ReminEx</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white text-2xl p-2"
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* 📱 Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed inset-0 z-30 bg-[#122017] md:hidden pt-20 px-6 flex flex-col h-full overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-4 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#38E07B] text-[#122017] font-bold'
                        : 'text-gray-400 hover:bg-white/5'
                    }`
                  }
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-4 text-red-400 mt-4 border-t border-white/10"
              >
                <FiLogOut className="mr-3 text-xl" /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🖥️ Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col fixed h-full z-20 border-r border-white/10 bg-black/20 backdrop-blur-2xl">
        <div className="h-24 flex items-center px-8 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="h-9 w-auto" />
            <span className="font-bold text-xl text-white">ReminEx</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="px-6 py-8">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38E07B] to-emerald-800 flex items-center justify-center text-[#122017] font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-white truncate text-sm">{user?.name}</p>
              <p className="text-[10px] text-[#38E07B] uppercase">{user?.plan} Plan</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'text-[#122017] bg-[#38E07B] font-bold shadow-[0_0_20px_rgba(56,224,123,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span className="text-xl mr-3 relative z-10">{item.icon}</span>
              <span className="relative z-10">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-3 text-red-400 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-all font-bold text-sm"
          >
            <FiLogOut className="mr-2" /> Sign Out
          </button>
        </div>
      </aside>

      {/* 🧱 Main Content Area */}
      <main className="flex-1 md:ml-72 min-h-screen md:h-screen overflow-y-auto relative z-10 custom-scrollbar pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10 py-4 md:py-8 pb-24 md:pb-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;