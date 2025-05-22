import React, { useState, useEffect } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import GradeList from '../../components/grades/GradeList';
import Loading from '../../components/common/Loading';
import gradeService from '../../services/gradeService';

const GradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const data = await gradeService.getAllGrades();
        setGrades(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching grades:', err);
        setError('Failed to load grades. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const handleDeleteGrade = async (gradeId) => {
    if (window.confirm('Are you sure you want to delete this grade record?')) {
      try {
        await gradeService.deleteGrade(gradeId);
        setGrades(grades.filter(grade => grade.id !== gradeId));
      } catch (err) {
        console.error('Error deleting grade:', err);
        setError('Failed to delete grade. Please try again later.');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Grades</h1>
        <Link to="/grades/new" className="btn btn-success">
          Record New Grade
        </Link>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <GradeList grades={grades} onDelete={handleDeleteGrade} />
    </Container>
  );
};

export default GradesPage;
