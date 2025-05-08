-- Create Students Table
CREATE TABLE students (
    student_id VARCHAR(10) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    enrollment_date DATE NOT NULL
);

-- Create Courses Table
CREATE TABLE courses (
    course_code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    credits INTEGER NOT NULL,
    description TEXT
);

-- Create Grades Table
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(10) REFERENCES students(student_id),
    course_code VARCHAR(10) REFERENCES courses(course_code),
    grade INTEGER NOT NULL CHECK (grade >= 0 AND grade <= 100),
    semester VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    UNIQUE(student_id, course_code, semester)
);

-- Create indexes for better performance
CREATE INDEX idx_student_id ON students(student_id);
CREATE INDEX idx_course_code ON courses(course_code);
CREATE INDEX idx_grade_student ON grades(student_id);
CREATE INDEX idx_grade_course ON grades(course_code);