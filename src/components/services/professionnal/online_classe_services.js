import axiosInstance from '../backend_connection';

const onlineCourseServices = {
  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await axiosInstance.get('/courses/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCourse: async (courseData) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Map form fields to match Django model fields exactly
      formData.append('title', courseData.title);
      formData.append('date', courseData.date);
      formData.append('duration', courseData.duration);
      formData.append('domain', courseData.domain);
      formData.append('description', courseData.description);
      formData.append('mode', courseData.mode);

      // Handle optional fields
      if (courseData.subdomain) {
        formData.append('subdomain', courseData.subdomain);
      }

      // Handle file fields
      if (courseData.course_image) {
        formData.append('course_image', courseData.course_image);
      }

      // Only append these if mode is online
      if (courseData.mode === 'online') {
        if (courseData.pdf_note) {
          formData.append('pdf_note', courseData.pdf_note);
        }
        if (courseData.video) {
          formData.append('video', courseData.video);
        }
      }

      const response = await axiosInstance.post('/courses/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },


  // Update a course
  updateCourse: async (id, courseData) => {
    try {
      const formData = new FormData();
      Object.keys(courseData).forEach(key => {
        if (key === 'pdf_note' || key === 'video' || key === 'course_image') {
          if (courseData[key]) {
            formData.append(key, courseData[key]);
          }
        } else {
          formData.append(key, courseData[key]);
        }
      });

      const response = await axiosInstance.put(`/courses/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a course
  deleteCourse: async (id) => {
    try {
      const response = await axiosInstance.delete(`/courses/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single course
  getCourse: async (id) => {
    try {
      const response = await axiosInstance.get(`/courses/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get upcoming courses
  getUpcomingCourses: async () => {
    try {
      const response = await axiosInstance.get('/courses/?upcoming=true');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get past courses
  getPastCourses: async () => {
    try {
      const response = await axiosInstance.get('/courses/?past=true');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Quick Exam Services
  // Quick Exam Services
  createQuickExam: async (examData) => {
    try {
      const formData = new FormData();
      
      // Debug logging
      console.log('Sending exam data:', {
        title: examData.title,
        exam_type: examData.examType,
        duration: examData.duration,
        max_attempts: examData.maxAttempts,
        questions_pdf: examData.questionsPdf?.name,
        answers_pdf: examData.answersPdf?.name
      });

      // Correctly append form data with proper field names
      formData.append('title', examData.title);
      formData.append('exam_type', examData.examType);
      formData.append('duration', examData.duration);
      formData.append('max_attempts', examData.maxAttempts);
      
      // Only append files if they exist
      if (examData.questionsPdf instanceof File) {
        formData.append('questions_pdf', examData.questionsPdf);
      }
      if (examData.answersPdf instanceof File) {
        formData.append('answers_pdf', examData.answersPdf);
      }

      // Debug: Log FormData entries
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1] instanceof File ? pair[1].name : pair[1]);
      }

      const response = await axiosInstance.post('/quick-exams/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Ensure authorization header is present
          'Authorization': `Bearer ${localStorage.getItem('token')}` // adjust based on your auth method
        },
        // Add request debugging
        onUploadProgress: (progressEvent) => {
          console.log('Upload progress:', progressEvent.loaded, '/', progressEvent.total);
        }
      });
      
      return response.data;
    } catch (error) {
      // Enhanced error logging
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });

      // Throw a more informative error
      const errorMessage = error.response?.data 
        ? (typeof error.response.data === 'object' 
            ? Object.values(error.response.data).join('. ') 
            : error.response.data)
        : 'Error creating quick exam. Please check your form data and try again.';
      
      throw new Error(errorMessage);
    }
  },


  getQuickExams: async () => {
    try {
      const response = await axiosInstance.get('/quick-exams/');
      return response.data;
    } catch (error) {
      console.error('Error fetching quick exams:', error);
      throw error;
    }
  },

  updateQuickExam: async (id, examData) => {
    try {
      const formData = new FormData();
      
      // Add fields that are being updated
      if (examData.title) formData.append('title', examData.title);
      if (examData.examType) formData.append('exam_type', examData.examType);
      if (examData.duration) formData.append('duration', examData.duration);
      if (examData.maxAttempts) formData.append('max_attempts', examData.maxAttempts);
      
      // Only append files if new ones are provided
      if (examData.questionsPdf) {
        formData.append('questions_pdf', examData.questionsPdf);
      }
      if (examData.answersPdf) {
        formData.append('answers_pdf', examData.answersPdf);
      }

      const response = await axiosInstance.patch(`/quick-exams/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating quick exam:', error.response?.data);
      throw error;
    }
  },

  deleteQuickExam: async (id) => {
    try {
      const response = await axiosInstance.delete(`/quick-exams/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting quick exam:', error);
      throw error;
    }
  },

  getQuickExam: async (id) => {
    try {
      const response = await axiosInstance.get(`/quick-exams/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quick exam:', error);
      throw error;
    }
  }
};

export default onlineCourseServices;