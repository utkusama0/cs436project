import json
from typing import Any

def demo_info(request: Any):
    """
    A simple Google Cloud Function that returns demo project info.
    """
    info: dict[str, Any] = {
        "project": "Student Management System",
        "author": "Utku Dursunoglu",
        "date": "2025-05-21",
        "description": "A cloud-native student/course/grade management platform.",
        "endpoints": [
            "/students", "/courses", "/grades", "/api/grades/by-student/{student_id}"
        ]
    }
    return (json.dumps(info), 200, {'Content-Type': 'application/json'})
