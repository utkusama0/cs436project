from faker import Faker
import random
from datetime import datetime
import sys
from pathlib import Path
from sqlalchemy.orm import Session
from sqlalchemy import text

# Add the parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))

from database import SessionLocal, engine, Base
from student_service.models import Student
from course_service.models import Course
from grade_service.models import Grade

fake = Faker()

def generate_courses(num_courses=50):
    courses = []
    departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 
                  'Engineering', 'Business', 'Economics', 'Psychology', 'History']
    
    for _ in range(num_courses):
        course = Course(
            course_code=f"{random.choice(departments)[:3].upper()}{random.randint(100, 999)}",
            name=fake.catch_phrase(),
            department=random.choice(departments),
            credits=random.randint(3, 6),
            description=fake.text(max_nb_chars=200)
        )
        courses.append(course)
    
    return courses

def generate_students(num_students=5000):
    students = []
    for i in range(num_students):
        student = Student(
            student_id=f"S{10000 + i}",  # Sequential, unique IDs
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=fake.unique.email(),
            date_of_birth=fake.date_of_birth(minimum_age=18, maximum_age=30),
            address=fake.address(),
            phone=fake.phone_number(),
            enrollment_date=fake.date_between(start_date='-4y', end_date='today')
        )
        students.append(student)
    return students

def generate_grades(students, courses):
    grades = []
    for student in students:
        # Each student takes 5-8 random courses
        num_courses = random.randint(5, 8)
        student_courses = random.sample(courses, num_courses)
        
        for course in student_courses:
            grade = Grade(
                student_id=student.student_id,
                course_code=course.course_code,
                grade=random.randint(0, 100),
                semester=f"{random.choice(['Fall', 'Spring'])} {random.randint(2020, 2024)}",
                date=fake.date_between(start_date='-2y', end_date='today')
            )
            grades.append(grade)
    
    return grades

def populate_database():
    db = SessionLocal()
    try:
        # Truncate all tables to avoid duplicate key errors
        db.execute(text('TRUNCATE TABLE grades, students, courses RESTART IDENTITY CASCADE;'))
        db.commit()
        print("Tables truncated.")

        print("Generating courses...")
        courses = generate_courses()
        db.add_all(courses)
        db.commit()
        print(f"Added {len(courses)} courses")
        fake.unique.clear()
        print("Generating students...")
        students = generate_students()
        db.add_all(students)
        db.commit()
        print(f"Added {len(students)} students")

        print("Generating grades...")
        grades = generate_grades(students, courses)
        db.add_all(grades)
        db.commit()
        print(f"Added {len(grades)} grades")

    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting database population...")
    populate_database()
    print("Database population completed!")