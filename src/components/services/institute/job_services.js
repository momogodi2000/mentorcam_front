import axiosInstance from '../backend_connection';

export const JobService = {
    // Get all jobs with optional filters
    getAllJobs: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await axiosInstance.get(`/jobs/?${queryParams}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    },

    // Get single job by ID
    getJobById: async (jobId) => {
        try {
            const response = await axiosInstance.get(`/jobs/${jobId}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching job details:', error);
            throw error;
        }
    },

    // Create new job
    createJob: async (jobData) => {
        try {
            const response = await axiosInstance.post('/jobs/', jobData);
            return response.data;
        } catch (error) {
            console.error('Error creating job:', error);
            throw error;
        }
    },

    // Update existing job
    updateJob: async (jobId, jobData) => {
        try {
            const response = await axiosInstance.put(`/jobs/${jobId}/`, jobData);
            return response.data;
        } catch (error) {
            console.error('Error updating job:', error);
            throw error;
        }
    },

    // Delete job
    deleteJob: async (jobId) => {
        try {
            await axiosInstance.delete(`/jobs/${jobId}/`);
            return true;
        } catch (error) {
            console.error('Error deleting job:', error);
            throw error;
        }
    },

    // Apply for a job
    applyForJob: async (jobId, applicationData) => {
        try {
            const response = await axiosInstance.post(`/jobs/${jobId}/apply/`, applicationData);
            return response.data;
        } catch (error) {
            console.error('Error applying for job:', error);
            throw error;
        }
    },

    // Get job applicants
    getJobApplicants: async (jobId) => {
        try {
            const response = await axiosInstance.get(`/jobs/${jobId}/applicants/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching job applicants:', error);
            throw error;
        }
    },

    // Search jobs
    searchJobs: async (searchQuery) => {
        try {
            const response = await axiosInstance.get(`/jobs/?search=${searchQuery}`);
            return response.data;
        } catch (error) {
            console.error('Error searching jobs:', error);
            throw error;
        }
    }
};

export default JobService;