# Student Management System Frontend

This document outlines the structure and components of the Student Management System frontend application.

## Project Structure

```
student-management-ui/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Loading.jsx
│   │   ├── students/
│   │   │   ├── StudentList.jsx
│   │   │   ├── StudentCard.jsx
│   │   │   ├── StudentForm.jsx
│   │   │   ├── StudentProfile.jsx
│   │   │   └── GradeTable.jsx
│   │   ├── courses/
│   │   │   ├── CourseList.jsx
│   │   │   ├── CourseCard.jsx
│   │   │   ├── CourseForm.jsx
│   │   │   └── CourseDetail.jsx
│   │   └── grades/
│   │       ├── GradeForm.jsx
│   │       └── GradeReport.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── students/
│   │   │   ├── StudentsPage.jsx
│   │   │   ├── StudentDetailPage.jsx
│   │   │   └── StudentEditPage.jsx
│   │   ├── courses/
│   │   │   ├── CoursesPage.jsx
│   │   │   ├── CourseDetailPage.jsx
│   │   │   └── CourseEditPage.jsx
│   │   └── grades/
│   │       └── GradesPage.jsx
│   ├── services/
│   │   ├── studentService.js
│   │   ├── courseService.js
│   │   └── gradeService.js
│   ├── utils/
│   │   ├── api-config.js
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.jsx
│   └── main.jsx
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
npm run dev
```

## API Endpoints

See the `utils/api-config.js` file for details on available endpoints.te

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
