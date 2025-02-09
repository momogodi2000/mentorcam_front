import axiosInstance from '../backend_connection';

class FindMentorServices {
  static async searchMentors(searchParams) {
    try {
      const queryString = new URLSearchParams({
        domain: searchParams.domain || '',
        searchQuery: searchParams.searchQuery || ''
      }).toString();
      
      const response = await axiosInstance.get(`/mentors/search/?${queryString}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error searching mentors');
    }
  }

  static async getMentorProfile(mentorId) {
    try {
      const response = await axiosInstance.get(`/professional-profile/${mentorId}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching mentor profile');
    }
  }

  static async getMentorRatings(mentorId) {
    try {
      const response = await axiosInstance.get(`/ratings/`, {
        params: { professional: mentorId }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching ratings');
    }
  }

  static async getPdfDocument(url) {
    try {
      const response = await axiosInstance.get(url, {
        responseType: 'blob'
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      throw new Error('Error fetching PDF document');
    }
  }

  static async submitBooking(bookingData) {
    try {
      const response = await axiosInstance.post('/bookings/', bookingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error submitting booking');
    }
  }

  static async simulatePayment(paymentData) {
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              success: true,
              transactionId: Math.random().toString(36).substring(7),
              message: 'Payment processed successfully'
            }
          });
        }, 2000);
      });
      return response.data;
    } catch (error) {
      throw new Error('Payment processing failed');
    }
  }
}

export default FindMentorServices;