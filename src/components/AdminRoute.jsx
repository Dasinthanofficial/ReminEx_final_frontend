import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38E07B]"></div>
      </div>
    );
  }

  // Not logged in? → Home
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />; // ✅ changed from /login
  }

  // Admin trying to access user routes? → Admin dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Regular user → allow
  return <Outlet />;
};

export default PrivateRoute;