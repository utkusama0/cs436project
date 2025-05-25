# grade_service/models.py
from sqlalchemy import Column, Integer, String, Date, Text, CheckConstraint, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Grade(Base):
    __tablename__ = "grades"

    # map the Python attr `grade_id` to the DB column `id`
    grade_id = Column('id', Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey('students.student_id'), index=True, nullable=False)
    course_code = Column(String, ForeignKey('courses.course_code'), index=True, nullable=False)
    # map `grade_value` → column `grade`
    grade_value = Column('grade', Integer, nullable=False)
    semester = Column(String, nullable=False)
    # map `grade_date` → column `date`
    grade_date = Column('date', Date, nullable=False)

    # Relationships - using string references to avoid circular imports
    student = relationship("Student", foreign_keys=[student_id], lazy='select')
    course = relationship("Course", foreign_keys=[course_code], lazy='select')

    __table_args__ = (
        CheckConstraint('grade >= 0 AND grade <= 100', name='check_grade_range'),
    )

# Define local Student and Course classes for relationships
class Student(Base):
    __tablename__ = "students"
    student_id = Column(String(10), primary_key=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    address = Column(Text)
    phone = Column(String(20))
    enrollment_date = Column(Date, nullable=False)

class Course(Base):
    __tablename__ = "courses"
    course_code = Column(String(10), primary_key=True)
    name = Column(String(100), nullable=False)
    department = Column(String(50), nullable=False)
    credits = Column(Integer, nullable=False)
    description = Column(Text)


