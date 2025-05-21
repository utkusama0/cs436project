import json
import requests
from typing import Any

def demo_info(request: Any):
    """
    Google Cloud Function: Returns real student info from your backend if student_id is provided as a query param.
    Otherwise, returns project info.
    """
    # Get student_id from query params
    student_id = None
    if request.method == "GET":
        student_id = request.args.get("student_id")
    elif request.method == "POST":
        try:
            data = request.get_json(silent=True)
            if data:
                student_id = data.get("student_id")
        except Exception:
            pass

    if student_id:
        # Call your backend API to get real student info
        # Update the URL below to your actual backend endpoint
        backend_url = f"https://34.29.190.192/api/students/{student_id}"
        try:
            resp = requests.get(backend_url, timeout=5)
            if resp.status_code == 200:
                return (resp.text, 200, {'Content-Type': 'application/json'})
            else:
                return (json.dumps({"error": f"Backend returned {resp.status_code}", "detail": resp.text}), resp.status_code, {'Content-Type': 'application/json'})
        except Exception as e:
            return (json.dumps({"error": "Failed to contact backend", "detail": str(e)}), 500, {'Content-Type': 'application/json'})

    # Default: return project info
    info = {
        "project": "Student Management System",
        "author": "Utku Dursunoglu",
        "description": "A cloud-native student/course/grade management platform.",
        "endpoints": [
            "/students", "/courses", "/grades", "/api/grades/by-student/{student_id}",
            "?student_id=... (cloud function)"
        ]
    }
    return (json.dumps(info), 200, {'Content-Type': 'application/json'})