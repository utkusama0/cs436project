# Student Management System Frontend

This document outlines the structure and components of the Student Management System frontend application.

## Project Structure

```
student-management-ui/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.js
│   │   │   ├── Sidebar.js
│   │   │   ├── Footer.js
│   │   │   └── Loading.js
│   │   ├── students/
│   │   │   ├── StudentList.js
│   │   │   ├── StudentCard.js
│   │   │   ├── StudentForm.js
│   │   │   ├── StudentProfile.js
│   │   │   └── GradeTable.js
│   │   ├── courses/
│   │   │   ├── CourseList.js
│   │   │   ├── CourseCard.js
│   │   │   ├── CourseForm.js
│   │   │   └── CourseDetail.js
│   │   └── grades/
│   │       ├── GradeForm.js
│   │       └── GradeReport.js
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── students/
│   │   │   ├── StudentsPage.js
│   │   │   ├── StudentDetailPage.js
│   │   │   └── StudentEditPage.js
│   │   ├── courses/
│   │   │   ├── CoursesPage.js
│   │   │   ├── CourseDetailPage.js
│   │   │   └── CourseEditPage.js
│   │   └── grades/
│   │       └── GradesPage.js
│   ├── services/
│   │   ├── studentService.js
│   │   ├── courseService.js
│   │   └── gradeService.js
│   ├── utils/
│   │   ├── api.js
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.js
│   └── index.js
└── public/
    └── index.html
```

## Features to Implement

### 1. Admin Dashboard
- Overview of students, courses, and grades
- Quick access to key functions

### 2. Students Dashboard
- Student profile
  - View profile
  - View grades (filtered by term)
  - Edit profile (with email notification)
  - Download transcript
- Filter and search list of students

### 3. Course Dashboard
- Course list with filtering
- Course details page
  - Course information
  - List of students taking the course (by term)

## Dependencies to Install

```
// Core dependencies
npm install react-router-dom axios

// UI dependencies
npm install bootstrap react-bootstrap

// Optional utilities
npm install moment react-to-pdf chart.js react-chartjs-2
```

## Running the Application

1. Start the backend server:
```
cd c:\okul\cs436\project\cs436project\backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. Start the frontend development server:
```
cd c:\okul\cs436\project\cs436project\frontend\student-management-ui
npm start
```

## API Endpoints

See the `api-config.js` file for details on available endpoints.
