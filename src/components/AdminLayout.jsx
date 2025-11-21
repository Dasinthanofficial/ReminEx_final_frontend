import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome,
  FiLayers,
  FiUsers,
  FiLogOut,
  FiPieChart,
  FiGrid
} from 'react-icons/fi';
import Logo from '../assets/logo.png';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: <FiHome />, label: 'Overview', end: true },
    { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
    // 🟢 HIGHLIGHTED: This is your Plan Management Route
    { path: '/admin/plans', icon: <FiLayers />, label: 'Subscription Plans' },
    { path: '/admin/analytics', icon: <FiPieChart />, label: 'Analytics' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#122017] text-white flex flex-col fixed h-full z-20 shadow-2xl">
        {/* Admin Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-gray-700 bg-[#0d1811]">
           <img src={Logo} alt="ReminEx" className="h-8 mr-2" />
           <span className="font-bold text-lg tracking-wider text-[#38E07B]">ADMIN</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          <p className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#38E07B] text-[#122017] font-bold shadow-lg shadow-green-900/20'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className={`text-xl mr-3 ${ ({isActive}) => isActive ? 'text-[#122017]' : 'text-gray-400 group-hover:text-white' }`}>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Snippet & Logout */}
        <div className="p-4 border-t border-gray-700 bg-[#0d1811]">
          <div className="flex items-center gap-3 mb-4 px-2">
             <div className="w-8 h-8 rounded-full bg-[#38E07B] flex items-center justify-center text-[#122017] font-bold">
                {user?.name?.charAt(0)}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.name}</p>
                <p className="text-xs text-gray-400">Super Admin</p>
             </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 h-screen overflow-y-auto bg-gray-50">
        {/* Header */}
        <header className="bg-white h-16 shadow-sm flex items-center justify-between px-8 sticky top-0 z-10 border-b border-gray-200">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <FiGrid className="text-[#38E07B]" /> Admin Panel
          </h2>
          <Link to="/" className="text-sm text-gray-500 hover:text-[#38E07B]">
             View Live Site &rarr;
          </Link>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;