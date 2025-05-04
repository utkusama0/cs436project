import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from student_service.main import router as student_router
from course_service.main import router as course_router
from grade_service.main import router as grade_router

app = FastAPI(
    title="Student Management System",
    description="Combined API for Student, Course, and Grade Management",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include all routers
app.include_router(student_router)
app.include_router(course_router)
app.include_router(grade_router)

@app.get("/health")
def health():
    return {"status": "ok", "services": ["student", "course", "grade"]} 