import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { validateRequired } from '../../utils/validators';
import studentService from '../../services/studentService';
import courseService from '../../services/courseService';

const GradeForm = ({ grade, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    course_code: '',
    semester: '',
    grade: '',
    date: ''
  });
  
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(true);

  // Format date for input field
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  // Current date for default value
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        
        // Fetch students and courses in parallel
        const [studentsData, coursesData] = await Promise.all([
          studentService.getAllStudents(),
          courseService.getAllCourses()
        ]);
        
        setStudents(studentsData);
        setCourses(coursesData);
        
        if (grade) {
          setFormData({
            ...grade,
            date: formatDateForInput(grade.date)
          });
        } else {
          // Set default date to current date
          setFormData(prev => ({
            ...prev,
            date: getCurrentDate()
          }));
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
        setFormError('Failed to load students and courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [grade]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = ['student_id', 'course_code', 'semester', 'date'];
    
    const requiredValidation = validateRequired(formData, requiredFields);
    if (!requiredValidation.isValid) {
      Object.assign(newErrors, requiredValidation.errors);
    }
    
    // Grade must be a number or null
    if (formData.grade !== '' && formData.grade !== null && (isNaN(formData.grade) || formData.grade < 0 || formData.grade > 100)) {
      newErrors.grade = 'Grade must be a number between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    
    if (validateForm()) {
      // Convert grade to number if provided, otherwise null
      const gradeValue = formData.grade === '' ? null : Number(formData.grade);
      
      onSubmit({
        ...formData,
        grade: gradeValue
      });
    } else {
      setFormError('Please fix the errors in the form before submitting.');
    }
  };

  if (loading) {
    return <p>Loading form data...</p>;
  }

  return (
    <Form onSubmit={handleSubmit}>
      {formError && (
        <Alert variant="danger">{formError}</Alert>
      )}
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Student</Form.Label>
            <Form.Select
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              disabled={isEditing}
              isInvalid={!!errors.student_id}
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student.student_id} value={student.student_id}>
                  {student.student_id} - {student.first_name} {student.last_name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.student_id}
            </Form.Control.Feedback>
            {isEditing && (
              <Form.Text className="text-muted">
                Student cannot be changed
              </Form.Text>
            )}
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Course</Form.Label>
            <Form.Select
              name="course_code"
              value={formData.course_code}
              onChange={handleChange}
              disabled={isEditing}
              isInvalid={!!errors.course_code}
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.course_code} value={course.course_code}>
                  {course.course_code} - {course.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.course_code}
            </Form.Control.Feedback>
            {isEditing && (
              <Form.Text className="text-muted">
                Course cannot be changed
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Semester</Form.Label>
            <Form.Select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              disabled={isEditing}
              isInvalid={!!errors.semester}
            >
              <option value="">Select Semester</option>
              <option value="Fall 2023">Fall 2023</option>
              <option value="Spring 2024">Spring 2024</option>
              <option value="Summer 2024">Summer 2024</option>
              <option value="Fall 2024">Fall 2024</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.semester}
            </Form.Control.Feedback>
            {isEditing && (
              <Form.Text className="text-muted">
                Semester cannot be changed
              </Form.Text>
            )}
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Grade (0-100, leave empty if not graded yet)</Form.Label>
            <Form.Control
              type="number"
              name="grade"
              value={formData.grade === null ? '' : formData.grade}
              onChange={handleChange}
              isInvalid={!!errors.grade}
              min="0"
              max="100"
              step="0.1"
            />
            <Form.Control.Feedback type="invalid">
              {errors.grade}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          isInvalid={!!errors.date}
        />
        <Form.Control.Feedback type="invalid">
          {errors.date}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex justify-content-end mt-4">
        <Button type="submit" variant="primary">
          {isEditing ? 'Update Grade' : 'Record Grade'}
        </Button>
      </div>
    </Form>
  );
};

export default GradeForm;
