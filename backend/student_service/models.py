from sqlalchemy import Column, String, Date, Text
from database import Base

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