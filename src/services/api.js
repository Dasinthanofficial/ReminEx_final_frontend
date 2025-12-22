import axios from "axios";

const raw = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = String(raw).replace(/\/+$/, "");
const isDev = import.meta.env.DEV;

if (isDev) console.log("🔧 API configured with URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, // JWT in Authorization header
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    // ✅ Attach JWT for protected routes (/payment/checkout needs it)
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // ✅ Let browser set multipart boundary for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    } else {
      // ✅ Only set JSON content-type for non-FormData requests
      if (!config.headers["Content-Type"] && !config.headers["content-type"]) {
        config.headers["Content-Type"] = "application/json";
      }
    }

    if (isDev) {
      const method = (config.method || "GET").toUpperCase();
      const url = config.url;

      let safeData = config.data;
      if (safeData instanceof FormData) safeData = "[FormData]";
      else if (safeData && typeof safeData === "object") {
        safeData = { ...safeData };
        if ("password" in safeData) safeData.password = "***";
        if ("newPassword" in safeData) safeData.newPassword = "***";
        if ("otp" in safeData) safeData.otp = "***";
        if ("idToken" in safeData) safeData.idToken = "***";
      }

      console.log("📤 Request:", method, url, safeData);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (isDev) console.log("📥 Response:", response.status, response.config?.url);
    return response.data; // app expects JSON body directly
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    if (isDev) {
      console.error(
        "❌ Response error:",
        status,
        url,
        "| message:",
        error.message,
        "| code:",
        error.code,
        "| data:",
        error.response?.data
      );
    }

    // auto logout on 401 (except auth endpoints)
    if (status === 401 && !url.includes("/auth/")) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth:logout"));
    }

    return Promise.reject(error);
  }
);

export default api;