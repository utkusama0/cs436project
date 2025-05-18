import requests
import json
import base64
import os
from datetime import datetime

def test_pdf_generator():
    """Test the PDF Generator Cloud Function"""
    # Get the function URL from environment or use a default
    function_url = os.getenv('PDF_GENERATOR_URL', 'http://localhost:8080/generate-transcript')
    
    # Test data
    test_data = {
        "student_id": "S10001"  # Use an existing student ID
    }
    
    print("\nTesting PDF Generator Function...")
    try:
        response = requests.post(function_url, json=test_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            # Decode and save PDF for verification
            pdf_content = base64.b64decode(result['pdf_content'])
            filename = f"test_transcript_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            with open(filename, 'wb') as f:
                f.write(pdf_content)
            print(f"PDF generated successfully: {filename}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception occurred: {str(e)}")

def test_email_notifier():
    """Test the Email Notifier Cloud Function"""
    # Get the function URL from environment or use a default
    function_url = os.getenv('EMAIL_NOTIFIER_URL', 'http://localhost:8080/notify-grade-update')
    
    # Test data
    test_data = {
        "student_id": "S10001",  # Use an existing student ID
        "course_code": "CS101"   # Use an existing course code
    }
    
    print("\nTesting Email Notifier Function...")
    try:
        response = requests.post(function_url, json=test_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Exception occurred: {str(e)}")

if __name__ == "__main__":
    print("Starting Cloud Functions Tests...")
    test_pdf_generator()
    test_email_notifier() 