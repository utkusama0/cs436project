import React, { useState, useEffect } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CourseList from '../../components/courses/CourseList';
import Loading from '../../components/common/Loading';
import courseService from '../../services/courseService';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getAllCourses();
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseCode) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(courseCode);
        setCourses(courses.filter(course => course.course_code !== courseCode));
      } catch (err) {
        console.error('Error deleting course:', err);
        setError('Failed to delete course. Please try again later.');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Courses</h1>
        <Link to="/courses/new/edit" className="btn btn-success">
          Add New Course
        </Link>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <CourseList courses={courses} onDelete={handleDeleteCourse} />
    </Container>
  );
};

export default CoursesPage;
