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
  }
};

export default onlineCourseServices;