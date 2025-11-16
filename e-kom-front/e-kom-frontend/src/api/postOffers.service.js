import api from './api.js';

export const postOffersService = {
  createOffer: async (postId, amount) => {
    try {
      const response = await api.post('/post-offers', { post_id: postId, amount });
      return response.data;
    } catch (error) {
      console.error('Error creating post offer:', error);
      throw error;
    }
  },

  getOffersByPost: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/offers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching offers for post:', error);
      throw error;
    }
  },

  getFeaturedOffers: async () => {
    try {
      const response = await api.get('/post-offers/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured offers:', error);
      throw error;
    }
  }
  ,

  // Dev helper: request backend to create seed offers
  seedOffers: async () => {
    try {
      const response = await api.post('/dev/seed-offers');
      return response.data;
    } catch (error) {
      console.error('Error seeding offers:', error);
      throw error;
    }
  }
  ,

  // Owner applies percent discount to their post
  applyOwnerOffer: async (postId, percent) => {
    try {
      const response = await api.put(`/posts/${postId}/apply-offer`, { percent });
      return response.data;
    } catch (error) {
      console.error('Error applying owner offer:', error);
      throw error;
    }
  },

  // Owner removes discount from their post
  removeOwnerOffer: async (postId) => {
    try {
      const response = await api.delete(`/posts/${postId}/remove-offer`);
      return response.data;
    } catch (error) {
      console.error('Error removing owner offer:', error);
      throw error;
    }
  }
};

export default postOffersService;
