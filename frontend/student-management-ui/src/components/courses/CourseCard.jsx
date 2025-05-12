import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, onDelete }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{course.course_code}: {course.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Credits: {course.credits}</Card.Subtitle>
        <Card.Text>
          {course.description || 'No description available'}
        </Card.Text>
        <div className="d-flex justify-content-between">
          <Link to={`/courses/${course.course_code}`} className="btn btn-primary">
            View Details
          </Link>
          <div>
            <Link to={`/courses/${course.course_code}/edit`} className="btn btn-secondary me-2">
              Edit
            </Link>
            <Button 
              variant="danger" 
              onClick={() => onDelete(course.course_code)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
