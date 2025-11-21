import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi';
import Logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="relative bg-[#122017] text-white overflow-hidden pt-20 pb-10">
      
      {/* Background Glows */}
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-[#38E07B]/5 to-transparent pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[150px] opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Main Grid - Adjusted to 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* 1. Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 mb-4">
               <img src={Logo} alt="ReminEx" className="h-10 opacity-90" />
               <span className="text-2xl font-bold tracking-wide">ReminEx</span>
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
              The smartest way to track your groceries, reduce waste, and save money. Join the sustainable revolution today.
            </p>
            <div className="flex gap-4 pt-2">
              {[FiInstagram, FiTwitter, FiLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#38E07B] hover:text-[#122017] transition-all duration-300">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="md:pl-10">
            <h4 className="text-lg font-bold mb-6 text-white">Explore</h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Pricing Plans', path: '/plans' },
                { name: 'Dashboard', path: '/dashboard' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-[#38E07B] hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38E07B] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-[#38E07B] mt-1 text-lg" />
                <span>123 Innovation Dr,<br/>San Francisco, CA 94103</span>
              </li>
              <li className="flex items-center gap-3 group">
                <FiPhone className="text-[#38E07B] group-hover:rotate-12 transition-transform" />
                <a href="tel:+15551234567" className="hover:text-white transition-colors">+1 (555) 123-4567</a>
              </li>
              <li className="flex items-center gap-3 group">
                <FiMail className="text-[#38E07B] group-hover:scale-110 transition-transform" />
                <a href="mailto:support@reminex.com" className="hover:text-white transition-colors">support@reminex.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} ReminEx Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;