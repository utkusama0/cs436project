# grade_service/main.py
from fastapi import FastAPI, APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
import logging

from grade_service.models import Grade
from grade_service.schemas import GradeSchema, GradeCreate, GradeUpdate
from database import get_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
router = APIRouter(tags=["grades"])

def grade_to_dict(grade_obj):
    """Convert Grade SQLAlchemy object to dictionary with proper field names"""
    result = {
        "grade_id": grade_obj.grade_id,
        "student_id": grade_obj.student_id,
        "course_code": grade_obj.course_code,
        "grade": grade_obj.grade_value,  # Map grade_value to grade
        "semester": grade_obj.semester,
        "date": grade_obj.grade_date,    # Map grade_date to date
    }
    
    # Add student details if available
    if hasattr(grade_obj, 'student') and grade_obj.student:
        result["student"] = {
            "student_id": grade_obj.student.student_id,
            "first_name": grade_obj.student.first_name,
            "last_name": grade_obj.student.last_name,
            "email": grade_obj.student.email,
        }
    
    # Add course details if available
    if hasattr(grade_obj, 'course') and grade_obj.course:
        result["course"] = {
            "course_code": grade_obj.course.course_code,
            "name": grade_obj.course.name,
            "credits": grade_obj.course.credits,
            "department": grade_obj.course.department,
            "description": grade_obj.course.description,
        }
    
    return result

@router.get("/", response_model=List[GradeSchema])
def list_grades(
    student_id: Optional[str] = Query(None),
    course_code: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    try:
        q = db.query(Grade).options(
            joinedload(Grade.student),
            joinedload(Grade.course)
        )
        if student_id:
            q = q.filter(Grade.student_id == student_id)
        if course_code:
            q = q.filter(Grade.course_code == course_code)
        
        grades = q.all()
        return [grade_to_dict(grade) for grade in grades]
    except Exception as e:
        logger.error(f"Error listing grades: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/", response_model=GradeSchema, status_code=status.HTTP_201_CREATED)
def create_grade(grade_in: GradeCreate, db: Session = Depends(get_db)):
    try:
        # Map incoming field names to model field names
        grade_data = grade_in.model_dump()
        if 'grade' in grade_data:
            grade_data['grade_value'] = grade_data.pop('grade')
        if 'date' in grade_data:
            grade_data['grade_date'] = grade_data.pop('date')
            
        new_grade = Grade(**grade_data)
        db.add(new_grade)
        db.commit()
        db.refresh(new_grade)
        
        # Load relationships
        db.query(Grade).options(
            joinedload(Grade.student),
            joinedload(Grade.course)
        ).filter(Grade.grade_id == new_grade.grade_id).first()
        
        return grade_to_dict(new_grade)
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating grade: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{grade_id}", response_model=GradeSchema)
def get_grade(grade_id: int, db: Session = Depends(get_db)):
    try:
        g = db.query(Grade).options(
            joinedload(Grade.student),
            joinedload(Grade.course)
        ).filter(Grade.grade_id == grade_id).first()
        
        if not g:
            raise HTTPException(status_code=404, detail="Grade not found")
        return grade_to_dict(g)
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
        
        # Map incoming field names to model field names
        update_data = grade_in.model_dump(exclude_unset=True)
        if 'grade' in update_data:
            update_data['grade_value'] = update_data.pop('grade')
        if 'date' in update_data:
            update_data['grade_date'] = update_data.pop('date')
        
        for field, value in update_data.items():
            setattr(g, field, value)
        db.commit()
        db.refresh(g)
        
        # Load relationships
        g = db.query(Grade).options(
            joinedload(Grade.student),
            joinedload(Grade.course)
        ).filter(Grade.grade_id == grade_id).first()
        
        return grade_to_dict(g)
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

@router.get("/student/{student_id}/transcript", response_model=List[GradeSchema])
def get_student_transcript(student_id: str, db: Session = Depends(get_db)):
    """Get all grades for a specific student (transcript)"""
    try:
        grades = db.query(Grade).options(
            joinedload(Grade.student),
            joinedload(Grade.course)
        ).filter(Grade.student_id == student_id).all()
        
        return [grade_to_dict(grade) for grade in grades]
    except Exception as e:
        logger.error(f"Error getting transcript for student {student_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

app.include_router(router)
