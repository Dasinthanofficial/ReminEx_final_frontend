// import axios from "axios";

// const API_URL =
//   import.meta.env.VITE_API_URL ||
//   "http://localhost:5000/api";

// const isDev = import.meta.env.DEV;

// if (isDev) {
//   console.log("🔧 API configured with URL:", API_URL);
// }

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   // You are using JWT in Authorization header, not cookies:
//   withCredentials: false,
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // ✅ Dev-only logs, and redact sensitive fields
//     if (isDev) {
//       const method = (config.method || "GET").toUpperCase();
//       const url = config.url;

//       let safeData = config.data;

//       // Don't print FormData contents
//       if (safeData instanceof FormData) {
//         safeData = "[FormData]";
//       } else if (safeData && typeof safeData === "object") {
//         safeData = { ...safeData };

//         // common sensitive fields
//         if ("password" in safeData) safeData.password = "***";
//         if ("newPassword" in safeData) safeData.newPassword = "***";
//         if ("otp" in safeData) safeData.otp = "***";
//         if ("idToken" in safeData) safeData.idToken = "***";
//       }

//       console.log("📤 Request:", method, url, safeData);
//     }

//     return config;
//   },
//   (error) => {
//     if (isDev) console.error("❌ Request error:", error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => {
//     if (isDev) {
//       console.log("📥 Response:", response.status, response.config?.url);
//     }
//     return response.data; // your app expects response.data directly
//   },
//   (error) => {
//     const status = error.response?.status;
//     const url = error.config?.url || "";

//     if (isDev) {
//       console.error("❌ Response error:", status, url, error.response?.data);
//     }

//     // ✅ Instead of hard redirect, broadcast logout
//     if (status === 401 && !url.includes("/auth/")) {
//       localStorage.removeItem("token");
//       window.dispatchEvent(new Event("auth:logout"));
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from "axios";

const raw = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = String(raw).replace(/\/+$/, ""); // ✅ remove trailing slash
const isDev = import.meta.env.DEV;

if (isDev) {
  console.log("🔧 API configured with URL:", API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // JWT in Authorization header
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Let browser set multipart boundary for FormData
    if (config.data instanceof FormData) {
      if (config.headers) {
        if (typeof config.headers.delete === "function") {
          config.headers.delete("Content-Type");
          config.headers.delete("content-type");
        } else {
          delete config.headers["Content-Type"];
          delete config.headers["content-type"];
        }
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
  (error) => {
    if (isDev) console.error("❌ Request error:", error?.message || error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (isDev) console.log("📥 Response:", response.status, response.config?.url);
    return response.data;
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