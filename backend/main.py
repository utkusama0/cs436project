from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from student_service.main import router as student_router
from course_service.main import router as course_router
from grade_service.main import router as grade_router

app = FastAPI(title="Student Management System")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(student_router, prefix="/students", tags=["students"])
app.include_router(course_router, prefix="/courses", tags=["courses"])
app.include_router(grade_router, prefix="/grades", tags=["grades"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 