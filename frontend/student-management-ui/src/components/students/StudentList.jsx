import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import StudentCard from './StudentCard';

const StudentList = ({ students, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('all');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterField(e.target.value);
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    
    if (searchTerm === '') return true;

    switch (filterField) {
      case 'id':
        return student.student_id.toLowerCase().includes(searchLower);
      case 'name':
        return (
          student.first_name.toLowerCase().includes(searchLower) ||
          student.last_name.toLowerCase().includes(searchLower)
        );
      case 'email':
        return student.email.toLowerCase().includes(searchLower);
      case 'all':
      default:
        return (
          student.student_id.toLowerCase().includes(searchLower) ||
          student.first_name.toLowerCase().includes(searchLower) ||
          student.last_name.toLowerCase().includes(searchLower) ||
          student.email.toLowerCase().includes(searchLower)
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
              placeholder="Search students..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Select value={filterField} onChange={handleFilterChange}>
            <option value="all">All Fields</option>
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
            Clear
          </Button>
        </Col>
      </Row>

      {filteredStudents.length === 0 ? (
        <div className="text-center my-5">
          <p>No students found matching your search criteria.</p>
        </div>
      ) : (
        filteredStudents.map(student => (
          <StudentCard
            key={student.student_id}
            student={student}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default StudentList;
