# grade_service/models.py
from sqlalchemy import Column, Integer, String, Date, Text, CheckConstraint
from database import Base

class Grade(Base):
    __tablename__ = "grades"

    # map the Python attr `grade_id` to the DB column `id`
    grade_id = Column('id', Integer, primary_key=True, index=True)
    student_id = Column(String, index=True, nullable=False)
    course_code = Column(String, index=True, nullable=False)
    # map `grade_value` → column `grade`
    grade_value = Column('grade', Integer, nullable=False)
    semester = Column(String, nullable=False)
    # map `grade_date` → column `date`
    grade_date = Column('date', Date, nullable=False)

    __table_args__ = (
        CheckConstraint('grade >= 0 AND grade <= 100', name='check_grade_range'),
    )


