import api from './api.js';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  // Obtiene el perfil real del usuario autenticado
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  }
};