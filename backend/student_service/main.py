from fastapi import FastAPI, APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.orm import Session
from student_service.schemas import Student as StudentSchema, StudentCreate, StudentUpdate
from student_service.models import Student
from database import get_db

app = FastAPI()
router = APIRouter(tags=["students"])

@router.get("/", response_model=List[StudentSchema])
def list_students(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    # Explicitly convert SQLAlchemy models to dictionaries
    students_data = []
    for student in students:
        students_data.append({
            "student_id": student.student_id,
            "first_name": student.first_name,
            "last_name": student.last_name,
            "email": student.email,
            "date_of_birth": student.date_of_birth,
            "address": student.address,
            "phone": student.phone,
            "enrollment_date": student.enrollment_date,
        })
    return students_data

@router.post("/", response_model=StudentSchema, status_code=status.HTTP_201_CREATED)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    db_student = Student(**student.model_dump())
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
    for key, value in student.model_dump(exclude_unset=True).items():
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

# Mount the router
app.include_router(router)