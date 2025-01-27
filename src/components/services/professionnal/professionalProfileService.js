import axiosInstance from '../backend_connection'; // Use the axiosInstance from backend_connection

const API_URL = 'http://127.0.0.1:8000/api';

// Get the current user's professional profile
export const getProfessionalProfile = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/professional-profile/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching professional profile:', error);
    throw error;
  }
};

// Create or update the professional profile
export const saveProfessionalProfile = async (profileData) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/professional-profile/`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error saving professional profile:', error);
    throw error;
  }
};

// Update the professional profile
export const updateProfessionalProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/professional-profile/`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating professional profile:', error);
    throw error;
  }
};