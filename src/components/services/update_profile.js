// services/updateUser.js
import axiosInstance from './backend_connection'; // Import your axios instance

/**
 * Update the current user's data
 * @param {Object} formData - The updated user data
 * @returns {Promise} Response with updated user data
 */
export const updateUser = async (formData) => {
    try {
        console.log('Updating user data...'); // Debugging log
        const response = await axiosInstance.put('/update-user/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Required for file uploads
            },
        });
        console.log('Updated user data:', response.data); // Debugging log
        return response.data;
    } catch (error) {
        console.error('Error updating user data:', error); // Debugging log
        throw error;
    }
};