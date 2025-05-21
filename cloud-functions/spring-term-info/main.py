import json
from typing import Any

def spring_term_info(request: Any):
    """
    Google Cloud Function: Returns 2025 Spring term information.
    """
    info = {
        "term": "2025 Spring",
        "registration_opens": "2025-01-15",
        "classes_start": "2025-02-01",
        "message": "2025 Spring term: Registration opens Jan 15, classes start Feb 1. Good luck!"
    }
    return (json.dumps(info), 200, {'Content-Type': 'application/json'})
