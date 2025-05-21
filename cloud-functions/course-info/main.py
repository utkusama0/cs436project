import json
import requests
from typing import Any

def course_info(request: Any):
    """
    Google Cloud Function: Returns real course info from your backend if course_code is provided as a query param.
    Otherwise, returns a message.
    """
    # Get course_code from query params
    course_code = None
    if request.method == "GET":
        course_code = request.args.get("course_code")
    elif request.method == "POST":
        try:
            data = request.get_json(silent=True)
            if data:
                course_code = data.get("course_code")
        except Exception:
            pass

    if course_code:
        # Call your backend API to get real course info
        backend_url = f"https://34.29.190.192/api/courses/{course_code}"
        try:
            resp = requests.get(backend_url, timeout=5, verify=False)
            if resp.status_code == 200:
                return (resp.text, 200, {'Content-Type': 'application/json'})
            else:
                return (json.dumps({"error": f"Backend returned {resp.status_code}", "detail": resp.text}), resp.status_code, {'Content-Type': 'application/json'})
        except Exception as e:
            return (json.dumps({"error": "Failed to contact backend", "detail": str(e)}), 500, {'Content-Type': 'application/json'})

    # Default: return info
    info = {
        "message": "Provide a course_code query parameter to get course info.",
        "example": "?course_code=CS101"
    }
    return (json.dumps(info), 200, {'Content-Type': 'application/json'})
