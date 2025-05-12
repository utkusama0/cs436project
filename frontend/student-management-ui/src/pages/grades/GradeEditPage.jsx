import React, { useState, useEffect } from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import GradeForm from '../../components/grades/GradeForm';
import Loading from '../../components/common/Loading';
import gradeService from '../../services/gradeService';

const GradeEditPage = () => {
  const { gradeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get query parameters if they exist
  const queryParams = new URLSearchParams(location.search);
  const preselectedStudentId = queryParams.get('studentId');
  const preselectedCourseCode = queryParams.get('courseCode');
  
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isNewGrade = gradeId === 'new';

  useEffect(() => {
    const fetchGrade = async () => {
      if (isNewGrade) {
        // Set default values for new grade
        setGrade({
          id: null,
          student_id: preselectedStudentId || '',
          course_code: preselectedCourseCode || '',
          semester: '',
          grade: null,
          date: ''
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await gradeService.getGradeById(gradeId);
        setGrade(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching grade:', err);
        setError('Failed to load grade. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGrade();
  }, [gradeId, isNewGrade, preselectedStudentId, preselectedCourseCode]);

  const handleSubmit = async (formData) => {
    try {
      if (isNewGrade) {
        await gradeService.createGrade(formData);
        setSuccess(true);
        setTimeout(() => {
          // Redirect to appropriate page based on what was pre-selected
          if (preselectedStudentId) {
            navigate(`/students/${preselectedStudentId}`);
          } else if (preselectedCourseCode) {
            navigate(`/courses/${preselectedCourseCode}`);
          } else {
            navigate('/grades');
          }
        }, 1500);
      } else {
        await gradeService.updateGrade(gradeId, formData);
        setSuccess(true);
        setTimeout(() => {
          navigate('/grades');
        }, 1500);
      }
    } catch (err) {
      console.error('Error saving grade:', err);
      setError('Failed to save grade. Please try again later.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!grade && !isNewGrade && !loading) {
    return (
      <Container className="my-4">
        <Alert variant="danger">
          Grade not found or has been deleted.
        </Alert>
        <Link to="/grades" className="btn btn-primary">
          Back to Grades
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h1>{isNewGrade ? 'Record New Grade' : 'Edit Grade'}</h1>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="mb-4">
          Grade {isNewGrade ? 'recorded' : 'updated'} successfully. Redirecting...
        </Alert>
      )}
      
      <Card>
        <Card.Body>
          <GradeForm
            grade={grade}
            onSubmit={handleSubmit}
            isEditing={!isNewGrade}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GradeEditPage;
