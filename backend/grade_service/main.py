from fastapi import FastAPI, APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.orm import Session, joinedload
from .schemas import Grade as GradeSchema, GradeCreate, GradeUpdate, TranscriptEntry, CourseDetails
from .models import Grade
from database import get_db
from ..course_service.models import Course

app = FastAPI()
router = APIRouter()

@router.get("/", response_model=List[GradeSchema])
def list_grades(db: Session = Depends(get_db)):
    grades = db.query(Grade).all()
    # Explicitly convert SQLAlchemy models to dictionaries
    grades_data = []
    for grade in grades:
        grades_data.append({
            "id": grade.id,
            "student_id": grade.student_id,
            "course_code": grade.course_code,
            "semester": grade.semester,
            "grade": grade.grade,
            "date": grade.date,
        })
    return grades_data

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

# New endpoint to fetch student transcript
@router.get("/student/{student_id}/transcript", response_model=List[TranscriptEntry])
def get_student_transcript(student_id: str, db: Session = Depends(get_db)):
    transcript_data = (
        db.query(Grade, Course)
        .join(Course, Grade.course_code == Course.course_code)
        .filter(Grade.student_id == student_id)
        .all()
    )

    if not transcript_data:
        # Optionally return 404 if student or grades not found
        # raise HTTPException(status_code=404, detail="Transcript data not found for this student")
        return [] # Return empty list if no grades found

    # Structure the data for the response (will be based on the new schema)
    formatted_transcript = []
    for grade, course in transcript_data:
        formatted_transcript.append(TranscriptEntry(
            grade_id=grade.id,
            semester=grade.semester,
            grade_value=grade.grade,
            grade_date=grade.date,
            course=CourseDetails(
                course_code=course.course_code,
                course_name=course.name,
                credits=course.credits,
                department=course.department,
                description=course.description,
            )
        ))

    return formatted_transcript

# Mount the router
app.include_router(router, prefix="/grades", tags=["grades"])