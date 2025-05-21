# grade_service/main.py
from fastapi import FastAPI, APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from sqlalchemy.orm import Session
import logging

from grade_service.models import Grade
from grade_service.schemas import GradeSchema, GradeCreate, GradeUpdate
from database import get_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
router = APIRouter(prefix="/api/grades", tags=["grades"])

@router.get("/", response_model=List[GradeSchema])
def list_grades(
    student_id: Optional[str] = Query(None),
    course_code: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    try:
        q = db.query(Grade)
        if student_id:
            q = q.filter(Grade.student_id == student_id)
        if course_code:
            q = q.filter(Grade.course_code == course_code)
        return q.all()  # Pydantic + orm_mode will serialize correctly
    except Exception as e:
        logger.error(f"Error listing grades: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/", response_model=GradeSchema, status_code=status.HTTP_201_CREATED)
def create_grade(grade_in: GradeCreate, db: Session = Depends(get_db)):
    try:
        new_grade = Grade(**grade_in.dict())
        db.add(new_grade)
        db.commit()
        db.refresh(new_grade)
        return new_grade
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating grade: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{grade_id}", response_model=GradeSchema)
def get_grade(grade_id: int, db: Session = Depends(get_db)):
    try:
        g = db.query(Grade).filter(Grade.grade_id == grade_id).first()
        if not g:
            raise HTTPException(status_code=404, detail="Grade not found")
        return g
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting grade: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{grade_id}", response_model=GradeSchema)
def update_grade(grade_id: int, grade_in: GradeUpdate, db: Session = Depends(get_db)):
    try:
        g = db.query(Grade).filter(Grade.grade_id == grade_id).first()
        if not g:
            raise HTTPException(status_code=404, detail="Grade not found")
        for field, value in grade_in.dict(exclude_unset=True).items():
            setattr(g, field, value)
        db.commit()
        db.refresh(g)
        return g
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating grade: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_grade(grade_id: int, db: Session = Depends(get_db)):
    try:
        g = db.query(Grade).filter(Grade.grade_id == grade_id).first()
        if not g:
            raise HTTPException(status_code=404, detail="Grade not found")
        db.delete(g)
        db.commit()
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting grade: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

app.include_router(router)
