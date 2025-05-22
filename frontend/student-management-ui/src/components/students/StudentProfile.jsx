import React from 'react';
import { Card, Row, Col, Table } from 'react-bootstrap';
import { formatDate, formatPhoneNumber } from '../../utils/formatters';

const StudentProfile = ({ student }) => {
  if (!student) return null;

  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-4">Student Profile</Card.Title>
        
        <Row className="mb-3">
          <Col md={6}>
            <h2>{student.first_name} {student.last_name}</h2>
            <p className="text-muted">Student ID: {student.student_id}</p>
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col md={6}>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Phone:</strong> {formatPhoneNumber(student.phone)}</p>
          </Col>
          <Col md={6}>
            <p><strong>Date of Birth:</strong> {formatDate(student.date_of_birth)}</p>
            <p><strong>Enrollment Date:</strong> {formatDate(student.enrollment_date)}</p>
          </Col>
        </Row>
        
        <h5>Address</h5>
        <p>{student.address}</p>
      </Card.Body>
    </Card>
  );
};

export default StudentProfile;
