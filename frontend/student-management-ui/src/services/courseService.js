import axios from '../utils/axiosConfig';
import endpoints from '../utils/api-config';

// Course service functions
const courseService = {
  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await axios.get(endpoints.courses.getAll);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get a single course by code
  getCourseByCode: async (courseCode) => {
    try {
      const response = await axios.get(endpoints.courses.getById(courseCode));
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${courseCode}:`, error);
      throw error;
    }
  },

  // Create a new course
  createCourse: async (courseData) => {
    try {
      const response = await axios.post(endpoints.courses.create, courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Update a course
  updateCourse: async (courseCode, courseData) => {
    try {
      const response = await axios.put(
        endpoints.courses.update(courseCode),
        courseData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating course ${courseCode}:`, error);
      throw error;
    }
  },

  // Delete a course
  deleteCourse: async (courseCode) => {
    try {
      const response = await axios.delete(endpoints.courses.delete(courseCode));
      return response.data;
    } catch (error) {
      console.error(`Error deleting course ${courseCode}:`, error);
      throw error;
    }
  },
};

export default courseService;
