// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext';

// // Layout
// import Layout from './components/Layout';
// import PrivateRoute from './components/PrivateRoute';
// import AdminRoute from './components/AdminRoute';

// // Pages
// import Home from './pages/Home';
// import About from './pages/About';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import ForgotPassword from "./pages/ForgotPassword.jsx";
// import ResetPassword from './pages/ResetPassword';
// import UserDashboard from './pages/UserDashboard';
// import Products from './pages/Products';
// import AddProduct from './pages/AddProduct';
// import EditProduct from './pages/EditProduct';
// import Plans from './pages/Plans';
// import PaymentSuccess from './pages/PaymentSuccess';
// import AdminDashboard from './pages/AdminDashboard';
// import ManageAds from './pages/ManageAds';
// import ManagePlans from './pages/ManagePlans';

// const queryClient = new QueryClient();

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Router>
//         <AuthProvider>
//           <Toaster 
//             position="top-right"
//             toastOptions={{
//               duration: 4000,
//               style: {
//                 background: '#363636',
//                 color: '#fff',
//               },
//             }}
//           />
//           <Routes>
//             <Route path="/" element={<Layout />}>
//               <Route index element={<Home />} />
//               <Route path="about" element={<About />} />
//               <Route path="login" element={<Login />} />
//               <Route path="register" element={<Register />} />
//               <Route path="forgot-password" element={<ForgotPassword />} />
//               <Route path="reset-password" element={<ResetPassword />} />
//               <Route path="plans" element={<Plans />} />
//               <Route path="payment-success" element={<PaymentSuccess />} />
              
//               {/* Protected Routes */}
//               <Route element={<PrivateRoute />}>
//                 <Route path="dashboard" element={<UserDashboard />} />
//                 <Route path="products" element={<Products />} />
//                 <Route path="products/add" element={<AddProduct />} />
//                 <Route path="products/edit/:id" element={<EditProduct />} />
//               </Route>
              
//               {/* Admin Routes */}
//               <Route element={<AdminRoute />}>
//                 <Route path="admin" element={<AdminDashboard />} />
//                 <Route path="admin/ads" element={<ManageAds />} />
//                 <Route path="admin/plans" element={<ManagePlans />} />
//               </Route>
//             </Route>
//           </Routes>
//         </AuthProvider>
//       </Router>
//     </QueryClientProvider>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layout
import Layout from './components/Layout';
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
import PaymentSuccess from './pages/PaymentSuccess';
import AdminDashboard from './pages/AdminDashboard';
import ManageAds from './pages/ManageAds';
import ManagePlans from './pages/ManagePlans';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#363636', color: '#fff' },
            }}
          />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="plans" element={<Plans />} />
              <Route path="payment-success" element={<PaymentSuccess />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/ads" element={<ManageAds />} />
                <Route path="admin/plans" element={<ManagePlans />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
