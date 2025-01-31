import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Replace with your Django backend URL

const getProfessionalProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const saveProfessionalProfile = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/profile/`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const updateProfessionalProfile = async (formData) => {
  try {
    const response = await axios.put(`${API_URL}/profile/`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'multipart/form-data',  // Required for file uploads
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export { getProfessionalProfile, saveProfessionalProfile, updateProfessionalProfile };