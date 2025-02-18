import axiosInstance from '../backend_connection';

class CourseSessionService {
    // Get all accessible sessions based on filters
    async getSessions(filters = {}) {
        try {
            const params = new URLSearchParams();
            
            if (filters.type !== 'all') params.append('type', filters.type);
            if (filters.field !== 'all') params.append('field', filters.field);
            if (filters.status !== 'all') params.append('status', filters.status);
            if (filters.date !== 'all') params.append('date_range', filters.date);
            
            const response = await axiosInstance.get(`/courses-access/?${params.toString()}`);
            return this.transformSessionsData(response.data);
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Get session details by ID
    async getSessionById(sessionId) {
        try {
            const response = await axiosInstance.get(`/courses-access/${sessionId}/`);
            return this.transformSessionData(response.data);
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Get session content (materials, video, etc.)
    async getSessionContent(sessionId) {
        try {
            const response = await axiosInstance.get(`/courses-access/${sessionId}/content/`);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Create new session (for professionals only)
    async createSession(sessionData) {
        try {
            const response = await axiosInstance.post('/courses-access/', sessionData);
            return this.transformSessionData(response.data);
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Update session (for owners only)
    async updateSession(sessionId, updateData) {
        try {
            const response = await axiosInstance.put(`/courses-access/${sessionId}/`, updateData);
            return this.transformSessionData(response.data);
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Delete session (for owners only)
    async deleteSession(sessionId) {
        try {
            await axiosInstance.delete(`/courses-access/${sessionId}/`);
            return true;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Transform backend data to match frontend structure
    transformSessionsData(data) {
        return {
            upcoming: data.filter(session => new Date(session.date) >= new Date()).map(this.transformSessionData),
            past: data.filter(session => new Date(session.date) < new Date()).map(this.transformSessionData)
        };
    }

    transformSessionData(session) {
        return {
            id: session.id,
            mentorName: session.mentor_name,
            title: session.title,
            date: session.date,
            time: this.extractTimeFromDate(session.date),
            duration: `${session.duration}h`,
            type: session.mode === 'online' ? 'video' : 'in-person',
            status: this.determineSessionStatus(session),
            location: session.mode === 'online' ? 'Online' : session.location,
            field: session.domain,
            rating: session.rating || 0,
            price: session.price ? `${session.price} XAF` : 'Free',
            description: session.description,
            materials: this.extractMaterials(session),
            prerequisites: session.prerequisites,
            hasAccess: session.has_access
        };
    }

    extractTimeFromDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        });
    }

    determineSessionStatus(session) {
        if (session.completed) return 'completed';
        if (session.has_access) return 'confirmed';
        return 'pending';
    }

    extractMaterials(session) {
        const materials = [];
        if (session.pdf_note) materials.push('PDF Notes');
        if (session.video) materials.push('Video Recording');
        return materials;
    }

    handleError(error) {
        if (error.response?.status === 403) {
            throw new Error('You do not have permission to access this resource. Please book a session with the mentor first.');
        }
        if (error.response?.status === 404) {
            throw new Error('Session not found.');
        }
        throw new Error(error.response?.data?.message || 'An error occurred while processing your request.');
    }
}

export default new CourseSessionService();