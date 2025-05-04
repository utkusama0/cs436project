from fastapi import FastAPI, APIRouter, HTTPException, status
from typing import List
from grade_service.schemas import Grade, GradeCreate, GradeUpdate
from grade_service.models import GradeModel

app = FastAPI(title="Grade Service")
router = APIRouter(prefix="/grades", tags=["grades"])

@router.get("/", response_model=List[Grade])
def list_grades():
    return GradeModel.all()

@router.post("/", response_model=Grade, status_code=status.HTTP_201_CREATED)
def create_grade(grade: GradeCreate):
    return GradeModel.create(grade.dict())

@router.get("/{grade_id}", response_model=Grade)
def get_grade(grade_id: int):
    grade = GradeModel.get(grade_id)
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    return grade

@router.put("/{grade_id}", response_model=Grade)
def update_grade(grade_id: int, grade: GradeUpdate):
    updated = GradeModel.update(grade_id, grade.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Grade not found")
    return updated

@router.delete("/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_grade(grade_id: int):
    if not GradeModel.delete(grade_id):
        raise HTTPException(status_code=404, detail="Grade not found")
    return

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(router)

