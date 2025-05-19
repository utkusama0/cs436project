import functions_framework
from flask import jsonify
import requests
import os
from google.cloud import secretmanager
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def get_secret(project_id, secret_id, version_id="latest"):
    """Access the secret version."""
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

@functions_framework.http
def notify_grade_update(request):
    """HTTP Cloud Function to send email notifications for grade updates.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    request_json = request.get_json(silent=True)
    
    if not request_json or 'student_id' not in request_json or 'course_code' not in request_json:
        return jsonify({'error': 'student_id and course_code are required'}), 400

    student_id = request_json['student_id']
    course_code = request_json['course_code']
    
    # Get student data
    student_response = requests.get(f"{os.environ.get('STUDENT_SERVICE_URL')}/{student_id}")
    if student_response.status_code != 200:
        return jsonify({'error': 'Student not found'}), 404
    
    student = student_response.json()
    
    # Get course data
    course_response = requests.get(f"{os.environ.get('COURSE_SERVICE_URL')}/{course_code}")
    if course_response.status_code != 200:
        return jsonify({'error': 'Course not found'}), 404
    
    course = course_response.json()
    
    # Get grade data (using the transcript endpoint to get nested course info)
    # Use the query parameter endpoint as confirmed by backend logs
    transcript_response = requests.get(
        f"{os.environ.get('GRADE_SERVICE_URL')}?student_id={student_id}"
    )
    if transcript_response.status_code != 200:
        print(f"Error fetching transcript for student {student_id}: Status Code {transcript_response.status_code}, Response: {transcript_response.text}")
        return jsonify({'error': 'Failed to fetch grade data for notification'}), transcript_response.status_code # More specific error message
    
    grades = transcript_response.json()
    grade = next((g for g in grades if g['course']['course_code'] == course_code), None)
    
    if not grade:
        return jsonify({'error': 'Grade not found'}), 404
    
    # Get email credentials from Secret Manager
    project_id = os.environ.get('PROJECT_ID')
    smtp_username = get_secret(project_id, 'smtp-username')
    smtp_password = get_secret(project_id, 'smtp-password')
    
    # Create email message
    msg = MIMEMultipart()
    msg['From'] = smtp_username
    msg['To'] = student['email']
    msg['Subject'] = f"Grade Update - {course['name']}"
    
    body = f"""
    Dear {student['name']},
    
    Your grade for {course['name']} ({course_code}) has been updated.
    
    Course Details:
    - Course Code: {course_code}
    - Course Name: {course['name']}
    - Credits: {course['credits']}
    - Department: {course['department']}
    
    Grade Information:
    - Grade: {grade['grade_value']}
    - Semester: {grade['semester']}
    
    Best regards,
    Student Management System
    """
    
    msg.attach(MIMEText(body, 'plain'))
    
    # Send email
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(msg)
        server.quit()
        
        return jsonify({'message': 'Email notification sent successfully'})
    except Exception as e:
        return jsonify({'error': f'Failed to send email: {str(e)}'}), 500
