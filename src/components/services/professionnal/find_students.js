import axiosInstance from '../backend_connection';

class BookingService {
  // Get all bookings for the professional user
  async getBookings() {
    try {
      const response = await axiosInstance.get('/bookings/');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  // Check if student has active booking with a mentor
  async checkActiveBooking(mentorId) {
    try {
      const response = await axiosInstance.get(`/bookings/check-active/${mentorId}/`);
      return response.data;
    } catch (error) {
      console.error('Error checking active booking:', error);
      throw error;
    }
  }

  // Create a new booking
  async createBooking(bookingData) {
    try {
      const response = await axiosInstance.post('/bookings/', {
        mentorId: bookingData.mentorId,
        studentName: bookingData.studentName,
        studentEmail: bookingData.studentEmail,
        mentorName: bookingData.mentorName,
        phoneNumber: bookingData.phoneNumber,
        amount: bookingData.amount,
        planType: bookingData.planType,
        domain: bookingData.domain,
        subdomains: bookingData.subdomains
      });
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    try {
      const response = await axiosInstance.patch(`/bookings/${bookingId}/`, {
        status: status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  // Get booking details by ID
  async getBookingById(bookingId) {
    try {
      const response = await axiosInstance.get(`/bookings/${bookingId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  }

  // Download booking receipt
  // Add method to download receipt in BookingService
async downloadReceipt(bookingId) {
    try {
      const response = await axiosInstance.get(`/bookings/${bookingId}/receipt/`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading receipt:', error);
      throw error;
    }
  }

  // Get booking statistics
  async getBookingStats() {
    try {
      const response = await axiosInstance.get('/bookings/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching booking statistics:', error);
      throw error;
    }
  }
}

export const bookingService = new BookingService();