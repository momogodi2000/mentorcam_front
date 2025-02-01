// src/services/professionalProfileService.js
import axiosInstance from '../backend_connection';

const PROFILE_URL = '/professional-profile/';

export const professionalProfileService = {
  createProfile: async (profileData) => {
    try {
      const response = await axiosInstance.post('/professional-profile/', profileData);
      return response.data;
    } catch (error) {
      console.error('Profile creation error:', error.response?.data);
      throw {
        message: error.response?.data?.detail || 'Failed to create profile',
        errors: error.response?.data?.errors
      };
    }
  },

  // Get current user's professional profile
  getProfile: async () => {
    try {
      const response = await axiosInstance.get(PROFILE_URL);
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update professional profile
  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put(`${PROFILE_URL}${profileData.id}/`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

   // Upload files separately
   uploadFiles: async (formData) => {
    try {
      const response = await axiosInstance.post('/professional-profile/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('File upload error:', error.response?.data);
      throw {
        message: error.response?.data?.detail || 'Failed to upload files',
        errors: error.response?.data?.errors
      };
    }
  },
};
