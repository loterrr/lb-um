import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Your NestJS Server
});

// Automatic Interceptor: Attaches Token if it exists
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;