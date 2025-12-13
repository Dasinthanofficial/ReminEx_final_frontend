import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#122017]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38E07B]" />
      </div>
    );
  }

  // Not logged in -> go login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but not admin -> go user dashboard
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin -> allow
  return <Outlet />;
};

export default AdminRoute;