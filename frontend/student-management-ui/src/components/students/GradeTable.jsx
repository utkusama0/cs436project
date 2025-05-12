import React, { useState, useEffect } from 'react';
import { Table, Card } from 'react-bootstrap';
import { formatDate, formatGrade } from '../../utils/formatters';

const GradeTable = ({ grades, semester = null }) => {
  const [filteredGrades, setFilteredGrades] = useState([]);
  
  useEffect(() => {
    if (grades) {
      if (semester) {
        setFilteredGrades(grades.filter(grade => grade.semester === semester));
      } else {
        setFilteredGrades(grades);
      }
    }
  }, [grades, semester]);

  if (!grades || grades.length === 0) {
    return (
      <Card className="mt-4">
        <Card.Body>
          <p className="text-center">No grades available.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>
          {semester ? `Grades - ${semester}` : 'All Grades'}
        </Card.Title>
        
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Semester</th>
              <th>Grade</th>
              <th>Letter</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrades.map((grade) => (
              <tr key={`${grade.student_id}-${grade.course_code}-${grade.semester}`}>
                <td>{grade.course_code}</td>
                <td>{grade.course ? grade.course.name : 'N/A'}</td>
                <td>{grade.semester}</td>
                <td>{grade.grade}</td>
                <td>{formatGrade(grade.grade)}</td>
                <td>{formatDate(grade.date)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default GradeTable;
