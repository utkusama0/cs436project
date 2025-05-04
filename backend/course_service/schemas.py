from pydantic import BaseModel

class CourseBase(BaseModel):
    title: str
    capacity: int

class CourseCreate(CourseBase):
    pass

class CourseUpdate(CourseBase):
    pass

class Course(CourseBase):
    id: int

    class Config:
        from_attributes = True