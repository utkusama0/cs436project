import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import CourseCard from './CourseCard';

const CourseList = ({ courses, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('all');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterField(e.target.value);
  };

  const filteredCourses = courses.filter(course => {
    const searchLower = searchTerm.toLowerCase();
    
    if (searchTerm === '') return true;

    switch (filterField) {
      case 'code':
        return course.course_code.toLowerCase().includes(searchLower);
      case 'name':
        return course.name.toLowerCase().includes(searchLower);
      case 'description':
        return course.description?.toLowerCase().includes(searchLower);
      case 'all':
      default:
        return (
          course.course_code.toLowerCase().includes(searchLower) ||
          course.name.toLowerCase().includes(searchLower) ||
          course.description?.toLowerCase().includes(searchLower)
        );
    }
  });

  return (
    <div>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Select value={filterField} onChange={handleFilterChange}>
            <option value="all">All Fields</option>
            <option value="code">Course Code</option>
            <option value="name">Course Name</option>
            <option value="description">Description</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
            Clear
          </Button>
        </Col>
      </Row>

      {filteredCourses.length === 0 ? (
        <div className="text-center my-5">
          <p>No courses found matching your search criteria.</p>
        </div>
      ) : (
        filteredCourses.map(course => (
          <CourseCard
            key={course.course_code}
            course={course}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default CourseList;
