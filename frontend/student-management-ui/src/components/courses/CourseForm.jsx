import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { validateRequired, validateCourseCode } from '../../utils/validators';

const CourseForm = ({ course, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    course_code: '',
    name: '',
    description: '',
    credits: 3,
    department: '',
    prerequisites: ''
  });
  
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (course) {
      setFormData({
        ...course
      });
    }
  }, [course]);

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
    const requiredFields = ['name', 'credits'];
    if (!isEditing) {
      requiredFields.push('course_code');
    }
    
    const requiredValidation = validateRequired(formData, requiredFields);
    if (!requiredValidation.isValid) {
      Object.assign(newErrors, requiredValidation.errors);
    }
    
    // Course code format
    if (formData.course_code && !validateCourseCode(formData.course_code)) {
      newErrors.course_code = 'Course code must be in the format ABC123';
    }
    
    // Credits must be a number
    if (isNaN(formData.credits)) {
      newErrors.credits = 'Credits must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        credits: Number(formData.credits)
      });
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
            <Form.Label>Course Code</Form.Label>
            <Form.Control
              type="text"
              name="course_code"
              value={formData.course_code}
              onChange={handleChange}
              disabled={isEditing}
              isInvalid={!!errors.course_code}
              placeholder="e.g., CS101"
            />
            <Form.Control.Feedback type="invalid">
              {errors.course_code}
            </Form.Control.Feedback>
            {isEditing && (
              <Form.Text className="text-muted">
                Course code cannot be changed
              </Form.Text>
            )}
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Credits</Form.Label>
            <Form.Control
              type="number"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
              isInvalid={!!errors.credits}
              min="1"
              max="6"
            />
            <Form.Control.Feedback type="invalid">
              {errors.credits}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Course Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          isInvalid={!!errors.name}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name}
        </Form.Control.Feedback>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Department</Form.Label>
        <Form.Control
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          isInvalid={!!errors.department}
        />
        <Form.Control.Feedback type="invalid">
          {errors.department}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Prerequisites</Form.Label>
        <Form.Control
          type="text"
          name="prerequisites"
          value={formData.prerequisites}
          onChange={handleChange}
          isInvalid={!!errors.prerequisites}
          placeholder="e.g., CS100, MATH101"
        />
        <Form.Control.Feedback type="invalid">
          {errors.prerequisites}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleChange}
          isInvalid={!!errors.description}
        />
        <Form.Control.Feedback type="invalid">
          {errors.description}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex justify-content-end mt-4">
        <Button type="submit" variant="primary">
          {isEditing ? 'Update Course' : 'Create Course'}
        </Button>
      </div>
    </Form>
  );
};

export default CourseForm;
