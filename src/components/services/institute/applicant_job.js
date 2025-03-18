import axiosInstance from '../backend_connection';

export const JobApplicantsService = {
    // Fetch all job applications
    getAllApplications: async () => {
        try {
            const response = await axiosInstance.get('/jobs/applications/');
            return response.data;
        } catch (error) {
            console.error('Error fetching applications:', error);
            throw error;
        }
    },

    // Send email to applicant
    sendEmailToApplicant: async (jobId, email, subject, message) => {
        try {
            const response = await axiosInstance.post(`/jobs/${jobId}/send_email/`, {
                email,
                subject,
                message
            });
            return response.data;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    },

    // Update application status
    updateApplicationStatus: async (jobId, applicationId, status) => {
        try {
            const response = await axiosInstance.patch(`/jobs/${jobId}/update_application/`, {
                application_id: applicationId, // Ensure this matches the backend's expected field
                status // Ensure this matches the backend's expected field
            });
            return response.data;
        } catch (error) {
            console.error('Error updating application status:', error);
            throw error;
        }
    }
};