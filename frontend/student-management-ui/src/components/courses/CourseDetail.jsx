import React from 'react';
import { Card, Table } from 'react-bootstrap';

const CourseDetail = ({ course }) => {
  if (!course) return null;

  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-4">Course Details</Card.Title>
        
        <h2>{course.name}</h2>
        <p className="text-muted">Course Code: {course.course_code}</p>
        
        <h5 className="mt-4">Description</h5>
        <p>{course.description || 'No description available'}</p>
        
        <Table striped bordered hover className="mt-4">
          <tbody>
            <tr>
              <th width="20%">Credits</th>
              <td>{course.credits}</td>
            </tr>
            <tr>
              <th>Department</th>
              <td>{course.department || 'Not specified'}</td>
            </tr>
            <tr>
              <th>Prerequisites</th>
              <td>{course.prerequisites || 'None'}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default CourseDetail;
