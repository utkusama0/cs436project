from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict
from sqlalchemy.orm import Session
from schemas import Grade as GradeSchema, GradeCreate, GradeUpdate
from models import Grade
from database import get_db

router = APIRouter()

@router.get("/health", response_model=Dict[str, str])
def health_check():
    """Health check endpoint for Kubernetes readiness probes"""
    return {"status": "healthy"}

@router.get("/", response_model=List[GradeSchema])
def list_grades(db: Session = Depends(get_db)):
    return db.query(Grade).all()

@router.post("/", response_model=GradeSchema, status_code=status.HTTP_201_CREATED)
def create_grade(grade: GradeCreate, db: Session = Depends(get_db)):
    db_grade = Grade(**grade.dict())
    db.add(db_grade)
    db.commit()
    db.refresh(db_grade)
    return db_grade

@router.get("/{grade_id}", response_model=GradeSchema)
def get_grade(grade_id: int, db: Session = Depends(get_db)):
    grade = db.query(Grade).filter(Grade.id == grade_id).first()
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    return grade

@router.put("/{grade_id}", response_model=GradeSchema)
def update_grade(grade_id: int, grade: GradeUpdate, db: Session = Depends(get_db)):
    db_grade = db.query(Grade).filter(Grade.id == grade_id).first()
    if not db_grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    for key, value in grade.dict(exclude_unset=True).items():
        setattr(db_grade, key, value)
    db.commit()
    db.refresh(db_grade)
    return db_grade

@router.delete("/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_grade(grade_id: int, db: Session = Depends(get_db)):
    grade = db.query(Grade).filter(Grade.id == grade_id).first()
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    db.delete(grade)
    db.commit()
    return