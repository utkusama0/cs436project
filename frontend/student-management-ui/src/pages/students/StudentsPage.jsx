import React, { useState, useEffect } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StudentList from '../../components/students/StudentList';
import Loading from '../../components/common/Loading';
import studentService from '../../services/studentService';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await studentService.getAllStudents();
        setStudents(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.deleteStudent(studentId);
        setStudents(students.filter(student => student.student_id !== studentId));
      } catch (err) {
        console.error('Error deleting student:', err);
        setError('Failed to delete student. Please try again later.');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Students</h1>
        <Link to="/students/new/edit" className="btn btn-success">
          Add New Student
        </Link>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <StudentList students={students} onDelete={handleDeleteStudent} />
    </Container>
  );
};

export default StudentsPage;
