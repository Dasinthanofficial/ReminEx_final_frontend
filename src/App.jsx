import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layouts
import Layout from './components/Layout';      // Public (Navbar+Footer)
import UserLayout from './components/UserLayout'; // 🟢 NEW User Dashboard Layout (Sidebar)
import AdminLayout from './components/AdminLayout'; // Admin Sidebar

// Guards
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/UserDashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Plans from './pages/Plans';
import ManagePlans from './pages/ManagePlans';
import PaymentSuccess from './pages/PaymentSuccess';
import AdminDashboard from './pages/AdminDashboard';
import ProfileSettings from './pages/ProfileSettings';
import AdminUsers from './pages/AdminUsers';
import AdminAnalytics from './pages/AdminAnalytics';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Toaster position="top-right" />

          <Routes>
            {/* 1. Auth Pages (Standalone) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* 2. Public Website (Navbar + Footer) */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="plans" element={<Plans />} /> {/* Public Pricing Page */}
            </Route>

            {/* 3. 🟢 USER DASHBOARD (Sidebar Layout, No Footer) */}
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

            {/* 4. ADMIN DASHBOARD (Sidebar Layout) */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/plans" element={<ManagePlans />} />
                <Route path="admin/users" element={<AdminUsers />} />
                <Route path="admin/analytics" element={<AdminAnalytics />} />
              </Route>
            </Route>

          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;