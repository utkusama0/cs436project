from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class StudentBase(BaseModel):
    student_id: str
    first_name: str
    last_name: str
    email: EmailStr
    date_of_birth: date
    address: Optional[str] = None
    phone: Optional[str] = None
    enrollment_date: date

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    phone: Optional[str] = None

class Student(StudentBase):
    class Config:
        from_attributes = True