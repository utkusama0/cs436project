from pydantic import BaseModel

class GradeBase(BaseModel):
    student_id: int
    course_id: int
    grade: str

class GradeCreate(GradeBase):
    pass

class GradeUpdate(GradeBase):
    pass

class Grade(GradeBase):
    id: int

    class Config:
        from_attributes = True