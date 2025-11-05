import api from './api.js';

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/logout');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error.response?.data || error.message);
      throw error;
    }
  }
};