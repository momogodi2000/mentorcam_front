import axiosInstance from '../backend_connection';

export const getEvents = async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axiosInstance.get(`/events/${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
};

export const registerForEvent = async (eventId) => {
    const response = await axiosInstance.post(`/events/${eventId}/register/`);
    return response.data;
};

export const getEventStats = async () => {
    const response = await axiosInstance.get('/events/stats/');
    return response.data;
};

export const searchEvents = async (searchTerm) => {
    const response = await axiosInstance.get(`/events/?search=${searchTerm}`);
    return response.data;
};

export const getEventTags = async () => {
    const response = await axiosInstance.get('/events/tags/');
    return response.data;
};