import api from '../backend_connection';

export const UserService = {
    // Get all users with optional search
    getUsers: async (searchTerm = '') => {
        try {
            const response = await api.get(`/users/${searchTerm ? `?search=${searchTerm}` : ''}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single user
    getUser: async (id) => {
        try {
            const response = await api.get(`/users/${id}/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new user
    createUser: async (userData) => {
        try {
            const response = await api.post('/users/', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update user
    updateUser: async (id, userData) => {
        try {
            const response = await api.put(`/users/${id}/`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete user
    deleteUser: async (id) => {
        try {
            await api.delete(`/users/${id}/`);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Toggle user active status
    toggleUserActive: async (id) => {
        try {
            const response = await api.patch(`/users/${id}/toggle_active/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};