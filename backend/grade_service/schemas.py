from pydantic import BaseModel
from datetime import date
from typing import Optional

class GradeBase(BaseModel):
    student_id: str
    course_code: str
    grade: int
    semester: str
    date: date

class GradeCreate(GradeBase):
    pass

class GradeUpdate(BaseModel):
    grade: Optional[int] = None
    semester: Optional[str] = None
    date: Optional[date] = None

class Grade(GradeBase):
    id: int

    class Config:
        from_attributes = True