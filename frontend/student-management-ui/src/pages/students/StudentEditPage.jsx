import React, { useState, useEffect } from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import StudentForm from '../../components/students/StudentForm';
import Loading from '../../components/common/Loading';
import studentService from '../../services/studentService';

const StudentEditPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isNewStudent = studentId === 'new';

  useEffect(() => {
    const fetchStudent = async () => {
      if (isNewStudent) {
        setStudent({
          student_id: '',
          first_name: '',
          last_name: '',
          email: '',
          date_of_birth: '',
          address: '',
          phone: '',
          enrollment_date: ''
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await studentService.getStudentById(studentId);
        setStudent(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching student:', err);
        setError('Failed to load student. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId, isNewStudent]);

  const handleSubmit = async (formData) => {
    try {
      if (isNewStudent) {
        await studentService.createStudent(formData);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/students/${formData.student_id}`);
        }, 1500);
      } else {
        await studentService.updateStudent(studentId, formData);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/students/${studentId}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Error saving student:', err);
      setError('Failed to save student. Please try again later.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!student && !isNewStudent && !loading) {
    return (
      <Container className="my-4">
        <Alert variant="danger">
          Student not found or has been deleted.
        </Alert>
        <Link to="/students" className="btn btn-primary">
          Back to Students
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h1>{isNewStudent ? 'Add New Student' : 'Edit Student'}</h1>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="mb-4">
          Student {isNewStudent ? 'created' : 'updated'} successfully. Redirecting...
        </Alert>
      )}
      
      <Card>
        <Card.Body>
          <StudentForm
            student={student}
            onSubmit={handleSubmit}
            isEditing={!isNewStudent}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentEditPage;
