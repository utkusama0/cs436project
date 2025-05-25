# grade_service/schemas.py
from pydantic import BaseModel
from datetime import date as DateType
from typing import Optional

class GradeBase(BaseModel):
    student_id: str
    course_code: str
    grade: int  # Changed from grade_value to grade
    semester: str
    date: DateType  # Changed from grade_date to date

class GradeCreate(GradeBase):
    pass

class GradeUpdate(BaseModel):
    grade: Optional[int] = None  # Changed from grade_value to grade
    semester: Optional[str] = None
    date: Optional[DateType] = None  # Changed from grade_date to date

# Student schema for nested data
class StudentDetails(BaseModel):
    student_id: str
    first_name: str
    last_name: str
    email: str
    
    class Config:
        orm_mode = True

# Course schema for nested data  
class CourseDetails(BaseModel):
    course_code: str
    name: str  # Changed from course_name to name for consistency
    credits: int
    department: str
    description: Optional[str] = None

    class Config:
        orm_mode = True

class GradeSchema(GradeBase):
    grade_id: int
    student: Optional[StudentDetails] = None  # Add nested student data
    course: Optional[CourseDetails] = None    # Add nested course data

    class Config:
        orm_mode = True

# Schema for transcript entries (keeping existing for compatibility)
class TranscriptEntry(BaseModel):
    grade_id: int
    semester: str
    grade: int  # Changed from grade_value to grade
    date: DateType  # Changed from grade_date to date
    course: CourseDetails

    class Config:
        orm_mode = True