import api from './api';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (email, otp, newPassword) =>
    api.post('/auth/reset-password', { email, otp, newPassword }),
  getCurrentUser: () => api.get('/user/dashboard'),

  // ✅ Google login/register
  loginWithGoogle: (idToken) =>
    api.post('/auth/google', { idToken }), // match backend route
};