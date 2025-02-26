import axiosInstance from '../backend_connection';

// Service for fetching and managing event data
const EventService = {
  // Get all events with analytics for admin dashboard
  getAdminEvents: async () => {
    try {
      const response = await axiosInstance.get('/admin/events/');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin events:', error);
      // Return fallback data structure when API fails
      return {
        events: [],
        statistics: {
          total_events: 0,
          upcoming_events: 0,
          ongoing_events: 0,
          ended_events: 0,
          avg_attendees: 0,
          recent_events: 0,
          predicted_attendees_next_month: 0,
        },
        analysis: {
          popular_tags: [],
        }
      };
    }
  },
  
  // Get basic event list when analytics fail
  getEvents: async () => {
    try {
      const response = await axiosInstance.get('/events/');
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },
  
  // Create a new event
  createEvent: async (eventData) => {
    try {
      const response = await axiosInstance.post('/admin/events/', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },
  
  // Update an existing event
  updateEvent: async (eventId, eventData) => {
    try {
      const response = await axiosInstance.put(`/admin/events/${eventId}/`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },
  
  // Delete an event
  deleteEvent: async (eventId) => {
    try {
      const response = await axiosInstance.delete(`/admin/events/${eventId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
};

export default EventService;