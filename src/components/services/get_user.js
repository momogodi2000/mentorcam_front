import axiosInstance from './backend_connection';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const getUser = async () => {
    try {
        const response = await axiosInstance.get('/current-user/');
        const profilePicture = response.data.profile_picture;
        return {
            ...response.data,
            profile_picture: profilePicture
                ? `${API_BASE_URL}${profilePicture}`  // Use the full URL from the backend
                : null,
            full_name: response.data.full_name,
            email: response.data.email,
            phone_number: response.data.phone_number,
            location: response.data.location,
            user_type: response.data.user_type
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};