import api from './api';

export const profileService = {
  getProfileById: async (userId) => {
    const response = await api.get(`/profile/${userId}`); 
    return response.data; 
  },

  updateProfile: async (profileId, profileData) => {
    const response = await api.put(`/profile/${profileId}`, profileData);
    return response.data;
  },
};