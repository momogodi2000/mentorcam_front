import axiosInstance from '../backend_connection';

const onlineCourseServices = {
  // Quick Exam Services
  createQuickExam: async (examData) => {
    try {
      // Check if examData is already a FormData object
      const formData = examData instanceof FormData 
        ? examData 
        : new FormData();
      
      // If it's not already a FormData, create one with the data
      if (!(examData instanceof FormData)) {
        // Validate required fields before sending
        const requiredFields = {
          'title': examData.title,
          'exam_type': examData.examType,
          'duration': examData.duration,
          'max_attempts': examData.maxAttempts,
          'questions_pdf': examData.questionsPdf,
          'answers_pdf': examData.answersPdf
        };
  
        // Check for missing required fields
        Object.entries(requiredFields).forEach(([key, value]) => {
          if (!value) {
            throw new Error(`Missing required field: ${key}`);
          }
        });
  
        // Validate file types
        if (examData.questionsPdf && examData.questionsPdf.type !== 'application/pdf') {
          throw new Error('Questions file must be a PDF');
        }
        if (examData.answersPdf && examData.answersPdf.type !== 'application/pdf') {
          throw new Error('Answers file must be a PDF');
        }
  
        // Append form data with proper field names matching backend expectations
        formData.append('title', examData.title);
        formData.append('exam_type', examData.examType);
        formData.append('duration', examData.duration);
        formData.append('max_attempts', examData.maxAttempts);
        formData.append('questions_pdf', examData.questionsPdf);
        formData.append('answers_pdf', examData.answersPdf);
      }
  
      // Log the final FormData entries for debugging
      console.log('Sending FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]);
      }
  
      const response = await axiosInstance.post('/quick-exams/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      return response.data;
    } catch (error) {
      // Enhanced error handling
      if (error.response?.data) {
        const errorMessage = typeof error.response.data === 'object' 
          ? Object.entries(error.response.data)
              .map(([key, value]) => `${key}: ${value}`)
              .join('. ')
          : error.response.data;
        throw new Error(errorMessage);
      }
      throw error;
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

  // Enhanced updateQuickExam method for edit functionality
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
      if (error.response?.data) {
        const errorMessage = typeof error.response.data === 'object' 
          ? Object.entries(error.response.data)
              .map(([key, value]) => `${key}: ${value}`)
              .join('. ')
          : error.response.data;
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Enhanced deleteQuickExam method with better error handling
  deleteQuickExam: async (id) => {
    try {
      await axiosInstance.delete(`/quick-exams/${id}/`);
      return { success: true, message: 'Exam deleted successfully' };
    } catch (error) {
      if (error.response?.data) {
        const errorMessage = typeof error.response.data === 'object' 
          ? Object.entries(error.response.data)
              .map(([key, value]) => `${key}: ${value}`)
              .join('. ')
          : error.response.data;
        throw new Error(errorMessage);
      }
      throw new Error('Failed to delete exam. Please try again.');
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
  },

  getQuickExamStatistics: async () => {
    try {
      const response = await axiosInstance.get('/quick-exams/statistics/');
      return response.data;
    } catch (error) {
      console.error('Error fetching exam statistics:', error);
      throw error;
    }
  },

  getQuickExamResults: async () => {
    try {
      const response = await axiosInstance.get('/quick-exams/results/');
      return response.data;
    } catch (error) {
      console.error('Error fetching exam results:', error);
      throw error;
    }
  }
  
};

export default onlineCourseServices;