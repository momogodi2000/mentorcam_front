import axiosInstance from '../backend_connection';

const PROFILE_URL = '/professional-profile/';

export const professionalProfileService = {
  // Create profile
  createProfile: async (profileData) => {
    try {
      console.log('Sending profile data:', profileData); // Log the payload
      const response = await axiosInstance.post('/professional-profile/', profileData);
      return response.data;
    } catch (error) {
      console.error('Profile creation error:', error.response?.data);
      throw {
        message: error.response?.data?.detail || 'Failed to create profile',
        errors: error.response?.data?.errors,
      };
    }
  },

  // Get current user's professional profile
  getProfile: async () => {
    try {
      const response = await axiosInstance.get(PROFILE_URL);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // Return null if profile not found
      }
      throw error.response?.data || error.message;
    }
  },

  // Upload files to professional profile
  uploadFiles: async (profileId, formData) => {
    try {
      const response = await axiosInstance.post(
        `/professional-profile/${profileId}/upload/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('File upload error:', error.response?.data);
      throw {
        message: error.response?.data?.detail || 'Failed to upload files',
        errors: error.response?.data?.errors,
      };
    }
  },

  // Activate professional profile with payment
// Activate professional profile with payment
activateProfile: async (activationData) => {
  try {
    // Only send the specific data needed for activation
    const payload = {
      profile_id: activationData.profile_id,
      phone_number: activationData.phone_number
    };
    
    // Make sure the endpoint is correct - it might need to be a different path
    const response = await axiosInstance.post(`${PROFILE_URL}activate/`, payload);
    return {
      status: response.data.status,
      profile: response.data.profile,
      payment: response.data.payment,
      receipt_url: response.data.receipt_url
    };
  } catch (error) {
    console.error('Profile activation error:', error.response?.data);
    throw {
      message: error.response?.data?.error || error.response?.data?.detail || 'Failed to activate profile',
      details: error.response?.data?.details || '',
      errors: error.response?.data?.errors
    };
  }
},

  // Download payment receipt
  downloadReceipt: async (profileId) => {
    try {
      // Using axios instance to get the file with proper auth headers
      const response = await axiosInstance.get(`/professional-profile/${profileId}/receipt/`, {
        responseType: 'blob', // Important for handling file downloads
      });
      
      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'profile_activation_receipt.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    } catch (error) {
      console.error('Receipt download error:', error.response?.data);
      throw {
        message: error.response?.data?.error || 'Failed to download receipt',
      };
    }
  },

  // Update professional profile
  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put(PROFILE_URL, profileData);
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error.response?.data);
      throw {
        message: error.response?.data?.detail || 'Failed to update profile',
        errors: error.response?.data?.errors,
      };
    }
  },

  // Get receipt URL
  getReceiptUrl: (profileId) => {
    return `${axiosInstance.defaults.baseURL}/professional-profile/${profileId}/receipt/`;
  },
  
};