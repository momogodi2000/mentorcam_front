import axiosInstance from '../backend_connection';

const fetchAmateurProgress = async () => {
    try {
        const response = await axiosInstance.get('/amateur-progress/');
        return response.data;
    } catch (error) {
        console.error('Error fetching amateur progress:', error);
        throw error;
    }
};

export { fetchAmateurProgress };