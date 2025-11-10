import api from './api.js';

export const entitiesService = {
  // CATEGORIES CRUD
  getAllCategories: async () => {
    const response = await api.get('/category');
    return response.data;
  },
  
  createCategory: async (data) => {
    const response = await api.post('/category', data);
    return response.data;
  },
  
  deleteCategory: async (id) => {
    const response = await api.delete(`/category/${id}`);
    return response.data;
  },

  // MARKETS CRUD
  getAllMarkets: async () => {
    const response = await api.get('/markets'); 
    return response.data; 
  },
  
  createMarket: async (data) => {
    const response = await api.post('/markets', data);
    return response.data;
  },
  
  deleteMarket: async (id) => {
    const response = await api.delete(`/markets/${id}`);
    return response.data;
  },
};