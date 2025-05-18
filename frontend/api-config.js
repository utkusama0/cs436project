import { getEnv } from './env-config';

// Backend API endpoint configuration
const API_BASE_URL = getEnv('BACKEND_URL', 'http://localhost:8000');

// API endpoints
const endpoints = {
  // Student endpoints
  students: {
    getAll: `${API_BASE_URL}/students`,
    getById: (id) => `${API_BASE_URL}/students/${id}`,
    create: `${API_BASE_URL}/students`,
    update: (id) => `${API_BASE_URL}/students/${id}`,
    delete: (id) => `${API_BASE_URL}/students/${id}`,
  },
  
  // Course endpoints
  courses: {
    getAll: `${API_BASE_URL}/courses`,
    getById: (id) => `${API_BASE_URL}/courses/${id}`,
    create: `${API_BASE_URL}/courses`,
    update: (id) => `${API_BASE_URL}/courses/${id}`,
    delete: (id) => `${API_BASE_URL}/courses/${id}`,
  },
  
  // Grade endpoints
  grades: {
    getAll: `${API_BASE_URL}/grades`,
    getByStudentId: (studentId) => `${API_BASE_URL}/grades?student_id=${studentId}`,
    getByCourseCode: (courseCode) => `${API_BASE_URL}/grades?course_code=${courseCode}`,
    getByStudentAndCourse: (studentId, courseCode) => 
      `${API_BASE_URL}/grades?student_id=${studentId}&course_code=${courseCode}`,
    create: `${API_BASE_URL}/grades`,
    update: (id) => `${API_BASE_URL}/grades/${id}`,
    delete: (id) => `${API_BASE_URL}/grades/${id}`,
  },
};

export default endpoints;
