import api from './api';

export const profileService = {
  getProfileById: async (userId) => {
    const response = await api.get(`/profile/user/${userId}`); 
    return response.data; 
  },

  updateProfile: async (profileId, profileData) => {
    // Regular JSON update for profile data
    const response = await api.put(`/profile/${profileId}`, profileData);
    return response.data;
  },

  updateProfileAvatar: async (profileId, avatarFile) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    const response = await api.put(`/profile/${profileId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
};