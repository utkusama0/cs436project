from fastapi import FastAPI, APIRouter, HTTPException, status
from typing import List
from student_service.schemas import Student, StudentCreate, StudentUpdate
from student_service.models import StudentModel

app = FastAPI(title="Student Service")
router = APIRouter(prefix="/students", tags=["students"])

@router.get("/", response_model=List[Student])
def list_students():
    return StudentModel.all()

@router.post("/", response_model=Student, status_code=status.HTTP_201_CREATED)
def create_student(student: StudentCreate):
    return StudentModel.create(student.dict())

@router.get("/{student_id}", response_model=Student)
def get_student(student_id: int):
    student = StudentModel.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/{student_id}", response_model=Student)
def update_student(student_id: int, student: StudentUpdate):
    updated = StudentModel.update(student_id, student.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Student not found")
    return updated

@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int):
    if not StudentModel.delete(student_id):
        raise HTTPException(status_code=404, detail="Student not found")
    return

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(router)

