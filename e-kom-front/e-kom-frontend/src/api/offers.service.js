import api from './api.js';

export const offersService = {
  getAllOffers: async () => {
    try {
      const response = await api.get('/offer');
      return response.data;
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  },

  getOfferById: async (id) => {
    try {
      const response = await api.get(`/offer/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching offer:', error);
      throw error;
    }
  },

  createOffer: async (name, description) => {
    try {
      const response = await api.post('/offer', { name, description });
      return response.data;
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  },

  updateOffer: async (id, name, description) => {
    try {
      const response = await api.put(`/offer/${id}`, { name, description });
      return response.data;
    } catch (error) {
      console.error('Error updating offer:', error);
      throw error;
    }
  },

  deleteOffer: async (id) => {
    try {
      const response = await api.delete(`/offer/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting offer:', error);
      throw error;
    }
  },
};

export default offersService;
