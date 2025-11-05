import api from './api';

export const profileService = {
  getProfileById: async (userId) => {
    const response = await api.get(`/profile/user/${userId}`); 
    return response.data; 
  },

  updateProfile: async (profileId, profileData) => {
    // If profileData is FormData (file upload), send as multipart/form-data
    if (profileData instanceof FormData) {
      const response = await api.put(`/profile/${profileId}`, profileData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }

    const response = await api.put(`/profile/${profileId}`, profileData);
    return response.data;
  },
};