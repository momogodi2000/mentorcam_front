import backend_connection from '../backend_connection';

export const eventRegistrationService = {
  // Get all events
  getEvents: async () => {
    try {
      const response = await backend_connection.get('/events/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get event attendees with user details
  getEventAttendees: async (eventId) => {
    try {
      const response = await backend_connection.get(`/events/${eventId}/attendees/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user details
  getUserDetails: async (userId) => {
    try {
      const response = await backend_connection.get(`/users/${userId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update attendee status
  updateAttendeeStatus: async (eventId, userId, status) => {
    try {
      const response = await backend_connection.patch(`/events/${eventId}/update_attendee_status/`, {
        user_id: userId,
        status: status
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Send confirmation message
  sendEventConfirmation: async (eventId, userId, message) => {
    try {
      const response = await backend_connection.post(`/events/${eventId}/send_confirmation/`, {
        user_id: userId,
        message: message
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default eventRegistrationService;