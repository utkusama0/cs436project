from sqlalchemy import Column, Integer, String, Date, ForeignKey, CheckConstraint
from database import Base

class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, index=True)
    course_code = Column(String, index=True)
    grade_value = Column(Integer)
    semester = Column(String)
    grade_date = Column(Date)

    __table_args__ = (
        CheckConstraint('grade_value >= 0 AND grade_value <= 100', name='check_grade_range'),
    )
# grade_service/models.py
from sqlalchemy import Column, String, Integer, Text
from database import Base

class Course(Base):
    __tablename__ = "courses"
    course_code = Column(String(10), primary_key=True)
    name        = Column(String(100), nullable=False)
    credits     = Column(Integer, nullable=False)
    department  = Column(String(50), nullable=False)
    description = Column(Text)
