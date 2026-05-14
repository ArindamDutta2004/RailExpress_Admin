import axios from 'axios';

export const BACKEND_BASE =
  import.meta.env.VITE_BACKEND_BASE_URL || 'https://railexpress-backend.onrender.com';
const API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || `${BACKEND_BASE}/api/admin`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data: { name: string; email: string; password: string; phone: string }) =>
    api.post('/auth/signup', data),
};

export const bookingAPI = {
  create: (data: {
    fromStation: string;
    toStation: string;
    journeyDate: string;
    passengerName: string;
    dateOfBirth: string;
    bookingType: 'tatkal' | 'reservation' | 'vip';
    age: number;
    phone: string;
    preferredTrains?: string[];
  }) => api.post('/booking/create', data),

  getAll: () => api.get('/booking/all'),

  getById: (id: string) => api.get(`/booking/${id}`),

  approve: (id: string) => api.put(`/booking/${id}/approve`),

  cancel: (id: string) => api.put(`/booking/${id}/cancel`),

  setAdvance: (id: string, data: { advanceAmount: number; remainingAmount?: number; qrOwner: string }) =>
    api.put(`/booking/${id}/advance`, data),

  updateQrOwner: (id: string, qrOwner: string) =>
    api.put(`/booking/${id}/qr-owner`, { qrOwner }),

  confirmAdvancePayment: (id: string) => api.put(`/booking/${id}/confirm-advance-payment`),

  markBookingDone: (id: string) => api.put(`/booking/${id}/booking-done`),

  confirmFinalPayment: (id: string) => api.put(`/booking/${id}/confirm-final-payment`),

  uploadTicket: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('ticket', file);
    return api.post(`/booking/${id}/ticket`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadBill: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('bill', file);
    return api.post(`/booking/${id}/bill`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
