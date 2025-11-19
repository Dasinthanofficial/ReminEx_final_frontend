// // src/App.jsx

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext';


// import Layout from './components/Layout';
// import PrivateRoute from './components/PrivateRoute';
// import AdminRoute from './components/AdminRoute';


// import Home from './pages/Home';
// import About from './pages/About';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import ForgotPassword from './pages/ForgotPassword';
// import ResetPassword from './pages/ResetPassword';
// import UserDashboard from './pages/UserDashboard';
// import Products from './pages/Products';
// import AddProduct from './pages/AddProduct';
// import EditProduct from './pages/EditProduct';
// import Plans from './pages/Plans';
// import PaymentSuccess from './pages/PaymentSuccess';
// import AdminDashboard from './pages/AdminDashboard';
// import ManagePlans from './pages/ManagePlans';


// const queryClient = new QueryClient();


// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       {/* FIX: Add the `future` prop to the Router to resolve the warnings */}
//       <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
//         <AuthProvider>
//           <Toaster
//             position="top-right"
//             toastOptions={{
//               duration: 4000,
//               style: { background: '#363636', color: '#fff' },
//             }}
//           />


//           <Routes>
//             {/* Auth pages WITHOUT Layout */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/reset-password" element={<ResetPassword />} />


//             {/* All other pages with Layout */}
//             <Route element={<Layout />}>
//               <Route index element={<Home />} />
//               <Route path="about" element={<About />} />
//               <Route path="plans" element={<Plans />} />
//               <Route path="payment-success" element={<PaymentSuccess />} />


//               {/* Protected user routes */}
//               <Route element={<PrivateRoute />}>
//                 <Route path="dashboard" element={<UserDashboard />} />
//                 <Route path="products" element={<Products />} />
//                 <Route path="products/add" element={<AddProduct />} />
//                 <Route path="products/edit/:id" element={<EditProduct />} />
//               </Route>


//               {/* Admin routes */}
//               <Route element={<AdminRoute />}>
//                 <Route path="admin" element={<AdminDashboard />} />
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

import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

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
import ManagePlans from './pages/ManagePlans';
import ProfileSettings from './pages/ProfileSettings'; // 🟢 NEW IMPORT

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#363636', color: '#fff' },
            }}
          />

          <Routes>
            {/* Auth pages WITHOUT Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* All other pages with Layout */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="plans" element={<Plans />} />
              <Route path="payment-success" element={<PaymentSuccess />} />

              {/* Protected user routes */}
              <Route element={<PrivateRoute />}>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
                <Route path="profile" element={<ProfileSettings />} /> {/* 🟢 NEW ROUTE ADDED */}
              </Route>

              {/* Admin routes */}
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminDashboard />} />
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