from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.orm import Session
from .schemas import Course as CourseSchema, CourseCreate, CourseUpdate
from .models import Course
from database import get_db

router = APIRouter()

@router.get("/", response_model=List[CourseSchema])
def list_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

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