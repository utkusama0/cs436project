import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Card, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { formatGrade } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import studentService from '../../services/studentService';
import gradeService from '../../services/gradeService';

const TranscriptPage = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [semester, setSemester] = useState('');
  const [semesters, setSemesters] = useState([]);

  const handleFetchTranscript = async (e) => {
    e.preventDefault();
    
    if (!studentId) {
      setError('Please enter a student ID');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch student and grades in parallel
      const [student, studentGrades] = await Promise.all([
        studentService.getStudentById(studentId),
        gradeService.getGradesByStudentId(studentId)
      ]);
      
      setStudentData(student);
      setGrades(studentGrades);
      
      // Extract unique semesters for filtering
      const uniqueSemesters = [...new Set(studentGrades.map(g => g.semester))];
      setSemesters(uniqueSemesters.sort());
      
      // Reset semester filter
      setSemester('');
    } catch (err) {
      console.error('Error fetching transcript:', err);
      setError('Student not found or error fetching data');
      setStudentData(null);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTranscript = () => {
    if (!studentData || grades.length === 0) return;
    
    // Create a printable version
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups for this site to download the transcript.');
      return;
    }
    
    const filteredGrades = semester ? grades.filter(g => g.semester === semester) : grades;
    
    // Calculate GPA
    let totalPoints = 0;
    let totalCredits = 0;
    
    filteredGrades.forEach(grade => {
      if (grade.grade !== null && grade.course?.credits) {
        const credits = grade.course.credits;
        let gradePoints;
        
        if (grade.grade >= 90) gradePoints = 4.0;
        else if (grade.grade >= 80) gradePoints = 3.0;
        else if (grade.grade >= 70) gradePoints = 2.0;
        else if (grade.grade >= 60) gradePoints = 1.0;
        else gradePoints = 0.0;
        
        totalPoints += gradePoints * credits;
        totalCredits += credits;
      }
    });
    
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 'N/A';
    
    // Create HTML content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Academic Transcript - ${studentData.first_name} ${studentData.last_name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .student-info { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; }
          .summary { margin-top: 30px; }
          .footer { margin-top: 50px; text-align: center; font-size: 0.8em; }
          @media print {
            .no-print { display: none; }
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Official Academic Transcript</h1>
          <h3>Student Management System</h3>
        </div>
        
        <div class="student-info">
          <h2>${studentData.first_name} ${studentData.last_name}</h2>
          <p><strong>Student ID:</strong> ${studentData.student_id}</p>
          <p><strong>Email:</strong> ${studentData.email}</p>
          <p><strong>Enrollment Date:</strong> ${new Date(studentData.enrollment_date).toLocaleDateString()}</p>
          ${semester ? `<p><strong>Semester:</strong> ${semester}</p>` : ''}
        </div>
        
        <h3>Course Grades</h3>
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Semester</th>
              <th>Credits</th>
              <th>Grade</th>
              <th>Letter</th>
            </tr>
          </thead>
          <tbody>
            ${filteredGrades.map(g => `
              <tr>
                <td>${g.course_code}</td>
                <td>${g.course?.name || 'N/A'}</td>
                <td>${g.semester}</td>
                <td>${g.course?.credits || 'N/A'}</td>
                <td>${g.grade !== null ? g.grade : 'Not graded'}</td>
                <td>${g.grade !== null ? formatGrade(g.grade) : 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="summary">
          <h3>Summary</h3>
          <p><strong>GPA:</strong> ${gpa}</p>
          <p><strong>Total Credits:</strong> ${totalCredits}</p>
          <p><strong>Date Generated:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="footer">
          <p>This is an official transcript from the Student Management System.</p>
        </div>
        
        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()">Print Transcript</button>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const filteredGrades = semester ? grades.filter(g => g.semester === semester) : grades;

  return (
    <Container className="my-4">
      <h1>Student Transcript</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleFetchTranscript}>
            <Row className="align-items-end">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Enter Student ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g., S12345"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Fetch Transcript'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      {loading ? (
        <Loading />
      ) : studentData && grades.length > 0 ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>
              {studentData.first_name} {studentData.last_name}'s Transcript
            </h2>
            
            <div className="d-flex align-items-center">
              <Form.Select 
                value={semester} 
                onChange={(e) => setSemester(e.target.value)}
                className="me-2"
                style={{ width: '180px' }}
              >
                <option value="">All Semesters</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </Form.Select>
              
              <Button 
                variant="outline-primary" 
                onClick={handleDownloadTranscript}
              >
                Download Transcript
              </Button>
            </div>
          </div>
          
          <Card>
            <Card.Body>
              <h3>Student Information</h3>
              <p><strong>Student ID:</strong> {studentData.student_id}</p>
              <p><strong>Email:</strong> {studentData.email}</p>
              <p><strong>Enrollment Date:</strong> {new Date(studentData.enrollment_date).toLocaleDateString()}</p>
              
              <h3 className="mt-4">Courses and Grades</h3>
              {filteredGrades.length === 0 ? (
                <p>No grades available for the selected semester.</p>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Semester</th>
                      <th>Credits</th>
                      <th>Grade</th>
                      <th>Letter</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGrades.map(grade => (
                      <tr key={`${grade.course_code}-${grade.semester}`}>
                        <td>{grade.course_code}</td>
                        <td>{grade.course?.name || 'N/A'}</td>
                        <td>{grade.semester}</td>
                        <td>{grade.course?.credits || 'N/A'}</td>
                        <td>{grade.grade !== null ? grade.grade : 'Not graded'}</td>
                        <td>{grade.grade !== null ? formatGrade(grade.grade) : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              
              {/* Calculate and display GPA */}
              {filteredGrades.length > 0 && (() => {
                let totalPoints = 0;
                let totalCredits = 0;
                
                filteredGrades.forEach(grade => {
                  if (grade.grade !== null && grade.course?.credits) {
                    const credits = grade.course.credits;
                    let gradePoints;
                    
                    if (grade.grade >= 90) gradePoints = 4.0;
                    else if (grade.grade >= 80) gradePoints = 3.0;
                    else if (grade.grade >= 70) gradePoints = 2.0;
                    else if (grade.grade >= 60) gradePoints = 1.0;
                    else gradePoints = 0.0;
                    
                    totalPoints += gradePoints * credits;
                    totalCredits += credits;
                  }
                });
                
                const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 'N/A';
                
                return (
                  <div className="mt-4">
                    <h4>Summary</h4>
                    <p><strong>GPA:</strong> {gpa}</p>
                    <p><strong>Total Credits:</strong> {totalCredits}</p>
                  </div>
                );
              })()}
            </Card.Body>
          </Card>
        </>
      ) : studentData ? (
        <div className="alert alert-info">
          No grades found for this student.
        </div>
      ) : null}
    </Container>
  );
};

export default TranscriptPage;
