from locust import HttpUser, task, between
import random

class StudentManagementUser(HttpUser):
    wait_time = between(1, 5)  # Wait 1-5 seconds between tasks
    
    def on_start(self):
        """Initialize user session"""
        # Get list of students and courses for later use
        self.students = self.client.get("/students").json()
        self.courses = self.client.get("/courses").json()
    
    @task(3)
    def view_student_list(self):
        """View list of students (high frequency)"""
        self.client.get("/students")
    
    @task(2)
    def view_course_list(self):
        """View list of courses (medium frequency)"""
        self.client.get("/courses")
    
    @task(1)
    def view_student_details(self):
        """View details of a random student (low frequency)"""
        if self.students:
            student = random.choice(self.students)
            self.client.get(f"/students/{student['student_id']}")
    
    @task(1)
    def view_course_details(self):
        """View details of a random course (low frequency)"""
        if self.courses:
            course = random.choice(self.courses)
            self.client.get(f"/courses/{course['course_code']}")
    
    @task(1)
    def view_student_transcript(self):
        """View transcript of a random student (low frequency)"""
        if self.students:
            student = random.choice(self.students)
            self.client.get(f"/grades/student/{student['student_id']}/transcript")
    
    @task(1)
    def generate_pdf_transcript(self):
        """Generate PDF transcript for a random student (low frequency)"""
        if self.students:
            student = random.choice(self.students)
            self.client.post(
                "/generate-transcript",
                json={"student_id": student['student_id']}
            )
    
    @task(1)
    def update_grade(self):
        """Update a grade (low frequency)"""
        if self.students and self.courses:
            student = random.choice(self.students)
            course = random.choice(self.courses)
            grade = random.choice(['A', 'B', 'C', 'D', 'F'])
            
            self.client.put(
                f"/grades/{student['student_id']}/{course['course_code']}",
                json={
                    "grade": grade,
                    "semester": "2024-SPRING"
                }
            ) 