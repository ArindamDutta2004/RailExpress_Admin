import axios from 'axios';

// This file is only used for admin auth/signup flows.
const API_BASE_URL = 'https://railexpress-admin.onrender.com/api/admin';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
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
    bookingType: 'tatkal' | 'reservation';
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
