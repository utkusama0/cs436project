import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Form } from 'react-bootstrap';
import StudentProfile from '../../components/students/StudentProfile';
import GradeTable from '../../components/students/GradeTable';
import Loading from '../../components/common/Loading';
import studentService from '../../services/studentService';
import gradeService from '../../services/gradeService';

const StudentDetailPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [availableSemesters, setAvailableSemesters] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        
        // Fetch student and grades in parallel
        const [studentData, gradesData] = await Promise.all([
          studentService.getStudentById(studentId),
          gradeService.getGradesByStudentId(studentId)
        ]);
        
        setStudent(studentData);
        setGrades(gradesData);
        
        // Extract unique semesters
        const semesters = [...new Set(gradesData.map(grade => grade.semester))];
        setAvailableSemesters(semesters);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.deleteStudent(studentId);
        navigate('/students');
      } catch (err) {
        console.error('Error deleting student:', err);
        setError('Failed to delete student. Please try again later.');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!student && !loading) {
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Student Details</h1>
        <div>
          <Button 
            as={Link} 
            to="/students" 
            variant="outline-secondary" 
            className="me-2"
          >
            Back to List
          </Button>
          <Button 
            as={Link} 
            to={`/students/${studentId}/edit`} 
            variant="outline-primary" 
            className="me-2"
          >
            Edit Student
          </Button>
          <Button 
            variant="outline-danger" 
            onClick={handleDeleteClick}
          >
            Delete Student
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row>
        <Col>
          <StudentProfile student={student} />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Grades</h3>
            <div className="d-flex align-items-center">
              <Form.Select 
                value={selectedSemester} 
                onChange={handleSemesterChange}
                className="me-2"
                style={{ width: '200px' }}
              >
                <option value="">All Semesters</option>
                {availableSemesters.map(semester => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </Form.Select>
              <Button 
                as={Link} 
                to={`/grades/new?studentId=${studentId}`} 
                variant="primary"
              >
                Add Grade
              </Button>
            </div>
          </div>
          <GradeTable 
            grades={grades} 
            semester={selectedSemester || null} 
          />
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDetailPage;
