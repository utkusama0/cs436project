import json
from typing import Any
from flask import make_response

def spring_term_info(request: Any):
    """
    Google Cloud Function: Returns 2025 Spring term information.
    """    
    # Define CORS headers - explicitly set the frontend domain
    cors_headers = {
        'Access-Control-Allow-Origin': 'http://34.29.190.192',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
        'Access-Control-Max-Age': '3600',
        'Content-Type': 'application/json'
    }

    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        return ('', 204, cors_headers)

    # Handle main request with same CORS headers
    info = {
        "term": "2025 Spring",
        "registration_opens": "2025-01-15",
        "classes_start": "2025-02-01",
        "message": "2025 Spring term: Registration opens Jan 15, classes start Feb 1. Good luck!"
    }
    
    return (json.dumps(info), 200, cors_headers)
