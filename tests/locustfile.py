from locust import HttpUser, task, between
import random
from datetime import datetime

class StudentManagementUser(HttpUser):
    wait_time = between(1, 3)  # Wait 1-5 seconds between tasks
    
    def on_start(self):
        """Initialize user session"""
        # Get list of students and courses for later use
        try:
            students_response = self.client.get("/api/students")
            students_response.raise_for_status() # Raise an exception for HTTP errors
            self.students = students_response.json()
        except Exception as e:
            print(f"Failed to get students: {e}")
            self.students = []

        try:
            courses_response = self.client.get("/api/courses")
            courses_response.raise_for_status()
            self.courses = courses_response.json()
        except Exception as e:
            print(f"Failed to get courses: {e}")
            self.courses = []

        try:
            grades_response = self.client.get("/api/grades") # Assuming this endpoint exists
            grades_response.raise_for_status()
            self.grades = grades_response.json()
            if not isinstance(self.grades, list): # Ensure self.grades is a list
                print(f"Warning: /api/grades did not return a list. Received: {type(self.grades)}")
                self.grades = []
        except Exception as e:
            print(f"Failed to get grades: {e}")
            self.grades = []
        
        self.next_student_id_num = 10000 + len(self.students) # For creating new unique student IDs
        self.next_course_code_num = 700 # For creating new unique course codes


    @task(5)
    def load_home_page(self):
        """Load the home page"""
        self.client.get("/")
    
    @task(3)
    def view_student_list(self):
        """View list of students"""
        self.client.get("/api/students")
    
    @task(4)
    def view_course_list(self):
        """View list of courses"""
        self.client.get("/api/courses")
    
    @task(1)
    def view_student_details(self):
        """View details of a random student"""
        if self.students:
            student = random.choice(self.students)
            if student and 'student_id' in student:
                self.client.get(f"/api/students/{student['student_id']}") # Changed to dictionary access
    
    @task(1)
    def view_course_details(self):
        """View details of a random course"""
        if self.courses:
            course = random.choice(self.courses)
            if course and 'course_code' in course:
                self.client.get(f"/api/courses/{course['course_code']}") # Changed to dictionary access

    
    @task(1)
    def view_grades_for_student(self):
        """View grades for a random student"""
        if self.grades:
            grade = random.choice(self.grades)
            # Assuming the grade object has an 'id' key for its own ID
            # The original error was 'grade_id', this now uses 'id'
            if grade and 'id' in grade: 
                self.client.get(f"/api/grades/{grade['id']}") # Changed to dictionary access
            # If you intended to get all grades for the student associated with this grade entry:
            # elif grade and 'student_id' in grade:
            #     self.client.get(f"/api/grades?student_id={grade['student_id']}")
    
    

    