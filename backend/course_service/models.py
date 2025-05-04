from sqlalchemy import Column, String, Integer, Text
from database import Base

class Course(Base):
    __tablename__ = "courses"

    course_code = Column(String(10), primary_key=True)
    name = Column(String(100), nullable=False)
    department = Column(String(50), nullable=False)
    credits = Column(Integer, nullable=False)
    description = Column(Text)