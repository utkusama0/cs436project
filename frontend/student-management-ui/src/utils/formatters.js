/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @param {string} format - The format to use (default: 'MM/DD/YYYY')
 * @returns {string} The formatted date string
 */
export const formatDate = (date, format = 'MM/DD/YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }
  
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  
  if (format === 'MM/DD/YYYY') {
    return `${month}/${day}/${year}`;
  } else if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  }
  
  return `${month}/${day}/${year}`;
};

/**
 * Format a grade to show a letter grade
 * @param {number} grade - The numeric grade (0-100)
 * @returns {string} The letter grade
 */
export const formatGrade = (grade) => {
  if (grade === null || grade === undefined) return 'N/A';
  
  if (grade >= 90) return 'A';
  if (grade >= 80) return 'B';
  if (grade >= 70) return 'C';
  if (grade >= 60) return 'D';
  return 'F';
};

/**
 * Format a full name from first and last name
 * @param {string} firstName - The first name
 * @param {string} lastName - The last name
 * @returns {string} The formatted full name
 */
export const formatFullName = (firstName, lastName) => {
  if (!firstName && !lastName) return '';
  return `${firstName || ''} ${lastName || ''}`.trim();
};

/**
 * Format a phone number
 * @param {string} phone - The phone number
 * @returns {string} The formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid phone number
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};
