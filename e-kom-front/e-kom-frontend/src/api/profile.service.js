// src/api/profile.service.js
import api from './api';

export const profileService = {

  // Obtener MI perfil (el usuario logueado)
  getMyProfile: async () => {
    // Use authenticated /me endpoint so we don't depend on localStorage
    const response = await api.get('/me');
    return response.data;
  },

  getProfileById: async (userId) => {
    const response = await api.get(`/profile/user/${userId}`);
    return response.data;
  },

  updateProfile: async (profileId, profileData) => {
    const response = await api.put(`/profile/${profileId}`, profileData);
    return response.data;
  },

  updateProfileAvatar: async (profileId, avatarFile) => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const response = await api.put(`/profile/${profileId}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    return response.data;
  },

};
