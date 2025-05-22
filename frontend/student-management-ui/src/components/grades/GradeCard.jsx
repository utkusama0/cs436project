import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatDate, formatGrade } from '../../utils/formatters';

const GradeCard = ({ grade, onDelete }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          <Link to={`/courses/${grade.course_code}`}>
            {grade.course_code}: {grade.course ? grade.course.name : 'Unknown Course'}
          </Link>
        </Card.Title>
        <Card.Subtitle className="mb-2">
          <Link to={`/students/${grade.student_id}`}>
            Student: {grade.student ? `${grade.student.first_name} ${grade.student.last_name}` : grade.student_id}
          </Link>
        </Card.Subtitle>
        
        <Table bordered size="sm" className="mt-3">
          <tbody>
            <tr>
              <th width="30%">Semester</th>
              <td>{grade.semester}</td>
            </tr>
            <tr>
              <th>Grade</th>
              <td>{grade.grade !== null ? grade.grade : 'Not graded'} {grade.grade !== null ? `(${formatGrade(grade.grade)})` : ''}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{formatDate(grade.date)}</td>
            </tr>
          </tbody>
        </Table>
        
        <div className="d-flex justify-content-end mt-3">
          <Button 
            as={Link} 
            to={`/grades/${grade.id}/edit`} 
            variant="secondary" 
            className="me-2"
          >
            Edit
          </Button>
          <Button 
            variant="danger" 
            onClick={() => onDelete(grade.id)}
          >
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default GradeCard;
