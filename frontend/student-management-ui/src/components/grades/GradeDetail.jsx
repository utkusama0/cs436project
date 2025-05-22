import React from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { formatGrade } from '../../utils/formatters';

const GradeForm = ({ grade }) => {
  if (!grade) return null;

  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-4">Grade Details</Card.Title>
        
        <Table bordered responsive>
          <tbody>
            <tr>
              <th width="30%">Student</th>
              <td>{grade.student ? `${grade.student.first_name} ${grade.student.last_name} (${grade.student_id})` : grade.student_id}</td>
            </tr>
            <tr>
              <th>Course</th>
              <td>{grade.course ? `${grade.course.name} (${grade.course_code})` : grade.course_code}</td>
            </tr>
            <tr>
              <th>Semester</th>
              <td>{grade.semester}</td>
            </tr>
            <tr>
              <th>Grade</th>
              <td>{grade.grade !== null ? grade.grade : 'Not graded'}</td>
            </tr>
            <tr>
              <th>Letter Grade</th>
              <td>{grade.grade !== null ? formatGrade(grade.grade) : 'N/A'}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default GradeForm;
