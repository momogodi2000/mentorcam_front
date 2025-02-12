import axiosInstance from '../backend_connection';

class EventsService {
    static async getAllEvents(filters = {}) {
        const params = new URLSearchParams(filters);
        return axiosInstance.get(`/events/?${params.toString()}`);
    }

    static async getEventStats() {
        return axiosInstance.get('/events/stats/');
    }

    static async getEventById(id) {
        return axiosInstance.get(`/events/${id}/`);
    }

    static async createEvent(eventData) {
        const formData = new FormData();
        
        // Convert date to ISO string format
        if (eventData.date) {
            formData.append('date', new Date(eventData.date).toISOString());
        }

        // Handle registration_deadline
        if (eventData.registration_deadline) {
            formData.append('registration_deadline', new Date(eventData.registration_deadline).toISOString());
        }

        // Convert boolean values to strings
        formData.append('is_virtual', eventData.is_virtual ? 'true' : 'false');
        formData.append('is_featured', eventData.is_featured ? 'true' : 'false');

        // Handle image
        if (eventData.image instanceof File) {
            formData.append('image', eventData.image);
        }

        // Handle basic fields
        formData.append('title', eventData.title);
        formData.append('description', eventData.description);
        formData.append('status', eventData.status);
        formData.append('location', eventData.location);
        formData.append('attendees_count', eventData.attendees_count || 0);
        formData.append('max_attendees', eventData.max_attendees || 100); // Add default max attendees

        // Handle tags as a JSON string
        if (eventData.tags && Array.isArray(eventData.tags)) {
            formData.append('tag_ids', JSON.stringify(eventData.tags.map(tag => 
                typeof tag === 'string' ? { name: tag } : tag
            )));
        }

        return axiosInstance.post('/events/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }


    static async updateEvent(id, eventData) {
        const formData = new FormData();
        
        if (eventData.image instanceof File) {
            formData.append('image', eventData.image);
        }

        if (eventData.tags && Array.isArray(eventData.tags)) {
            formData.append('tag_ids', JSON.stringify(eventData.tags));
        }

        Object.keys(eventData).forEach(key => {
            if (key !== 'image' && key !== 'tags') {
                formData.append(key, eventData[key]);
            }
        });

        return axiosInstance.patch(`/events/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    static async deleteEvent(id) {
        return axiosInstance.delete(`/events/${id}/`);
    }

    static async registerForEvent(eventId) {
        return axiosInstance.post(`/events/${eventId}/register/`);
    }

    static async addTagToEvent(eventId, tagName) {
        return axiosInstance.post(`/events/${eventId}/add_tag/`, { name: tagName });
    }

    // Filter methods
    static async getUpcomingEvents() {
        return this.getAllEvents({ status: 'upcoming' });
    }

    static async getOngoingEvents() {
        return this.getAllEvents({ status: 'ongoing' });
    }

    static async getVirtualEvents() {
        return this.getAllEvents({ is_virtual: true });
    }

    static async getFeaturedEvents() {
        return this.getAllEvents({ is_featured: true });
    }

    // Search method
    static async searchEvents(query) {
        return this.getAllEvents({ search: query });
    }

    // Attendee management
    static async getEventAttendees(eventId) {
        return axiosInstance.get(`/events/${eventId}/attendees/`);
    }

    static async updateAttendeeStatus(eventId, userId, status) {
        return axiosInstance.patch(`/events/${eventId}/attendees/${userId}/`, {
            attendance_status: status
        });
    }
}

export default EventsService;