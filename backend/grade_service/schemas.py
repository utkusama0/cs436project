from pydantic import BaseModel
from datetime import date
from typing import Optional

class GradeBase(BaseModel):
    student_id: str
    course_code: str
    grade_value: int
    semester: str
    grade_date: date

class GradeCreate(GradeBase):
    pass

class GradeUpdate(BaseModel):
    grade_value: Optional[int] = None
    semester: Optional[str] = None
    grade_date: Optional[date] = None

class Grade(GradeBase):
    grade_id: int

    class Config:
        orm_mode = True

# New schema for Course details within a transcript entry
class CourseDetails(BaseModel):
    course_code: str
    course_name: str # Assuming 'name' in model maps to 'course_name' in schema/frontend
    credits: int
    department: str
    description: Optional[str] = None

    class Config:
        orm_mode = True

# New schema for a single transcript entry (Grade with nested Course details)
class TranscriptEntry(BaseModel):
    grade_id: int
    semester: str
    grade_value: int # Renamed to avoid conflict with nested course grade if any
    grade_date: date # Renamed for clarity
    course: CourseDetails

    class Config:
        orm_mode = True