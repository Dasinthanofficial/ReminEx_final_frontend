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
import Logo from '../assets/logo.png'; // Ensure path is correct

const UserLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: <FiHome />, label: 'Overview' },
    { path: '/products', icon: <FiBox />, label: 'My Inventory' },
    { path: '/products/add', icon: <FiPlusCircle />, label: 'Add Product' },
    { path: '/plans', icon: <FiCreditCard />, label: 'Subscription' },
    { path: '/profile', icon: <FiUser />, label: 'Profile Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* 1. Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-20">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
           <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="Logo" className="h-8 w-auto" />
              <span className="font-bold text-xl text-[#122017]">ReminEx</span>
           </Link>
        </div>

        {/* User Snippet */}
        <div className="px-6 py-6">
           <div className="p-4 bg-green-50 rounded-xl flex items-center gap-3 border border-green-100">
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                {user?.name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-green-600 font-medium uppercase tracking-wide">{user?.plan} Plan</p>
              </div>
           </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#122017] text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <span className={`text-xl mr-3 transition-colors ${ ({isActive}) => isActive ? 'text-[#38E07B]' : 'text-gray-400 group-hover:text-gray-600' }`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100">
          <Link to="/" className="flex items-center px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-2">
            <FiArrowLeft className="mr-3" /> Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-medium"
          >
            <FiLogOut className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 md:ml-72 h-screen overflow-y-auto bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
           <Outlet />
        </div>
      </main>

      {/* Mobile Header (Visible only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30">
         <img src={Logo} alt="Logo" className="h-8" />
         <button onClick={() => navigate('/products')} className="bg-[#122017] text-white px-3 py-1 rounded-lg text-sm">
            Menu
         </button>
      </div>
    </div>
  );
};

export default UserLayout;