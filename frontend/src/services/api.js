import axios from 'axios';

// For production deployment on standard HTTP/HTTPS ports
// The backend API will be served from the same domain
const api = axios.create({
  baseURL: '/api',
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If we get a 401, it means the token is invalid
    // Since we removed expiration, this should only happen if:
    // 1. The server was restarted with a different JWT_SECRET
    // 2. The token was manually invalidated
    // 3. The user was deleted
    if (error.response && error.response.status === 401) {
      // Only remove token and redirect if we're in an admin area
      if (window.location.pathname.startsWith('/admin')) {
        console.warn('Authentication failed - please login again');
        // Don't automatically logout, let the user decide
      }
    }
    return Promise.reject(error);
  }
);

export default api;