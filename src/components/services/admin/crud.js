import api from '../backend_connection';

export const UserService = {
    // Get all users with optional search, user_type, and account_status filters
    getUsers: async (searchTerm = '', userType = '', accountStatus = '') => {
        try {
            let url = '/users/';
            const params = [];
            
            if (searchTerm) params.push(`search=${searchTerm}`);
            if (userType) params.push(`user_type=${userType}`);
            if (accountStatus) params.push(`account_status=${accountStatus}`);
            
            if (params.length > 0) {
                url += `?${params.join('&')}`;
            }
            
            const response = await api.get(url);
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
    },
    
    // Toggle account status (activated/blocked)
    toggleAccountStatus: async (id) => {
        try {
            const response = await api.patch(`/users/${id}/toggle_account_status/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    // Get professional user details
    getProfessionalDetails: async (id) => {
        try {
            const response = await api.get(`/users/${id}/get_professional_details/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    // Verify professional payments
    verifyProfessionalPayments: async () => {
        try {
            const response = await api.get('/users/verify_professional_payments/');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};