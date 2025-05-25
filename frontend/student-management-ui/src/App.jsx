import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/students/StudentsPage';
import StudentDetailPage from './pages/students/StudentDetailPage';
import StudentEditPage from './pages/students/StudentEditPage';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
import CourseEditPage from './pages/courses/CourseEditPage';
import GradesPage from './pages/grades/GradesPage';
import GradeEditPage from './pages/grades/GradeEditPage';
import TranscriptPage from './pages/grades/TranscriptPage';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <Container className="flex-grow-1 my-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
            {/* Student Routes */}
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/students/edit/:new" element={<StudentEditPage />} />
            <Route path="/students/:studentId" element={<StudentDetailPage />} />
            <Route path="/students/:studentId/edit" element={<StudentEditPage />} />
            
            {/* Course Routes */}
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/edit/:new" element={<CourseEditPage />} />
            <Route path="/courses/:courseCode" element={<CourseDetailPage />} />
            <Route path="/courses/:courseCode/edit" element={<CourseEditPage />} />
            
            {/* Grade Routes */}
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/grades/edit/:new" element={<GradeEditPage />} />
            <Route path="/grades/:gradeId/edit" element={<GradeEditPage />} />
            <Route path="/transcript" element={<TranscriptPage />} />
          </Routes>
        </Container>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
