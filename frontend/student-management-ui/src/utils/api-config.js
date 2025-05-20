import { API_BASE } from './env-config';

// API endpoints
const endpoints = {
  // Student endpoints
  students: {
    getAll: `${API_BASE}/students`,
    getById: (id) => `${API_BASE}/students/${id}`,
    create: `${API_BASE}/students`,
    update: (id) => `${API_BASE}/students/${id}`,
    delete: (id) => `${API_BASE}/students/${id}`,
  },
  
  // Course endpoints
  courses: {
    getAll: `${API_BASE}/courses`,
    getById: (id) => `${API_BASE}/courses/${id}`,
    create: `${API_BASE}/courses`,
    update: (id) => `${API_BASE}/courses/${id}`,
    delete: (id) => `${API_BASE}/courses/${id}`,
  },
  
  // Grade endpoints
  grades: {
    getAll: `${API_BASE}/grades`,
    getByStudentId: (studentId) => `${API_BASE}/grades?student_id=${studentId}`,
    getByCourseCode: (courseCode) => `${API_BASE}/grades?course_code=${courseCode}`,
    getByStudentAndCourse: (studentId, courseCode) => 
      `${API_BASE}/grades?student_id=${studentId}&course_code=${courseCode}`,
    create: `${API_BASE}/grades`,
    update: (id) => `${API_BASE}/grades/${id}`,
    delete: (id) => `${API_BASE}/grades/${id}`,
  },
};

export default endpoints;
