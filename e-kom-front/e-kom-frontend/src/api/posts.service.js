import api from './api';

export const postsService = {
  getAllPosts: async () => {
    const response = await api.get('/post');
    return response.data;
  },

  getPostById: async (postId) => {
    const response = await api.get(`/post/${postId}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/post', postData);
    return response.data;
  },

  updatePost: async (postId, updatedData) => {
    const response = await api.put(`/post/${postId}`, updatedData);
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/post/${postId}`);
    return response.data;
  },

  ratePost: async (postId, score) => {
    const response = await api.post('/rating/rate', { postId, score });
    return response.data;
  },

  getAverageRating: async (postId) => {
    const response = await api.get(`/rating/post/${postId}/average`);
    return response.data.average;
  },

  createReport: async (postId, reason) => {
    const response = await api.post('/report', { postId, reason });
    return response.data;
  }
};