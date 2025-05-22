import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

const StudentCard = ({ student, onDelete }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{student.first_name} {student.last_name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">ID: {student.student_id}</Card.Subtitle>
        <Card.Text>
          <strong>Email:</strong> {student.email}<br />
          <strong>Enrolled:</strong> {formatDate(student.enrollment_date)}<br />
          <strong>Date of Birth:</strong> {formatDate(student.date_of_birth)}
        </Card.Text>
        <div className="d-flex justify-content-between">
          <Link to={`/students/${student.student_id}`} className="btn btn-primary">
            View Details
          </Link>
          <div>
            <Link to={`/students/${student.student_id}/edit`} className="btn btn-secondary me-2">
              Edit
            </Link>
            <Button 
              variant="danger" 
              onClick={() => onDelete(student.student_id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StudentCard;
