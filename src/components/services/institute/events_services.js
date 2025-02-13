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
        // Create a new FormData instance
        const formData = new FormData();
        
        try {
            // Required fields - ensure they exist
            if (!eventData.title || !eventData.description || !eventData.status || !eventData.location || !eventData.date) {
                throw new Error('Missing required fields');
            }

            // Basic fields
            formData.append('title', eventData.title);
            formData.append('description', eventData.description);
            formData.append('status', eventData.status);
            formData.append('location', eventData.location);

            // Date fields
            const formattedDate = new Date(eventData.date).toISOString();
            formData.append('date', formattedDate);

            if (eventData.registration_deadline) {
                const formattedDeadline = new Date(eventData.registration_deadline).toISOString();
                formData.append('registration_deadline', formattedDeadline);
            }

            // Numeric fields - ensure they're sent as strings
            formData.append('attendees_count', String(eventData.attendees_count || 0));
            formData.append('max_attendees', String(eventData.max_attendees || 0));

            // Boolean fields - convert to string 'true' or 'false'
            formData.append('is_virtual', eventData.is_virtual ? 'true' : 'false');
            formData.append('is_featured', eventData.is_featured ? 'true' : 'false');

            // Image field - only append if it exists
            if (eventData.image instanceof File) {
                formData.append('image', eventData.image);
            }

            // Tags - convert to tag_ids array
            if (Array.isArray(eventData.tags) && eventData.tags.length > 0) {
                formData.append('tag_ids', JSON.stringify(eventData.tags));
            }

            // Log the FormData entries for debugging
            for (let pair of formData.entries()) {
                console.log('FormData entry:', pair[0], pair[1]);
            }

            const response = await axiosInstance.post('/events/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            return response;
        } catch (error) {
            console.error('Error details:', error.response?.data);
            throw error;
        }
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