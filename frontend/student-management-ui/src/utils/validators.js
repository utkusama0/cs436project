/**
 * Validate email format
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email is valid
 */
export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

/**
 * Validate a student ID format (S followed by 5+ digits)
 * @param {string} studentId - The student ID to validate
 * @returns {boolean} True if the student ID is valid
 */
export const validateStudentId = (studentId) => {
  if (!studentId) return false;
  const re = /^S\d{5,}$/;
  return re.test(studentId);
};

/**
 * Validate a course code format (3 letters followed by 3 digits)
 * @param {string} courseCode - The course code to validate
 * @returns {boolean} True if the course code is valid
 */
export const validateCourseCode = (courseCode) => {
  if (!courseCode) return false;
  const re = /^[A-Z]{3}\d{3}$/;
  return re.test(courseCode);
};

/**
 * Validate a grade value (0-100)
 * @param {number} grade - The grade to validate
 * @returns {boolean} True if the grade is valid
 */
export const validateGrade = (grade) => {
  if (grade === null || grade === undefined) return false;
  return Number.isInteger(Number(grade)) && grade >= 0 && grade <= 100;
};

/**
 * Validate required fields in an object
 * @param {Object} data - The data object to validate
 * @param {Array<string>} requiredFields - Array of required field names
 * @returns {Object} Object containing isValid flag and errors list
 */
export const validateRequired = (data, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors[field] = `${field} is required`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
