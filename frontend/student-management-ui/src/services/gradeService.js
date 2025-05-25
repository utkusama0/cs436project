import axios from 'axios';
import endpoints from '../utils/api-config';

// Grade service functions
const gradeService = {  // Get all grades
  getAllGrades: async () => {
    try {
      const response = await axios.get(endpoints.grades.getAll);
      return response.data;
    } catch (error) {
      console.error('Error fetching grades:', error);
      throw error;
    }
  },

  // Get a single grade by ID
  getGradeById: async (gradeId) => {
    try {
      const response = await axios.get(`${endpoints.grades.getAll}/${gradeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching grade ${gradeId}:`, error);
      throw error;
    }
  },
  // Get grades by student ID
  getGradesByStudentId: async (studentId) => {
    try {
      const response = await axios.get(endpoints.grades.getByStudentId(studentId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching grades for student ${studentId}:`, error);
      throw error;
    }
  },

  // Get student transcript (alternative endpoint for transcript view)
  getStudentTranscript: async (studentId) => {
    try {
      const response = await axios.get(`${endpoints.grades.getAll}/student/${studentId}/transcript`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transcript for student ${studentId}:`, error);
      throw error;
    }
  },

  // Get grades by course code
  getGradesByCourseCode: async (courseCode) => {
    try {
      const response = await axios.get(endpoints.grades.getByCourseCode(courseCode));
      return response.data;
    } catch (error) {
      console.error(`Error fetching grades for course ${courseCode}:`, error);
      throw error;
    }
  },

  // Get grades by student ID and course code
  getGradesByStudentAndCourse: async (studentId, courseCode) => {
    try {
      const response = await axios.get(
        endpoints.grades.getByStudentAndCourse(studentId, courseCode)
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching grades for student ${studentId} and course ${courseCode}:`, error);
      throw error;
    }
  },

  // Create a new grade
  createGrade: async (gradeData) => {
    try {
      const response = await axios.post(endpoints.grades.create, gradeData);
      return response.data;
    } catch (error) {
      console.error('Error creating grade:', error);
      throw error;
    }
  },

  // Update a grade
  updateGrade: async (gradeId, gradeData) => {
    try {
      const response = await axios.put(
        endpoints.grades.update(gradeId),
        gradeData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating grade ${gradeId}:`, error);
      throw error;
    }
  },

  // Delete a grade
  deleteGrade: async (gradeId) => {
    try {
      const response = await axios.delete(endpoints.grades.delete(gradeId));
      return response.data;
    } catch (error) {
      console.error(`Error deleting grade ${gradeId}:`, error);
      throw error;
    }
  },
};

export default gradeService;
