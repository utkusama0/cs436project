import functions_framework
from flask import jsonify
import requests
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
import io
import os

@functions_framework.http
def generate_transcript(request):
    """HTTP Cloud Function to generate a PDF transcript.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    request_json = request.get_json(silent=True)
    
    if not request_json or 'student_id' not in request_json:
        return jsonify({'error': 'student_id is required'}), 400

    student_id = request_json['student_id']
    
    # Get student data from student service
    student_response = requests.get(f"{os.environ.get('STUDENT_SERVICE_URL')}/students/{student_id}")
    if student_response.status_code != 200:
        return jsonify({'error': 'Student not found'}), 404
    
    student = student_response.json()
    
    # Get transcript data from grade service
    transcript_response = requests.get(f"{os.environ.get('GRADE_SERVICE_URL')}/grades/student/{student_id}/transcript")
    if transcript_response.status_code != 200:
        return jsonify({'error': 'Failed to fetch transcript'}), 500
    
    transcript = transcript_response.json()
    
    # Create PDF
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []
    
    # Add header
    elements.append(Paragraph(f"Academic Transcript", styles['Title']))
    elements.append(Paragraph(f"Student ID: {student_id}", styles['Normal']))
    elements.append(Paragraph(f"Name: {student['name']}", styles['Normal']))
    elements.append(Paragraph(f"Department: {student['department']}", styles['Normal']))
    elements.append(Paragraph("", styles['Normal']))  # Spacing
    
    # Create transcript table
    data = [['Course Code', 'Course Name', 'Credits', 'Grade', 'Semester']]
    for entry in transcript:
        data.append([
            entry['course']['course_code'],
            entry['course']['course_name'],
            str(entry['course']['credits']),
            entry['grade_value'],
            entry['semester']
        ])
    
    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    elements.append(table)
    doc.build(elements)
    
    # Get PDF content
    pdf_content = buffer.getvalue()
    buffer.close()
    
    return jsonify({
        'pdf_content': pdf_content.decode('latin1'),
        'filename': f'transcript_{student_id}.pdf'
    })
