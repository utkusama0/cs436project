"""
import functions_framework
from flask import jsonify, Response
import requests
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
import io
import os
from datetime import datetime

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
    student_response = requests.get(f"{os.environ.get('STUDENT_SERVICE_URL')}/{student_id}")
    if student_response.status_code != 200:
        return jsonify({'error': 'Student not found'}), 404
    
    student = student_response.json()
    
    # Get transcript data from grade service
    transcript_response = requests.get(
        f"{os.environ.get('GRADE_SERVICE_URL')}/student/{student_id}/transcript"
    )
    if transcript_response.status_code != 200:
        print(f"Error fetching transcript for student {student_id}: Status Code {transcript_response.status_code}, Response: {transcript_response.text}")
        return jsonify({'error': 'Failed to fetch transcript'}), transcript_response.status_code
    
    transcript = transcript_response.json()
    
    # Create PDF
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []
    
    # Add header
    elements.append(Paragraph(f"Academic Transcript", styles['Title']))
    elements.append(Paragraph(f"Student ID: {student_id}", styles['Normal']))
    elements.append(Paragraph(
        f"Name: {student.get('first_name', 'N/A')} {student.get('last_name', '')}", 
        styles['Normal']
    ))
    elements.append(Paragraph(f"Email: {student.get('email', 'N/A')}", styles['Normal']))
    elements.append(Paragraph(f"Enrollment Date: {student.get('enrollment_date', 'N/A')}", styles['Normal']))
    elements.append(Paragraph("", styles['Normal']))  # Spacing
    
    # Create transcript table
    data = [['Course Code', 'Course Name', 'Credits', 'Grade', 'Semester']]
    
    if not transcript:
        elements.append(Paragraph("No courses found in transcript.", styles['Normal']))
    else:
        for entry in transcript:
            try:
                course = entry.get('course', {})
                data.append([
                    course.get('course_code', 'N/A'),
                    course.get('course_name', 'N/A'),
                    str(course.get('credits', 'N/A')),
                    str(entry.get('grade_value', 'N/A')),
                    entry.get('semester', 'N/A')
                ])
            except Exception as e:
                print(f"Error processing transcript entry: {e}")
                continue
        
        if len(data) > 1:  # More than just header row
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
    
    # Add footer with generation date
    elements.append(Paragraph("", styles['Normal']))  # Spacing
    elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
    
    try:
        doc.build(elements)
    except Exception as e:
        print(f"Error building PDF: {e}")
        return jsonify({'error': 'Error generating PDF'}), 500
    
    # Get PDF content
    pdf_content = buffer.getvalue()
    buffer.close()

    return Response(
        pdf_content,
        mimetype='application/pdf',
        headers={'Content-Disposition': f'attachment;filename=transcript_{student_id}.pdf'}
    )
"""