import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiBox, 
  FiPlusCircle, 
  FiUser, 
  FiLogOut, 
  FiCreditCard,
  FiArrowLeft 
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import Logo from '../assets/logo.png';

const UserLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // ✅ go to home instead of /login
  };

  const navItems = [
    { path: '/dashboard', icon: <FiHome />, label: 'Overview' },
    { path: '/products', icon: <FiBox />, label: 'My Inventory' },
    { path: '/products/add', icon: <FiPlusCircle />, label: 'Add Product' },
    { path: '/plans', icon: <FiCreditCard />, label: 'Subscription' },
    { path: '/profile', icon: <FiUser />, label: 'Profile Settings' },
  ];

  return (
    <div className="flex h-screen bg-[#122017] font-sans selection:bg-[#38E07B] selection:text-[#122017] overflow-hidden relative">
      
      {/* 🌌 Global Liquid Background (Visible through glass panels) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#38E07B]/10 rounded-full blur-[150px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]"
        />
      </div>

      {/* 1. 🪟 Glass Sidebar Navigation */}
      <aside className="w-72 hidden md:flex flex-col fixed h-full z-20 border-r border-white/10 bg-black/20 backdrop-blur-2xl shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        
        {/* Logo Area */}
        <div className="h-24 flex items-center px-8 border-b border-white/5">
           <Link to="/" className="flex items-center gap-3 group">
              <img src={Logo} alt="Logo" className="h-9 w-auto group-hover:scale-105 transition-transform duration-300" />
              <span className="font-bold text-xl text-white tracking-wide group-hover:text-[#38E07B] transition-colors">
                ReminEx
              </span>
           </Link>
        </div>

        {/* User Snippet */}
        <div className="px-6 py-8">
           <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 backdrop-blur-md shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#38E07B]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38E07B] to-emerald-800 flex items-center justify-center text-[#122017] font-bold text-lg shadow-[0_0_15px_rgba(56,224,123,0.4)] z-10">
                {user?.name?.charAt(0)}
              </div>
              <div className="overflow-hidden z-10">
                <p className="font-bold text-white truncate text-sm">{user?.name}</p>
                <p className="text-[10px] text-[#38E07B] font-bold uppercase tracking-widest bg-[#38E07B]/10 px-2 py-0.5 rounded-full inline-block mt-1 border border-[#38E07B]/20">
                  {user?.plan} Plan
                </p>
              </div>
           </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 mt-2">Main Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'text-[#122017] font-bold shadow-[0_0_20px_rgba(56,224,123,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute inset-0 bg-[#38E07B]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  <span className={`text-xl mr-3 relative z-10 transition-colors ${ isActive ? 'text-[#122017]' : 'text-gray-500 group-hover:text-[#38E07B]' }`}>
                    {item.icon}
                  </span>
                  <span className="relative z-10">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-white/5 bg-black/20">
          <Link to="/" className="flex items-center px-4 py-3 text-xs font-bold text-gray-400 hover:text-white transition-colors mb-2 uppercase tracking-wide group">
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-3 text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 rounded-xl transition-all font-bold text-sm shadow-lg group"
          >
            <FiLogOut className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area (Transparent for Glass Effect) */}
      <main className="flex-1 md:ml-72 h-screen overflow-y-auto relative z-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
           <Outlet />
        </div>
      </main>

      {/* Mobile Header (Visible only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#122017]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 z-30">
         <img src={Logo} alt="Logo" className="h-8" />
         <button 
            onClick={() => navigate('/products')} 
            className="bg-[#38E07B] text-[#122017] px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg shadow-[#38E07B]/20"
         >
            Menu
         </button>
      </div>
    </div>
  );
};

export default UserLayout;