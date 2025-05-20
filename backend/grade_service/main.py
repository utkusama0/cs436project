from fastapi import FastAPI, APIRouter, HTTPException, status, Depends, Query
from typing import List , Optional
from sqlalchemy.orm import Session
from .schemas import Grade as GradeSchema, GradeCreate, GradeUpdate
from .models import Grade
from database import get_db
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
router = APIRouter()

@router.get("/", response_model=List[GradeSchema])
def list_grades(
    student_id: Optional[str] = Query(None),
    course_code: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    try:
        query = db.query(Grade)
        if student_id:
            query = query.filter(Grade.student_id == student_id)
        if course_code:
            query = query.filter(Grade.course_code == course_code)
        grades = query.all()
        grades_data = []
        for grade in grades:
            grades_data.append({
                "grade_id": grade.grade_id,
                "student_id": grade.student_id,
                "course_code": grade.course_code,
                "semester": grade.semester,
                "grade_value": grade.grade_value,
                "grade_date": grade.grade_date,
            })
        return grades_data
    except Exception as e:
        logger.error(f"Error listing grades: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/", response_model=GradeSchema, status_code=status.HTTP_201_CREATED)
def create_grade(grade: GradeCreate, db: Session = Depends(get_db)):
    try:
        db_grade = Grade(**grade.dict())
        db.add(db_grade)
        db.commit()
        db.refresh(db_grade)
        return db_grade
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating grade: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{grade_id}", response_model=GradeSchema)
def get_grade(grade_id: int, db: Session = Depends(get_db)):
    try:
        grade = db.query(Grade).filter(Grade.grade_id == grade_id).first()
        if not grade:
            raise HTTPException(status_code=404, detail="Grade not found")
        return grade
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting grade: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{grade_id}", response_model=GradeSchema)
def update_grade(grade_id: int, grade: GradeUpdate, db: Session = Depends(get_db)):
    try:
        db_grade = db.query(Grade).filter(Grade.grade_id == grade_id).first()
        if not db_grade:
            raise HTTPException(status_code=404, detail="Grade not found")
        
        update_data = grade.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_grade, key, value)
        
        db.commit()
        db.refresh(db_grade)
        return db_grade
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating grade: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_grade(grade_id: int, db: Session = Depends(get_db)):
    try:
        grade = db.query(Grade).filter(Grade.grade_id == grade_id).first()
        if not grade:
            raise HTTPException(status_code=404, detail="Grade not found")
        db.delete(grade)
        db.commit()
        return
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting grade: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Mount the router
app.include_router(router, prefix="/grades", tags=["grades"])