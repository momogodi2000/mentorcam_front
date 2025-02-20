import axiosInstance from '../backend_connection';

class SessionsService {
    // Fetch all courses for the current user based on their role
    async getCourses() {
        try {
            const response = await axiosInstance.get('/courses-access/');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get specific course content
    async getCourseContent(courseId) {
        try {
            const response = await axiosInstance.get(`/course-content/${courseId}/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Create new course (for professional users)
    async createCourse(courseData) {
        try {
            const formData = new FormData();
            
            // Append all course data to FormData
            Object.keys(courseData).forEach(key => {
                if (courseData[key] !== null && courseData[key] !== undefined) {
                    if (key === 'course_image' || key === 'pdf_note' || key === 'video') {
                        if (courseData[key] instanceof File) {
                            formData.append(key, courseData[key]);
                        }
                    } else {
                        formData.append(key, courseData[key]);
                    }
                }
            });

            const response = await axiosInstance.post('/courses-access/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Update existing course
    async updateCourse(courseId, courseData) {
        try {
            const formData = new FormData();
            
            Object.keys(courseData).forEach(key => {
                if (courseData[key] !== null && courseData[key] !== undefined) {
                    if (key === 'course_image' || key === 'pdf_note' || key === 'video') {
                        if (courseData[key] instanceof File) {
                            formData.append(key, courseData[key]);
                        }
                    } else {
                        formData.append(key, courseData[key]);
                    }
                }
            });

            const response = await axiosInstance.patch(`/courses-access/${courseId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Delete course
    async deleteCourse(courseId) {
        try {
            await axiosInstance.delete(`/courses-access/${courseId}/`);
            return true;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Error handler
    handleError(error) {
        if (error.response) {
            // Server responded with error
            const errorMessage = error.response.data.message || 
                               error.response.data.error || 
                               'An error occurred while processing your request';
            return {
                message: errorMessage,
                status: error.response.status
            };
        }
        // Network error or other issues
        return {
            message: 'Unable to connect to the server',
            status: 500
        };
    }

    // Add to SessionsService class:
async rateCourse(courseId, rating) {
    try {
        const response = await axiosInstance.post(`/course-rating/${courseId}/`, { rating });
        return response.data;
    } catch (error) {
        throw this.handleError(error);
    }
}

async attendCourse(courseId) {
    try {
        const response = await axiosInstance.post(`/course-attendance/${courseId}/`);
        return response.data;
    } catch (error) {
        throw this.handleError(error);
    }
}

async getQuickExam(courseId) {
    const response = await axiosInstance.get(`/quick-exams/${courseId}/`);
    return response.data;
  }
}

export const sessionsService = new SessionsService();