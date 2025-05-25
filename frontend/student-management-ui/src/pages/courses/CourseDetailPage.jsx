import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Card, Table } from 'react-bootstrap';
import CourseDetail from '../../components/courses/CourseDetail';
import Loading from '../../components/common/Loading';
import courseService from '../../services/courseService';
import gradeService from '../../services/gradeService';

const CourseDetailPage = () => {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        
        // Fetch course and enrollments in parallel
        const courseData = await courseService.getCourseByCode(courseCode);
        setCourse(courseData);
        
        // Fetch students enrolled in this course (grades)
        try {
          const gradesData = await gradeService.getGradesByCourseCode(courseCode);
          setEnrollments(gradesData);
        } catch (gradeErr) {
          console.error('Error fetching grades:', gradeErr);
          // Non-critical error, don't set the main error state
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseCode]);

  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(courseCode);
        navigate('/courses');
      } catch (err) {
        console.error('Error deleting course:', err);
        setError('Failed to delete course. Please try again later.');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!course && !loading) {
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Course Details</h1>
        <div>
          <Button 
            as={Link} 
            to="/courses" 
            variant="outline-secondary" 
            className="me-2"
          >
            Back to List
          </Button>
          <Button 
            as={Link} 
            to={`/courses/${courseCode}/edit`} 
            variant="outline-primary" 
            className="me-2"
          >
            Edit Course
          </Button>
          <Button 
            variant="outline-danger" 
            onClick={handleDeleteClick}
          >
            Delete Course
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
          <CourseDetail course={course} />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Enrolled Students</Card.Title>
              
              {enrollments.length === 0 ? (
                <p className="text-center my-4">No students are currently enrolled in this course.</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Semester</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map(enrollment => (
                      <tr key={`${enrollment.student_id}-${enrollment.semester}`}>
                        <td>
                          <Link to={`/students/${enrollment.student_id}`}>
                            {enrollment.student_id}
                          </Link>
                        </td>
                        <td>
                          {enrollment.student 
                            ? `${enrollment.student.first_name} ${enrollment.student.last_name}` 
                            : 'Unknown'}
                        </td>
                        <td>{enrollment.semester}</td>
                        <td>{enrollment.grade !== null 
                          ? enrollment.grade 
                          : 'Not graded'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              
              <div className="d-flex justify-content-end mt-3">
                <Button 
                  as={Link} 
                  to={`/grades/new/edit`} 
                  variant="primary"
                >
                  Add Student to Course
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseDetailPage;
