from fastapi import FastAPI, APIRouter, HTTPException, status
from typing import List
from course_service.schemas import Course, CourseCreate, CourseUpdate
from course_service.models import CourseModel

app = FastAPI(title="Course Service")
router = APIRouter(prefix="/courses", tags=["courses"])

@router.get("/", response_model=List[Course])
def list_courses():
    return CourseModel.all()

@router.post("/", response_model=Course, status_code=status.HTTP_201_CREATED)
def create_course(course: CourseCreate):
    return CourseModel.create(course.dict())

@router.get("/{course_id}", response_model=Course)
def get_course(course_id: int):
    course = CourseModel.get(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.put("/{course_id}", response_model=Course)
def update_course(course_id: int, course: CourseUpdate):
    updated = CourseModel.update(course_id, course.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Course not found")
    return updated

@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(course_id: int):
    if not CourseModel.delete(course_id):
        raise HTTPException(status_code=404, detail="Course not found")
    return

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(router)

