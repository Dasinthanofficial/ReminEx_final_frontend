import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/authService";
import toast from "react-hot-toast";
import { fetchRates } from "../utils/currencyHelper";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// Helper to extract best error message from API response
const getApiErrorMessage = (err, fallback = "Something went wrong") => {
  const data = err?.response?.data;
  if (!data) return fallback;

  // Prefer first field error if available (from validators.js)
  if (Array.isArray(data.errors) && data.errors[0]?.message) {
    return data.errors[0].message;
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  return fallback;
};

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
      localStorage.removeItem("token");
      setUser(null);
      // optional: toast
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
      toast.error(getApiErrorMessage(err, "Login failed"));
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
      toast.error(getApiErrorMessage(err, "Registration failed"));
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
      toast.error(getApiErrorMessage(err, "Google sign-in failed"));
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
    isSuperAdmin,
    isPremium,
    currency,
    changeCurrency,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};