import axiosInstance from './backend_connection';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const getUser = async () => {
    try {
        const response = await axiosInstance.get('/current-user/');
        const profilePicture = response.data.profile_picture;
        
        // Check if profile picture exists before constructing the URL
        const fullProfilePicUrl = profilePicture
            ? `${API_BASE_URL}${profilePicture}`
            : null;
            
        // Test if the image is accessible by preloading it
        let validProfilePic = fullProfilePicUrl;
        if (fullProfilePicUrl) {
            try {
                // Create a new image object to test loading
                const img = new Image();
                img.src = fullProfilePicUrl;
                
                // Set a short timeout to check if image loads
                await new Promise((resolve, reject) => {
                    img.onload = () => resolve(true);
                    img.onerror = () => reject(false);
                    // Timeout after 3 seconds
                    setTimeout(() => reject(false), 3000);
                });
            } catch (err) {
                console.warn('Profile image not accessible:', fullProfilePicUrl);
                validProfilePic = null;
            }
        }
        
        return {
            ...response.data,
            profile_picture: validProfilePic,
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