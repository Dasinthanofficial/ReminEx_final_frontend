import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuestRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#122017]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#38E07B] border-t-transparent shadow-[0_0_15px_rgba(56,224,123,0.4)]" />
      </div>
    );
  }

  // Already logged in → send to dashboard/admin
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
  }

  // Not logged in → allow access to children (login/register)
  return <Outlet />;
};

export default GuestRoute;