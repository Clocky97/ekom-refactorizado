import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:1212/ekom'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Log breve para depuración: no imprimir token completo en producción
    console.debug('Authorization header set');
  } else {
    console.warn('No se encontró token de autenticación');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;