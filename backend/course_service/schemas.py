from pydantic import BaseModel
from typing import Optional

class CourseBase(BaseModel):
    course_code: str
    name: str
    department: str
    credits: int
    description: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    credits: Optional[int] = None
    description: Optional[str] = None

class Course(CourseBase):
    class Config:
        from_attributes = True