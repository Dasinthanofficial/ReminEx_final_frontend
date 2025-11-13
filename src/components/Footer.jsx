import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-[#122017] text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">ReminEx</h3>
            <p className="text-gray-400">
              Your smart companion for reducing <br /> food waste and saving money.
            </p>
          </div>

          {/* Quick Links */}
          <div className='text-center'>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/plans" className="text-gray-400 hover:text-white transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

    
          {/* Contact */}
          <div className='text-center '>
            <h4 className="font-semibold flex justify-end mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center justify-end  text-gray-400">
                <FiMail className="mr-2" />
                support@foodtracker.com
              </li>
              <li className="flex items-center justify-end text-gray-400">
                <FiPhone className="mr-2" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center justify-end text-gray-400">
                <FiMapPin className="mr-2" />
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy;2024 ReminEx. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;