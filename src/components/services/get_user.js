// services/getUser.js
import axiosInstance from './backend_connection'; // Import your axios instance

/**
 * Fetch the current user's data from the backend
 * @returns {Promise} Response with user data
 */
export const getUser = async () => {
    try {
        console.log('Fetching current user...'); // Debugging log
        const response = await axiosInstance.get('/current-user/');
        console.log('Fetched user data:', response.data); // Debugging log
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error); // Debugging log
        throw error;
    }
};