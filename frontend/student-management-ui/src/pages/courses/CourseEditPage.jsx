import React, { useState, useEffect } from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CourseForm from '../../components/courses/CourseForm';
import Loading from '../../components/common/Loading';
import courseService from '../../services/courseService';

const CourseEditPage = () => {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isNewCourse = courseCode === 'new';

  useEffect(() => {
    const fetchCourse = async () => {
      if (isNewCourse) {
        setCourse({
          course_code: '',
          name: '',
          description: '',
          credits: 3,
          department: '',
          prerequisites: ''
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await courseService.getCourseByCode(courseCode);
        setCourse(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseCode, isNewCourse]);

  const handleSubmit = async (formData) => {
    try {
      if (isNewCourse) {
        await courseService.createCourse(formData);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/courses/${formData.course_code}`);
        }, 1500);
      } else {
        await courseService.updateCourse(courseCode, formData);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/courses/${courseCode}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Error saving course:', err);
      setError('Failed to save course. Please try again later.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!course && !isNewCourse && !loading) {
    return (
      <Container className="my-4">
        <Alert variant="danger">
          Course not found or has been deleted.
        </Alert>
        <Link to="/courses" className="btn btn-primary">
          Back to Courses
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h1>{isNewCourse ? 'Add New Course' : 'Edit Course'}</h1>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="mb-4">
          Course {isNewCourse ? 'created' : 'updated'} successfully. Redirecting...
        </Alert>
      )}
      
      <Card>
        <Card.Body>
          <CourseForm
            course={course}
            onSubmit={handleSubmit}
            isEditing={!isNewCourse}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CourseEditPage;
