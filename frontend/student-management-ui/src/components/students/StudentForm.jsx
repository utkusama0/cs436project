import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { validateEmail, validateStudentId, validateRequired } from '../../utils/validators';

const StudentForm = ({ student, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
    address: '',
    phone: '',
    enrollment_date: ''
  });
  
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (student) {
      // Format dates for date input
      const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        ...student,
        date_of_birth: formatDateForInput(student.date_of_birth),
        enrollment_date: formatDateForInput(student.enrollment_date)
      });
    }
  }, [student]);

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
    const requiredFields = ['first_name', 'last_name', 'email', 'date_of_birth', 'enrollment_date'];
    if (!isEditing) {
      requiredFields.push('student_id');
    }
    
    const requiredValidation = validateRequired(formData, requiredFields);
    if (!requiredValidation.isValid) {
      Object.assign(newErrors, requiredValidation.errors);
    }
    
    // Student ID format
    if (formData.student_id && !validateStudentId(formData.student_id)) {
      newErrors.student_id = 'Student ID must start with S followed by 5+ digits';
    }
    
    // Email format
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      setFormError('Please fix the errors in the form before submitting.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {formError && (
        <Alert variant="danger">{formError}</Alert>
      )}
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Student ID</Form.Label>
            <Form.Control
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              disabled={isEditing}
              isInvalid={!!errors.student_id}
              placeholder="e.g., S12345"
            />
            <Form.Control.Feedback type="invalid">
              {errors.student_id}
            </Form.Control.Feedback>
            {isEditing && (
              <Form.Text className="text-muted">
                Student ID cannot be changed
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              isInvalid={!!errors.first_name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.first_name}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              isInvalid={!!errors.last_name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.last_name}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              isInvalid={!!errors.phone}
              placeholder="e.g., 123-456-7890"
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              isInvalid={!!errors.date_of_birth}
            />
            <Form.Control.Feedback type="invalid">
              {errors.date_of_birth}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Enrollment Date</Form.Label>
            <Form.Control
              type="date"
              name="enrollment_date"
              value={formData.enrollment_date}
              onChange={handleChange}
              isInvalid={!!errors.enrollment_date}
            />
            <Form.Control.Feedback type="invalid">
              {errors.enrollment_date}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Address</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="address"
          value={formData.address}
          onChange={handleChange}
          isInvalid={!!errors.address}
        />
        <Form.Control.Feedback type="invalid">
          {errors.address}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex justify-content-end mt-4">
        <Button type="submit" variant="primary">
          {isEditing ? 'Update Student' : 'Create Student'}
        </Button>
      </div>
    </Form>
  );
};

export default StudentForm;
