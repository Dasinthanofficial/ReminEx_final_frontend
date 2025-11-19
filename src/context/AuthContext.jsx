// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { authService } from '../services/authService';
// import toast from 'react-hot-toast';

// const AuthContext = createContext({});

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initAuth = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const userData = await authService.getCurrentUser();
//           setUser(userData);
//         } catch (error) {
//           localStorage.removeItem('token');
//         }
//       }
//       setLoading(false);
//     };
//     initAuth();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await authService.login(email, password);
//       localStorage.setItem('token', response.token);
//       setUser(response.user);
//       toast.success('Login successful!');
//       return response;
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Login failed');
//       throw error;
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await authService.register(userData);
//       localStorage.setItem('token', response.token);
//       setUser(response.user);
//       toast.success('Registration successful!');
//       return response;
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Registration failed');
//       throw error;
//     }
//   };

//   // ✅ Google sign-in
//   const loginWithGoogle = async (idToken) => {
//     try {
//       const response = await authService.loginWithGoogle(idToken);
//       localStorage.setItem('token', response.token);
//       setUser(response.user);
//       toast.success('Signed in with Google!');
//       return response;
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Google sign-in failed');
//       throw error;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     toast.success('Logged out successfully');
//   };

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     loginWithGoogle,          // ✅ exposed
//     loading,
//     isAuthenticated: !!user,
//     isAdmin: user?.role === 'admin',
//     isPremium: ['Monthly', 'Yearly'].includes(user?.plan),
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          // If token is invalid or expired, clear it
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      toast.success('Login successful!');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      toast.success('Registration successful!');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  // ✅ Google sign-in
  const loginWithGoogle = async (idToken) => {
    try {
      const response = await authService.loginWithGoogle(idToken);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      toast.success('Signed in with Google!');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google sign-in failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  // 🟢 NEW FUNCTION: Allows components to update the user object without a full login/token process
  const updateUser = (updatedUserData) => {
    // Only update the state; the token remains valid and future API calls will work.
    setUser(updatedUserData); 
  };

  const value = {
    user,
    login,
    register,
    logout,
    loginWithGoogle,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isPremium: ['Monthly', 'Yearly'].includes(user?.plan),
    updateUser, // 🟢 EXPOSED: Make it available to consuming components
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};