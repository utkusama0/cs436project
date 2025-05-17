// Backend API endpoint configuration
// When running outside Docker, we need to specify the full URL with port
const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'http://localhost:8000';

// API endpoints
const endpoints = {  // Student endpoints
  students: {
    getAll: `${API_BASE_URL}/api/students`,
    getById: (id) => `${API_BASE_URL}/api/students/${id}`,
    create: `${API_BASE_URL}/api/students`,
    update: (id) => `${API_BASE_URL}/api/students/${id}`,
    delete: (id) => `${API_BASE_URL}/api/students/${id}`,
  },
    // Course endpoints
  courses: {
    getAll: `${API_BASE_URL}/api/courses`,
    getById: (id) => `${API_BASE_URL}/api/courses/${id}`,
    create: `${API_BASE_URL}/api/courses`,
    update: (id) => `${API_BASE_URL}/api/courses/${id}`,
    delete: (id) => `${API_BASE_URL}/api/courses/${id}`,
  },
    // Grade endpoints
  grades: {
    getAll: `${API_BASE_URL}/api/grades`,
    getByStudentId: (studentId) => `${API_BASE_URL}/api/grades?student_id=${studentId}`,
    getByCourseCode: (courseCode) => `${API_BASE_URL}/api/grades?course_code=${courseCode}`,
    getByStudentAndCourse: (studentId, courseCode) => 
      `${API_BASE_URL}/api/grades?student_id=${studentId}&course_code=${courseCode}`,
    create: `${API_BASE_URL}/api/grades`,
    update: (id) => `${API_BASE_URL}/api/grades/${id}`,
    delete: (id) => `${API_BASE_URL}/api/grades/${id}`,
  },
};

export default endpoints;
