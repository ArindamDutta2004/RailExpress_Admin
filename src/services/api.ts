import axios from 'axios';

// This file is only used for admin auth/signup flows.
const API_BASE_URL = 'http://localhost:5000/api/admin';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  signup: (data: { name: string; email: string; password: string; phone: string }) =>
    api.post('/auth/signup', data),
};

export default api;
