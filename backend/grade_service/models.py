from sqlalchemy import Column, String, Integer, Date, CheckConstraint
from database import Base

class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True)
    student_id = Column(String(10), nullable=False)
    course_code = Column(String(10), nullable=False)
    grade = Column(Integer, nullable=False)
    semester = Column(String(20), nullable=False)
    date = Column(Date, nullable=False)

    __table_args__ = (
        CheckConstraint('grade >= 0 AND grade <= 100', name='check_grade_range'),
    )