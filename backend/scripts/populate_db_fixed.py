#!/usr/bin/env python3
import psycopg2
from faker import Faker
import random

# Direct database connection (no SQLAlchemy complexity)
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'student_management',
    'user': 'postgres',
    'password': '12345678'
}

fake = Faker()

def get_connection():
    return psycopg2.connect(**DB_CONFIG)

def populate_database():
    print("Starting database population...")
    
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        # Clear existing data
        print("Clearing existing data...")
        cursor.execute("DELETE FROM grades")
        cursor.execute("DELETE FROM students") 
        cursor.execute("DELETE FROM courses")
        conn.commit()
        
        # Generate and insert courses
        print("Generating courses...")
        departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 
                      'Engineering', 'Business', 'Economics', 'Psychology', 'History']
        
        courses_data = []
        for _ in range(50):
            course_code = f"{random.choice(departments)[:3].upper()}{random.randint(100, 999)}"
            name = fake.catch_phrase()
            department = random.choice(departments)
            credits = random.randint(3, 6)
            description = fake.text(max_nb_chars=200)
            courses_data.append((course_code, name, department, credits, description))
        
        cursor.executemany(
            "INSERT INTO courses (course_code, name, department, credits, description) VALUES (%s, %s, %s, %s, %s)",
            courses_data
        )
        conn.commit()
        print(f"Added {len(courses_data)} courses")
        
        # Generate and insert students
        print("Generating students...")
        students_data = []
        for i in range(250):
            student_id = f"S{10000 + i}"
            first_name = fake.first_name()
            last_name = fake.last_name()
            email = fake.unique.email()
            date_of_birth = fake.date_of_birth(minimum_age=18, maximum_age=30)
            address = fake.address()
            phone = fake.numerify(text='###-###-####')
            enrollment_date = fake.date_between(start_date='-4y', end_date='today')
            students_data.append((student_id, first_name, last_name, email, date_of_birth, address, phone, enrollment_date))
        
        cursor.executemany(
            "INSERT INTO students (student_id, first_name, last_name, email, date_of_birth, address, phone, enrollment_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            students_data
        )
        conn.commit()
        print(f"Added {len(students_data)} students")
        
        # Generate and insert grades
        print("Generating grades...")
        cursor.execute("SELECT student_id FROM students")
        students = [row[0] for row in cursor.fetchall()]
        
        cursor.execute("SELECT course_code FROM courses")
        courses = [row[0] for row in cursor.fetchall()]
        
        grades_data = []
        for student_id in students:
            num_courses = random.randint(1, 2)
            student_courses = random.sample(courses, min(num_courses, len(courses)))
            
            for course_code in student_courses:
                grade = random.randint(0, 100)
                semester = f"{random.choice(['Fall', 'Spring'])} {random.randint(2020, 2024)}"
                grade_date = fake.date_between(start_date='-2y', end_date='today')
                grades_data.append((student_id, course_code, grade, semester, grade_date))
        
        cursor.executemany(
            "INSERT INTO grades (student_id, course_code, grade, semester, date) VALUES (%s, %s, %s, %s, %s)",
            grades_data
        )
        conn.commit()
        print(f"Added {len(grades_data)} grades")
        
        print("✅ Database population completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    populate_database()
