// services/booking.service.js
import axiosInstance from '../backend_connection';

class BookingService {
  static async submitBooking(bookingData) {
    try {
      const response = await axiosInstance.post('/bookings/', {
        mentorId: bookingData.mentorId,
        mentorName: bookingData.mentorName,
        studentName: bookingData.studentName,
        studentEmail: bookingData.studentEmail,
        phoneNumber: bookingData.phoneNumber,
        amount: bookingData.amount,
        planType: bookingData.planType,
        domain: bookingData.domain,
        subdomains: bookingData.subdomains
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error submitting booking');
    }
  }

  static async downloadReceipt(bookingId) {
    try {
      const response = await axiosInstance.get(`/bookings/${bookingId}/download_receipt/`);
      return response.data;
    } catch (error) {
      throw new Error('Error downloading receipt');
    }
  }

  static async updateMentorSlots(mentorId, newSlotCount) {
    try {
      const response = await axiosInstance.patch(`/mentors/${mentorId}/slots/`, {
        available_slots: newSlotCount
      });
      return response.data;
    } catch (error) {
      throw new Error('Error updating mentor slots');
    }
  }
  static async checkActiveBooking(mentorId) {
    try {
      const response = await axiosInstance.get(`/bookings/check-active/${mentorId}/`);
      return response.data;
    } catch (error) {
      throw new Error('Error checking active booking');
    }
  }


}

export default BookingService;