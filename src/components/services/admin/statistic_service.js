import axiosInstance from '../backend_connection';

const AdminStatisticsService = {
  /**
   * Fetch all admin statistics from the API
   * @returns {Promise} Promise that resolves to statistics data
   */
  getStatistics: async () => {
    try {
      const response = await axiosInstance.get('/admin/statistics/');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin statistics:', error);
      throw error;
    }
  },
  
  /**
   * Downloads statistics data as CSV
   * @param {Object} data - The statistics data to convert
   * @returns {void} - Triggers a download
   */
  downloadStatisticsCSV: (data) => {
    // Flatten the nested data structure
    const flattenedData = {
      // User Statistics
      'Total Users': data.total_users,
      'Amateur Users': data.amateur_users,
      'Professional Users': data.professional_users,
      'Institution Users': data.institution_users,
      'Admin Users': data.admin_users,
      'New Users (Last 30 Days)': data.new_users_last_month,
      
      // Booking Statistics
      'Total Bookings': data.total_bookings,
      'Pending Bookings': data.pending_bookings,
      'Confirmed Bookings': data.confirmed_bookings,
      'Completed Bookings': data.completed_bookings,
      'Cancelled Bookings': data.cancelled_bookings,
      'Total Booking Value': data.total_booking_value,
      'Average Booking Value': data.avg_booking_value,
      
      // Rest of the statistics...
    };
    
    // Convert to CSV format
    const csvContent = 
      'Data,Value\n' + 
      Object.entries(flattenedData)
        .map(([key, value]) => `"${key}","${value}"`)
        .join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'admin_statistics.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default AdminStatisticsService;