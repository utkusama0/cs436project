import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import GradeCard from './GradeCard';

const GradeList = ({ grades, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterField(e.target.value);
  };

  const handleSemesterChange = (e) => {
    setSemesterFilter(e.target.value);
  };

  // Get unique semesters for the filter dropdown
  const semesters = [...new Set(grades.map(grade => grade.semester))].sort();

  const filteredGrades = grades.filter(grade => {
    // Apply semester filter
    if (semesterFilter && grade.semester !== semesterFilter) {
      return false;
    }
    
    // Apply search term
    if (searchTerm === '') return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    switch (filterField) {
      case 'student':
        return (
          grade.student_id.toLowerCase().includes(searchLower) ||
          (grade.student && (
            grade.student.first_name.toLowerCase().includes(searchLower) ||
            grade.student.last_name.toLowerCase().includes(searchLower)
          ))
        );
      case 'course':
        return (
          grade.course_code.toLowerCase().includes(searchLower) ||
          (grade.course && grade.course.name.toLowerCase().includes(searchLower))
        );
      case 'all':
      default:
        return (
          grade.student_id.toLowerCase().includes(searchLower) ||
          grade.course_code.toLowerCase().includes(searchLower) ||
          (grade.student && (
            grade.student.first_name.toLowerCase().includes(searchLower) ||
            grade.student.last_name.toLowerCase().includes(searchLower)
          )) ||
          (grade.course && grade.course.name.toLowerCase().includes(searchLower)) ||
          grade.semester.toLowerCase().includes(searchLower)
        );
    }
  });

  return (
    <div>
      <Row className="mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search grades..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Select value={filterField} onChange={handleFilterChange}>
            <option value="all">All Fields</option>
            <option value="student">Student</option>
            <option value="course">Course</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={semesterFilter} onChange={handleSemesterChange}>
            <option value="">All Semesters</option>
            {semesters.map(semester => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button 
            variant="outline-secondary" 
            onClick={() => {
              setSearchTerm('');
              setSemesterFilter('');
            }}
            className="w-100"
          >
            Clear Filters
          </Button>
        </Col>
      </Row>

      {filteredGrades.length === 0 ? (
        <div className="text-center my-5">
          <p>No grades found matching your search criteria.</p>
        </div>
      ) : (
        filteredGrades.map(grade => (
          <GradeCard
            key={`${grade.student_id}-${grade.course_code}-${grade.semester}`}
            grade={grade}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default GradeList;
