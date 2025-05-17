from flask import jsonify, request
import os
import tempfile
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from google.cloud import storage

def generate_pdf(request):
    """
    Generates a PDF report for student grades or course information
    
    Args:
        request (flask.Request): HTTP request object
        
    Returns:
        A response with the public URL of the generated PDF
    """
    request_json = request.get_json()
    
    if not request_json:
        return jsonify({"error": "No request data provided"}), 400
        
    # Extract data from request
    student_name = request_json.get('student_name')
    student_id = request_json.get('student_id')
    courses = request_json.get('courses', [])
    
    if not student_name or not student_id:
        return jsonify({"error": "Missing required student information"}), 400
        
    # Create temporary PDF file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    pdf_path = temp_file.name
    
    # Generate PDF using ReportLab
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    
    # Add header
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, f"Student Report: {student_name}")
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 70, f"Student ID: {student_id}")
    c.drawString(50, height - 90, f"Date: {request_json.get('date', '')}")
    
    # Add course information
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, height - 120, "Course Information")
    
    y_position = height - 140
    for course in courses:
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y_position, course.get('name', 'Unknown Course'))
        y_position -= 20
        c.setFont("Helvetica", 11)
        c.drawString(60, y_position, f"Grade: {course.get('grade', 'N/A')}")
        y_position -= 20
        c.drawString(60, y_position, f"Credits: {course.get('credits', 'N/A')}")
        y_position -= 30
    
    c.save()
    
    # Upload to Google Cloud Storage
    bucket_name = os.environ.get('BUCKET_NAME', 'student-reports')
    storage_client = storage.Client()
    
    try:
        bucket = storage_client.get_bucket(bucket_name)
    except Exception:
        # Create bucket if it doesn't exist
        bucket = storage_client.create_bucket(bucket_name)
    
    pdf_filename = f"{student_id}-report.pdf"
    blob = bucket.blob(pdf_filename)
    
    with open(pdf_path, 'rb') as pdf_file:
        blob.upload_from_file(pdf_file)
    
    # Make the PDF public
    blob.make_public()
    
    # Clean up temp file
    os.unlink(pdf_path)
    
    # Return the public URL
    return jsonify({
        "message": "PDF generated successfully",
        "pdf_url": blob.public_url,
        "filename": pdf_filename
    })