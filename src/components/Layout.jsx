import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#122017] font-sans selection:bg-[#38E07B] selection:text-[#122017] relative overflow-hidden">
      
      {/* 🌌 Global Animated Liquid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top Left Green Glow */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1], 
            rotate: [0, 90, 0], 
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#38E07B]/15 rounded-full blur-[150px]"
        />
        
        {/* Bottom Right Blue Glow */}
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1], 
            x: [0, -50, 0], 
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] bg-blue-600/15 rounded-full blur-[180px]"
        />
      </div>

      {/* Navbar (Fixed Top) */}
      <Navbar />

      {/* Main Content (Transparent to show background) */}
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;