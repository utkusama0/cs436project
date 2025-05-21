import json
from typing import Any
from flask import make_response

def spring_term_info(request: Any):
    """
    Google Cloud Function: Returns 2025 Spring term information.
    """
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }
    
    info = {
        "term": "2025 Spring",
        "registration_opens": "2025-01-15",
        "classes_start": "2025-02-01",
        "message": "2025 Spring term: Registration opens Jan 15, classes start Feb 1. Good luck!"
    }
    
    return (json.dumps(info), 200, headers)
