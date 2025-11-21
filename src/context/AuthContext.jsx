import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/authService";
import toast from "react-hot-toast";
import { fetchRates } from "../utils/currencyHelper"; // 👈 Import this

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ 1. Add Currency State
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "USD");

  /* 🔹 Load user & Rates on start */
  useEffect(() => {
    // ✅ 2. Fetch dynamic exchange rates immediately
    fetchRates();

    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  /* 🔹 Login (email/password) */
  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      localStorage.setItem("token", res.token);
      setUser(res.user);
      toast.success("Login successful!");
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  /* 🔹 Create new account */
  const register = async (formData) => {
    try {
      const res = await authService.register(formData);
      localStorage.setItem("token", res.token);
      setUser(res.user);
      toast.success("Registration successful!");
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  /* 🔹 Google sign‑in */
  const loginWithGoogle = async (idToken) => {
    try {
      const res = await authService.loginWithGoogle(idToken);
      localStorage.setItem("token", res.token);
      setUser(res.user);
      toast.success("Signed in with Google!");
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Google sign‑in failed");
      throw err;
    }
  };

  /* 🔹 Logout */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  /* 🔹 Update local user data (without login) */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  /* 🔹 Change Currency Helper */
  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  /* 🔹 Derived values */
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isPremium = ["Monthly", "Yearly"].includes(user?.plan);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    updateUser,
    isAuthenticated,
    isAdmin,
    isPremium,
    // ✅ Export currency values
    currency,
    changeCurrency, 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};