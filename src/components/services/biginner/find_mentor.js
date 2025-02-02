import axiosInstance from '../backend_connection';

// services/biginner/find_mentor.js
class FindMentorServices {
    // Search mentors by domain or subdomain
    static async searchMentors(searchParams) {
      try {
        // Construct query parameters
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
  
    // Get mentor ratings
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
  
    // Submit a booking request
    static async submitBooking(bookingData) {
      try {
        const response = await axiosInstance.post('/bookings/', bookingData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Error submitting booking');
      }
    }
  
    // Simulate payment
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