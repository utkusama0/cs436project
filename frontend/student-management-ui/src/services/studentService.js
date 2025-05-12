import axios from 'axios';
import endpoints from '../utils/api-config';

// Student service functions
const studentService = {
  // Get all students
  getAllStudents: async () => {
    try {
      const response = await axios.get(endpoints.students.getAll);
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  // Get a single student by ID
  getStudentById: async (studentId) => {
    try {
      const response = await axios.get(endpoints.students.getById(studentId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${studentId}:`, error);
      throw error;
    }
  },

  // Create a new student
  createStudent: async (studentData) => {
    try {
      const response = await axios.post(endpoints.students.create, studentData);
      return response.data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },

  // Update a student
  updateStudent: async (studentId, studentData) => {
    try {
      const response = await axios.put(
        endpoints.students.update(studentId),
        studentData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating student ${studentId}:`, error);
      throw error;
    }
  },

  // Delete a student
  deleteStudent: async (studentId) => {
    try {
      const response = await axios.delete(endpoints.students.delete(studentId));
      return response.data;
    } catch (error) {
      console.error(`Error deleting student ${studentId}:`, error);
      throw error;
    }
  },
};

export default studentService;
