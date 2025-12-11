import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layouts
import Layout from './components/Layout';      // Public (Navbar+Footer)
import UserLayout from './components/UserLayout'; // User Dashboard Layout (Sidebar)
import AdminLayout from './components/AdminLayout'; // Admin Sidebar

// Guards
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import GuestRoute from './components/GuestRoute';   // 👈 NEW

// Pages - Public & Auth
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Plans from './pages/Plans';

// Pages - User
import UserDashboard from './pages/UserDashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProfileSettings from './pages/ProfileSettings';
import PaymentSuccess from './pages/PaymentSuccess';

// Pages - Admin
import AdminDashboard from './pages/AdminDashboard';
import ManagePlans from './pages/ManagePlans';
import AdminUsers from './pages/AdminUsers';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminPromotion from './pages/AdminPromotion';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Toaster position="top-right" />

          <Routes>
            {/* 1. Auth Pages (Login/Register) protected by GuestRoute */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* 2. Forgot/Reset – can be accessed by anyone */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* 3. Public Website (Navbar + Footer) */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="plans" element={<Plans />} /> 
            </Route>

            {/* 4. USER DASHBOARD */}
            <Route element={<PrivateRoute />}>
              <Route element={<UserLayout />}>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="payment-success" element={<PaymentSuccess />} />
              </Route>
            </Route>

            {/* 5. ADMIN DASHBOARD */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/plans" element={<ManagePlans />} />
                <Route path="admin/users" element={<AdminUsers />} />
                <Route path="admin/analytics" element={<AdminAnalytics />} />
                <Route path="admin/promote" element={<AdminPromotion />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;