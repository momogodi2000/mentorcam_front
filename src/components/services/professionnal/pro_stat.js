import axiosInstance from '../backend_connection';

class ProfessionalDashboardService {
    /**
     * Get the main dashboard overview data
     * @returns {Promise} Promise object with dashboard data
     */
    getDashboardOverview() {
        return axiosInstance.get('/professional/dashboard/');
    }

    /**
     * Get all courses created by the professional
     * @returns {Promise} Promise object with courses data and statistics
     */
    getCourses() {
        return axiosInstance.get('/professional/courses/');
    }

    /**
     * Get details for a specific course
     * @param {number} courseId - The ID of the course to retrieve
     * @returns {Promise} Promise object with course details
     */
    getCourseById(courseId) {
        return axiosInstance.get(`/professional/courses/${courseId}/`);
    }

    /**
     * Create a new course
     * @param {Object} courseData - The course data to create
     * @returns {Promise} Promise object with created course
     */
    createCourse(courseData) {
        return axiosInstance.post('/professional/courses/', courseData);
    }

    /**
     * Update an existing course
     * @param {number} courseId - The ID of the course to update
     * @param {Object} courseData - The updated course data
     * @returns {Promise} Promise object with updated course
     */
    updateCourse(courseId, courseData) {
        return axiosInstance.put(`/professional/courses/${courseId}/`, courseData);
    }

    /**
     * Delete a course
     * @param {number} courseId - The ID of the course to delete
     * @returns {Promise} Promise object with deletion result
     */
    deleteCourse(courseId) {
        return axiosInstance.delete(`/professional/courses/${courseId}/`);
    }

    /**
     * Get all students enrolled in professional's courses
     * @returns {Promise} Promise object with students data and statistics
     */
    getStudents() {
        return axiosInstance.get('/professional/students/');
    }

    /**
     * Get student enrollment history with filter options
     * @param {Object} filters - Optional filters for student data
     * @returns {Promise} Promise object with filtered student data
     */
    getStudentEnrollments(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return axiosInstance.get(`/professional/students/?${queryParams}`);
    }

    /**
     * Get all exams created by the professional
     * @returns {Promise} Promise object with exams data and statistics
     */
    getExams() {
        return axiosInstance.get('/professional/exams/');
    }

    /**
     * Get details for a specific exam
     * @param {number} examId - The ID of the exam to retrieve
     * @returns {Promise} Promise object with exam details
     */
    getExamById(examId) {
        return axiosInstance.get(`/professional/exams/${examId}/`);
    }

    /**
     * Create a new exam
     * @param {Object} examData - The exam data to create
     * @returns {Promise} Promise object with created exam
     */
    createExam(examData) {
        // Create FormData object for file uploads
        const formData = new FormData();
        
        // Append regular fields
        Object.keys(examData).forEach(key => {
            if (key !== 'questions_pdf' && key !== 'answers_pdf') {
                formData.append(key, examData[key]);
            }
        });
        
        // Append file fields
        if (examData.questions_pdf) {
            formData.append('questions_pdf', examData.questions_pdf);
        }
        if (examData.answers_pdf) {
            formData.append('answers_pdf', examData.answers_pdf);
        }
        
        return axiosInstance.post('/professional/exams/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    /**
     * Update an existing exam
     * @param {number} examId - The ID of the exam to update
     * @param {Object} examData - The updated exam data
     * @returns {Promise} Promise object with updated exam
     */
    updateExam(examId, examData) {
        // Create FormData object for file uploads
        const formData = new FormData();
        
        // Append regular fields
        Object.keys(examData).forEach(key => {
            if (key !== 'questions_pdf' && key !== 'answers_pdf') {
                formData.append(key, examData[key]);
            }
        });
        
        // Append file fields
        if (examData.questions_pdf) {
            formData.append('questions_pdf', examData.questions_pdf);
        }
        if (examData.answers_pdf) {
            formData.append('answers_pdf', examData.answers_pdf);
        }
        
        return axiosInstance.put(`/professional/exams/${examId}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    /**
     * Get financial overview
     * @returns {Promise} Promise object with financial data and statistics
     */
    getFinances() {
        return axiosInstance.get('/professional/finances/');
    }

    /**
     * Get financial transactions with filter options
     * @param {Object} filters - Optional filters for financial data
     * @returns {Promise} Promise object with filtered financial data
     */
    getFinancialTransactions(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return axiosInstance.get(`/professional/finances/?${queryParams}`);
    }

    /**
     * Get all mentorship bookings
     * @returns {Promise} Promise object with mentorship data and statistics
     */
    getMentorships() {
        return axiosInstance.get('/professional/mentorships/');
    }

    /**
     * Update a mentorship booking status
     * @param {number} bookingId - The ID of the booking to update
     * @param {string} status - The new status ('pending', 'confirmed', 'completed', 'cancelled')
     * @returns {Promise} Promise object with updated booking
     */
    updateMentorshipStatus(bookingId, status) {
        return axiosInstance.patch(`/professional/mentorships/${bookingId}/`, { status });
    }

    /**
     * Get advanced analytics data
     * @returns {Promise} Promise object with analytics data
     */
    getAnalytics() {
        return axiosInstance.get('/professional/analytics/');
    }

    /**
     * Get analytics data with custom date range
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise} Promise object with date-filtered analytics data
     */
    getAnalyticsForDateRange(startDate, endDate) {
        return axiosInstance.get(`/professional/analytics/?start_date=${startDate}&end_date=${endDate}`);
    }

    /**
     * Export data as CSV
     * @param {string} dataType - Type of data to export ('all', 'courses', 'students', 'exams', 'mentorships', 'finances')
     * @returns {Promise} Promise object with CSV data
     */
    exportData(dataType = 'all') {
        return axiosInstance.get(`/professional/export-data/?type=csv&data=${dataType}`, {
            responseType: 'blob'
        });
    }

    /**
     * Download exported data
     * @param {Blob} blob - The blob data from exportData
     * @param {string} filename - The filename for the download
     */
    downloadExport(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    /**
     * Get course materials with filter options
     * @param {Object} filters - Optional filters for materials
     * @returns {Promise} Promise object with course materials
     */
    getCourseMaterials(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return axiosInstance.get(`/professional/courses/materials/?${queryParams}`);
    }

    /**
     * Upload a course material
     * @param {number} courseId - The ID of the course
     * @param {File} file - The file to upload
     * @param {string} type - The type of material ('pdf_note' or 'video')
     * @returns {Promise} Promise object with upload result
     */
    uploadCourseMaterial(courseId, file, type) {
        const formData = new FormData();
        formData.append('course_id', courseId);
        formData.append('file', file);
        formData.append('type', type);
        
        return axiosInstance.post('/professional/courses/materials/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    /**
     * Get registration evolution data for dashboard charts
     * @returns {Promise} Promise object with registration evolution data
     */
    getRegistrationEvolution() {
        return axiosInstance.get('/professional/analytics/registrations/');
    }

    /**
     * Get revenue breakdown data for dashboard charts
     * @returns {Promise} Promise object with revenue breakdown data
     */
    getRevenueBreakdown() {
        return axiosInstance.get('/professional/analytics/revenue/');
    }

    /**
     * Get participation rate data for dashboard charts
     * @returns {Promise} Promise object with participation rate data
     */
    getParticipationRate() {
        return axiosInstance.get('/professional/analytics/participation/');
    }
}

export default new ProfessionalDashboardService();