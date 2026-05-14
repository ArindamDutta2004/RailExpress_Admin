import axios from 'axios';

export const BACKEND_BASE =
  import.meta.env.VITE_BACKEND_BASE_URL || 'https://railexpress-backend.onrender.com';
export const ADMIN_API_BASE =
  import.meta.env.VITE_ADMIN_API_BASE_URL || `${BACKEND_BASE}/api/admin`;

const api = axios.create({
  baseURL: ADMIN_API_BASE,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
