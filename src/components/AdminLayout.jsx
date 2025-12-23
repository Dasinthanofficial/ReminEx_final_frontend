// // import React from 'react';
// // import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// // import {
// //   FiHome,
// //   FiLayers,
// //   FiUsers,
// //   FiLogOut,
// //   FiPieChart,
// //   FiGrid,
// //   FiArrowRight,
// //   FiMail
// // } from 'react-icons/fi';
// // import { motion } from 'framer-motion';
// // import Logo from '../assets/logo.png';

// // const AdminLayout = () => {
// //   const { logout, user } = useAuth();
// //   const navigate = useNavigate();

// //   const handleLogout = () => {
// //     logout();
// //     navigate('/');
// //   };

// //   const navItems = [
// //     { path: '/admin', icon: <FiHome />, label: 'Overview', end: true },
// //     { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
// //     { path: '/admin/plans', icon: <FiLayers />, label: 'Subscription Plans' },
// //     { path: '/admin/analytics', icon: <FiPieChart />, label: 'Analytics' },
// //     { path: '/admin/promote', icon: <FiMail />, label: 'Promotions' },
// //   ];

// //   return (
// //     <div className="flex h-screen bg-[#122017] font-sans selection:bg-[#38E07B] selection:text-[#122017] overflow-hidden relative">
      
// //       {/* 🌌 Global Liquid Background */}
// //       <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
// //         <motion.div 
// //           animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0], opacity: [0.2, 0.3, 0.2] }}
// //           transition={{ duration: 20, repeat: Infinity }}
// //           className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#38E07B]/10 rounded-full blur-[150px]"
// //         />
// //         <motion.div 
// //           animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], opacity: [0.1, 0.2, 0.1] }}
// //           transition={{ duration: 25, repeat: Infinity }}
// //           className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]"
// //         />
// //       </div>

// //       {/* Sidebar */}
// //       <aside className="w-64 bg-black/20 backdrop-blur-2xl border-r border-white/10 text-white flex flex-col fixed h-full z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
// //         {/* Admin Logo Area */}
// //         <div className="h-20 flex items-center px-6 border-b border-white/5 bg-white/5">
// //            <img src={Logo} alt="ReminEx" className="h-8 mr-3" />
// //            <span className="font-bold text-lg tracking-wider text-[#38E07B]">ADMIN</span>
// //         </div>

// //         {/* Navigation Links */}
// //         <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
// //           <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Main Menu</p>
// //           {navItems.map((item) => (
// //             <NavLink
// //               key={item.label}
// //               to={item.path}
// //               end={item.end}
// //               className={({ isActive }) =>
// //                 `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
// //                   isActive
// //                     ? 'text-[#122017] font-bold shadow-[0_0_20px_rgba(56,224,123,0.3)]'
// //                     : 'text-gray-400 hover:text-white hover:bg-white/5'
// //                 }`
// //               }
// //             >
// //               {({ isActive }) => (
// //                 <>
// //                   {isActive && (
// //                     <motion.div 
// //                       layoutId="activeAdminNav"
// //                       className="absolute inset-0 bg-[#38E07B]"
// //                       initial={{ opacity: 0 }}
// //                       animate={{ opacity: 1 }}
// //                       exit={{ opacity: 0 }}
// //                     />
// //                   )}
// //                   <span className={`text-xl mr-3 relative z-10 transition-colors ${ isActive ? 'text-[#122017]' : 'text-gray-500 group-hover:text-[#38E07B]' }`}>
// //                     {item.icon}
// //                   </span>
// //                   <span className="relative z-10">{item.label}</span>
// //                 </>
// //               )}
// //             </NavLink>
// //           ))}
// //         </nav>

// //         {/* User Snippet & Logout */}
// //         <div className="p-4 border-t border-white/5 bg-black/40">
// //           <div className="flex items-center gap-3 mb-4 px-2">
// //              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#38E07B] to-emerald-800 flex items-center justify-center text-[#122017] font-bold shadow-[0_0_10px_rgba(56,224,123,0.3)]">
// //                 {user?.name?.charAt(0)}
// //              </div>
// //              <div className="overflow-hidden">
// //                 <p className="text-sm font-bold truncate text-white">{user?.name}</p>
// //                 <p className="text-[10px] text-[#38E07B] uppercase tracking-wider font-bold">Super Admin</p>
// //              </div>
// //           </div>
// //           <button
// //             onClick={handleLogout}
// //             className="flex items-center justify-center w-full px-4 py-2.5 text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition-all text-xs font-bold uppercase tracking-wide group hover:shadow-lg hover:border-red-500/40"
// //           >
// //             <FiLogOut className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
// //             Logout
// //           </button>
// //         </div>
// //       </aside>

// //       {/* Main Content Area */}
// //       <main className="flex-1 ml-64 h-screen overflow-y-auto relative z-10 custom-scrollbar">
// //         {/* Header */}
// //         <header className="h-20 flex items-center justify-between px-8 sticky top-0 z-30 bg-[#122017]/80 backdrop-blur-xl border-b border-white/5">
// //           <h2 className="font-bold text-white text-lg flex items-center gap-3">
// //             <span className="p-2 rounded-lg bg-[#38E07B]/10 text-[#38E07B] border border-[#38E07B]/20">
// //               <FiGrid /> 
// //             </span>
// //             Admin Dashboard
// //           </h2>
// //           <Link 
// //             to="/" 
// //             className="text-xs font-bold text-gray-400 hover:text-[#38E07B] flex items-center gap-2 transition-colors group bg-white/5 px-4 py-2 rounded-full hover:bg-white/10 border border-white/5"
// //           >
// //              View Live Site 
// //              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
// //           </Link>
// //         </header>

// //         {/* Page Content */}
// //         <div className="p-8">
// //           <Outlet />
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default AdminLayout;

// import React, { useState } from 'react';
// import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import {
//   FiHome,
//   FiLayers,
//   FiUsers,
//   FiLogOut,
//   FiPieChart,
//   FiGrid,
//   FiArrowRight,
//   FiMail,
//   FiMenu,
//   FiX
// } from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';
// import Logo from '../assets/logo.png';

// const AdminLayout = () => {
//   const { logout, user } = useAuth();
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const navItems = [
//     { path: '/admin', icon: <FiHome />, label: 'Overview', end: true },
//     { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
//     { path: '/admin/plans', icon: <FiLayers />, label: 'Subscription Plans' },
//     { path: '/admin/analytics', icon: <FiPieChart />, label: 'Analytics' },
//     { path: '/admin/promote', icon: <FiMail />, label: 'Promotions' },
//   ];

//   return (
//     <div className="flex h-screen bg-[#122017] font-sans selection:bg-[#38E07B] selection:text-[#122017] overflow-hidden relative">
      
//       {/* 🌌 Global Liquid Background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
//         <motion.div 
//           animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0], opacity: [0.2, 0.3, 0.2] }}
//           transition={{ duration: 20, repeat: Infinity }}
//           className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#38E07B]/10 rounded-full blur-[150px]"
//         />
//         <motion.div 
//           animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], opacity: [0.1, 0.2, 0.1] }}
//           transition={{ duration: 25, repeat: Infinity }}
//           className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]"
//         />
//       </div>

//       {/* 📱 Mobile Overlay (Backdrop) */}
//       <AnimatePresence>
//         {isSidebarOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setIsSidebarOpen(false)}
//             className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
//           />
//         )}
//       </AnimatePresence>

//       {/* Sidebar */}
//       <aside 
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#122017]/95 lg:bg-black/20 backdrop-blur-2xl border-r border-white/10 text-white flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         {/* Admin Logo Area */}
//         <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-white/5">
//            <div className="flex items-center">
//              <img src={Logo} alt="ReminEx" className="h-8 mr-3" />
//              <span className="font-bold text-lg tracking-wider text-[#38E07B]">ADMIN</span>
//            </div>
//            {/* Mobile Close Button */}
//            <button 
//              onClick={() => setIsSidebarOpen(false)} 
//              className="lg:hidden text-gray-400 hover:text-white"
//            >
//              <FiX size={24} />
//            </button>
//         </div>

//         {/* Navigation Links */}
//         <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
//           <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Main Menu</p>
//           {navItems.map((item) => (
//             <NavLink
//               key={item.label}
//               to={item.path}
//               end={item.end}
//               onClick={() => setIsSidebarOpen(false)} // Close sidebar on click (mobile)
//               className={({ isActive }) =>
//                 `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
//                   isActive
//                     ? 'text-[#122017] font-bold shadow-[0_0_20px_rgba(56,224,123,0.3)]'
//                     : 'text-gray-400 hover:text-white hover:bg-white/5'
//                 }`
//               }
//             >
//               {({ isActive }) => (
//                 <>
//                   {isActive && (
//                     <motion.div 
//                       layoutId="activeAdminNav"
//                       className="absolute inset-0 bg-[#38E07B]"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                     />
//                   )}
//                   <span className={`text-xl mr-3 relative z-10 transition-colors ${ isActive ? 'text-[#122017]' : 'text-gray-500 group-hover:text-[#38E07B]' }`}>
//                     {item.icon}
//                   </span>
//                   <span className="relative z-10">{item.label}</span>
//                 </>
//               )}
//             </NavLink>
//           ))}
//         </nav>

//         {/* User Snippet & Logout */}
//         <div className="p-4 border-t border-white/5 bg-black/40">
//           <div className="flex items-center gap-3 mb-4 px-2">
//              <div className="w-9 h-9 min-w-[36px] rounded-full bg-gradient-to-br from-[#38E07B] to-emerald-800 flex items-center justify-center text-[#122017] font-bold shadow-[0_0_10px_rgba(56,224,123,0.3)]">
//                 {user?.name?.charAt(0)}
//              </div>
//              <div className="overflow-hidden">
//                 <p className="text-sm font-bold truncate text-white">{user?.name}</p>
//                 <p className="text-[10px] text-[#38E07B] uppercase tracking-wider font-bold">Super Admin</p>
//              </div>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center justify-center w-full px-4 py-2.5 text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition-all text-xs font-bold uppercase tracking-wide group hover:shadow-lg hover:border-red-500/40"
//           >
//             <FiLogOut className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       {/* Added lg:ml-64 to push content on desktop, removed fixed margin on mobile */}
//       <main className="flex-1 w-full lg:ml-64 h-screen overflow-y-auto relative z-10 custom-scrollbar">
//         {/* Header */}
//         <header className="h-20 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 bg-[#122017]/80 backdrop-blur-xl border-b border-white/5">
//           <div className="flex items-center gap-4">
//             {/* Mobile Hamburger Trigger */}
//             <button 
//               onClick={() => setIsSidebarOpen(true)}
//               className="lg:hidden p-2 text-white bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 active:scale-95 transition-all"
//             >
//               <FiMenu size={20} />
//             </button>

//             <h2 className="font-bold text-white text-base lg:text-lg flex items-center gap-3">
//               <span className="p-2 rounded-lg bg-[#38E07B]/10 text-[#38E07B] border border-[#38E07B]/20 hidden sm:block">
//                 <FiGrid /> 
//               </span>
//               Dashboard
//             </h2>
//           </div>

//           <Link 
//             to="/" 
//             className="text-xs font-bold text-gray-400 hover:text-[#38E07B] flex items-center gap-2 transition-colors group bg-white/5 px-4 py-2 rounded-full hover:bg-white/10 border border-white/5"
//           >
//              <span className="hidden sm:inline">View Live Site</span>
//              <span className="sm:hidden">Live Site</span>
//              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
//           </Link>
//         </header>

//         {/* Page Content */}
//         <div className="p-4 lg:p-8">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;

import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiLayers,
  FiUsers,
  FiLogOut,
  FiPieChart,
  FiGrid,
  FiArrowRight,
  FiMail,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/logo.png";

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { path: "/admin", icon: <FiHome />, label: "Overview", end: true },
    { path: "/admin/users", icon: <FiUsers />, label: "Users" },
    { path: "/admin/plans", icon: <FiLayers />, label: "Subscription Plans" },
    { path: "/admin/analytics", icon: <FiPieChart />, label: "Analytics" },
    { path: "/admin/promote", icon: <FiMail />, label: "Promotions" },
  ];

  // Close sidebar with Esc on mobile
  useEffect(() => {
    if (!isSidebarOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-dvh bg-[#122017] font-sans selection:bg-[#38E07B] selection:text-[#122017] overflow-hidden relative">
      {/* 🌌 Global Liquid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#38E07B]/10 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]"
        />
      </div>

      {/* 📱 Mobile Overlay (Backdrop) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#122017] lg:bg-black/20 backdrop-blur-2xl border-r border-white/10 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-white/5 shrink-0">
          <div className="flex items-center min-w-0">
            <img src={Logo} alt="ReminEx" className="h-8 mr-3 shrink-0" />
            <span className="font-bold text-lg tracking-wider text-[#38E07B] truncate">
              ADMIN
            </span>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 -mr-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
            Main Menu
          </p>

          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden min-w-0 ${
                  isActive
                    ? "text-[#122017] font-bold shadow-[0_0_20px_rgba(56,224,123,0.3)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeAdminNav"
                      className="absolute inset-0 bg-[#38E07B]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}

                  <span
                    className={`text-xl mr-3 relative z-10 transition-colors shrink-0 ${
                      isActive
                        ? "text-[#122017]"
                        : "text-gray-500 group-hover:text-[#38E07B]"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span className="relative z-10 truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Snippet & Logout */}
        <div className="p-4 border-t border-white/5 bg-black/40 shrink-0">
          <div className="flex items-center gap-3 mb-4 px-2 min-w-0">
            <div className="w-9 h-9 min-w-[36px] rounded-full bg-gradient-to-br from-[#38E07B] to-emerald-800 flex items-center justify-center text-[#122017] font-bold shadow-[0_0_10px_rgba(56,224,123,0.3)]">
              {(user?.name || "?").charAt(0).toUpperCase()}
            </div>

            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-bold truncate text-white">{user?.name}</p>
              <p className="text-[10px] text-[#38E07B] uppercase tracking-wider font-bold">
                Super Admin
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2.5 text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition-all text-xs font-bold uppercase tracking-wide group hover:shadow-lg hover:border-red-500/40"
          >
            <FiLogOut className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0 lg:ml-64 min-h-dvh overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 bg-[#122017]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-3 lg:gap-4 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-300 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:text-white transition-all shrink-0"
              aria-label="Open sidebar"
            >
              <FiMenu size={20} />
            </button>

            <h2 className="font-bold text-white text-base lg:text-lg flex items-center gap-3 min-w-0">
              <span className="p-2 rounded-lg bg-[#38E07B]/10 text-[#38E07B] border border-[#38E07B]/20 hidden sm:flex shrink-0">
                <FiGrid />
              </span>
              <span className="truncate">Dashboard</span>
            </h2>
          </div>

          <Link
            to="/"
            className="shrink-0 text-xs font-bold text-gray-400 hover:text-[#38E07B] flex items-center gap-2 transition-colors group bg-white/5 px-4 py-2 rounded-full hover:bg-white/10 border border-white/5"
          >
            <span className="hidden sm:inline">View Live Site</span>
            <span className="sm:hidden">Live Site</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </header>

        {/* Page Content */}
        <div className="w-full min-w-0 p-4 sm:p-6 lg:p-8 pb-24">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;