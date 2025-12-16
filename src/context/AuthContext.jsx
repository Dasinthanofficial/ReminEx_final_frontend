import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/authService";
import toast from "react-hot-toast";
import { fetchRates } from "../utils/currencyHelper";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "USD"
  );

  useEffect(() => {
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

  // ✅ Listen for axios-triggered logout (401s)
  useEffect(() => {
    const onAutoLogout = () => {
      // token already removed in interceptor, but safe to remove again
      localStorage.removeItem("token");
      setUser(null);
      // optional: toast (commented to avoid spam)
      // toast.error("Session expired. Please login again.");
    };

    window.addEventListener("auth:logout", onAutoLogout);
    return () => window.removeEventListener("auth:logout", onAutoLogout);
  }, []);

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

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateUser = (updater) => {
    setUser((prev) => (typeof updater === "function" ? updater(prev) : updater));
  };

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };


  const isAuthenticated = !!user;
  const isAdmin = ["admin", "superadmin"].includes(user?.role);
  const isSuperAdmin = user?.role === "superadmin";
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
  isSuperAdmin,   // 👈 add
  isPremium,
  currency,
  changeCurrency,
};
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};