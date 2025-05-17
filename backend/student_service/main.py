from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict
from sqlalchemy.orm import Session
from schemas import Student as StudentSchema, StudentCreate, StudentUpdate
from models import Student
from database import get_db

router = APIRouter()

@router.get("/health", response_model=Dict[str, str])
def health_check():
    """Health check endpoint for Kubernetes readiness probes"""
    return {"status": "healthy"}

@router.get("/", response_model=List[StudentSchema])
def list_students(db: Session = Depends(get_db)):
    return db.query(Student).all()

@router.post("/", response_model=StudentSchema, status_code=status.HTTP_201_CREATED)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    db_student = Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@router.get("/{student_id}", response_model=StudentSchema)
def get_student(student_id: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/{student_id}", response_model=StudentSchema)
def update_student(student_id: str, student: StudentUpdate, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.student_id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in student.dict(exclude_unset=True).items():
        setattr(db_student, key, value)
    db.commit()
    db.refresh(db_student)
    return db_student

@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return