// services/userService.js

import axios from 'axios'; // Ensure axios is installed (npm install axios)

// Base URL for your API
const API_BASE_URL = 'http://your-api-url.com/api'; // Replace with your actual API URL

// Function to update the professional profile
export const updateProfessionalProfile = async (profileData) => {
    try {
        // Get the authentication token from local storage or context
        const token = localStorage.getItem('authToken'); // Assuming you store the token in localStorage

        // Make a PATCH request to update the professional profile
        const response = await axios.patch(
            `${API_BASE_URL}/professionals/complete-profile/`, // Replace with your API endpoint
            profileData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the request headers
                    'Content-Type': 'application/json',
                },
            }
        );

        // Return the updated profile data
        return response.data;
    } catch (error) {
        console.error('Error updating professional profile:', error);
        throw error; // Re-throw the error to handle it in the component
    }
};