// job_find_services.js
import axiosInstance from '../backend_connection';

export const fetchAllJobs = async (filters, searchTerm) => {
  try {
    const response = await axiosInstance.get('/jobs/', {
      params: {
        ...filters,
        search: searchTerm
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const submitJobApplication = async (jobId, formData) => {
  try {
    const response = await axiosInstance.post(`/jobs/${jobId}/apply/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};