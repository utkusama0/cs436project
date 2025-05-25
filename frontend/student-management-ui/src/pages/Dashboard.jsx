import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import studentService from '../services/studentService';
import courseService from '../services/courseService';
import gradeService from '../services/gradeService';
import Loading from '../components/common/Loading';
import SpringTermInfo from '../components/SpringTermInfo';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    students: 0,
    courses: 0,
    grades: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [students, courses, grades] = await Promise.all([
          studentService.getAllStudents(),
          courseService.getAllCourses(),
          gradeService.getAllGrades()
        ]);

        setCounts({
          students: students.length,
          courses: courses.length,
          grades: grades.length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Container className="my-4">
      <h1 className="mb-4">Dashboard</h1>
      <SpringTermInfo />
      
      <Row>
        <Col md={4}>
          <Card className="mb-4 text-center">
            <Card.Body>
              <Card.Title>Students</Card.Title>
              <Card.Text>
                <h2>{counts.students}</h2>
                <p>Total Students</p>
              </Card.Text>
              <Link to="/students" className="btn btn-primary">View Students</Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4 text-center">
            <Card.Body>
              <Card.Title>Courses</Card.Title>
              <Card.Text>
                <h2>{counts.courses}</h2>
                <p>Total Courses</p>
              </Card.Text>
              <Link to="/courses" className="btn btn-primary">View Courses</Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4 text-center">
            <Card.Body>
              <Card.Title>Grades</Card.Title>
              <Card.Text>
                <h2>{counts.grades}</h2>
                <p>Total Grade Records</p>
              </Card.Text>
              <Link to="/grades" className="btn btn-primary">View Grades</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>Quick Actions</Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Link to="/students/edit/new" className="btn btn-outline-primary">Add New Student</Link>
                <Link to="/courses/edit/new" className="btn btn-outline-primary">Add New Course</Link>
                <Link to="/grades/edit/new" className="btn btn-outline-primary">Record New Grade</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>System Information</Card.Header>
            <Card.Body>
              <p><strong>Server Status:</strong> <span className="text-success">Online</span></p>
              <p><strong>Last Update:</strong> {new Date().toLocaleString()}</p>
              <p><strong>Version:</strong> 1.0.0</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
