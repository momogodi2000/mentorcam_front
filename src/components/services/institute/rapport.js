import axiosInstance from '../backend_connection';

/**
 * Fetch institution statistics from the backend
 * 
 * @returns {Promise<Object>} The statistics data including jobs, events, and related metrics
 */
export const fetchInstitutionStatistics = async () => {
  try {
    const response = await axiosInstance.get('/institution/statistics/');
    return response.data;
  } catch (error) {
    console.error('Error fetching institution statistics:', error);
    
    // Check for specific error types and handle accordingly
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error data:', error.response.data);
      console.error('Response error status:', error.response.status);
      
      if (error.response.status === 403) {
        throw new Error('You do not have permission to access institution statistics. Please ensure you are logged in as an institution user.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    }
    
    // Generic error for all other cases
    throw new Error('Failed to fetch institution statistics. Please try again later.');
  }
};

/**
 * Transform job data for better usability in the frontend
 * 
 * @param {Array} jobs - Raw job data from the API
 * @returns {Array} - Transformed job data
 */
export const transformJobData = (jobs) => {
  return jobs.map(job => ({
    ...job,
    // Add derived properties or transform existing ones
    applicationCount: job.applications ? job.applications.length : 0,
    activeStatus: job.is_active ? 'Active' : 'Inactive',
    // Add more transformations as needed
  }));
};

/**
 * Transform event data for better usability in the frontend
 * 
 * @param {Array} events - Raw event data from the API
 * @returns {Array} - Transformed event data
 */
export const transformEventData = (events) => {
  return events.map(event => ({
    ...event,
    // Add derived properties or transform existing ones
    attendeeCount: event.attendees ? event.attendees.length : 0,
    formattedDate: event.date ? new Date(event.date).toLocaleDateString() : 'TBD',
    // Add more transformations as needed
  }));
};

/**
 * Calculate trend percentages based on current and previous period data
 * 
 * @param {number} current - Current period value
 * @param {number} previous - Previous period value
 * @returns {string} - Formatted percentage with + or - prefix
 */
export const calculateTrend = (current, previous) => {
  if (previous === 0) return '+0.0%';
  
  const percentChange = ((current - previous) / previous) * 100;
  return (percentChange >= 0 ? '+' : '') + percentChange.toFixed(1) + '%';
};