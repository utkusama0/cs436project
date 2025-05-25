from fastapi import FastAPI, APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.orm import Session
from course_service.schemas import Course as CourseSchema, CourseCreate, CourseUpdate
from course_service.models import Course
from database import get_db

app = FastAPI()
router = APIRouter(tags=["courses"])

@router.get("/", response_model=List[CourseSchema])
def list_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    # Explicitly convert SQLAlchemy models to dictionaries
    courses_data = []
    for course in courses:
        courses_data.append({
            "course_code": course.course_code,
            "name": course.name,
            "description": course.description,
            "credits": course.credits,
            "department": course.department,
        })
    return courses_data

@router.post("/", response_model=CourseSchema, status_code=status.HTTP_201_CREATED)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    db_course = Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@router.get("/{course_code}", response_model=CourseSchema)
def get_course(course_code: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.course_code == course_code).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.put("/{course_code}", response_model=CourseSchema)
def update_course(course_code: str, course: CourseUpdate, db: Session = Depends(get_db)):
    db_course = db.query(Course).filter(Course.course_code == course_code).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    for key, value in course.dict(exclude_unset=True).items():
        setattr(db_course, key, value)
    db.commit()
    db.refresh(db_course)
    return db_course

@router.delete("/{course_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(course_code: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.course_code == course_code).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    return

# Mount the router
app.include_router(router)

@app.get("/health")
async def health_check():
    """Health check endpoint for Kubernetes probes"""
    return {"status": "healthy", "service": "courses"}