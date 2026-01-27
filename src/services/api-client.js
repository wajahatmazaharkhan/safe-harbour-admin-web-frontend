import axios from "axios";

// Vite uses import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Attach token if your admin panel requires auth
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
// });

export default api;
