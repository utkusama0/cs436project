from flask import jsonify, request
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_email(request):
    """
    Sends email notifications to students or faculty
    
    Args:
        request (flask.Request): HTTP request object
        
    Returns:
        A response confirming the email was sent
    """
    request_json = request.get_json()
    
    if not request_json:
        return jsonify({"error": "No request data provided"}), 400
    
    # Extract data from request
    to_email = request_json.get('to_email')
    subject = request_json.get('subject')
    body = request_json.get('body')
    pdf_url = request_json.get('pdf_url')  # Optional PDF attachment URL
    
    if not to_email or not subject or not body:
        return jsonify({"error": "Missing required email information"}), 400
    
    # Add PDF URL to body if provided
    if pdf_url:
        body += f"\n\nYou can access your report here: {pdf_url}"
    
    # Create email message
    from_email = os.environ.get('FROM_EMAIL', 'noreply@studentmgmt.com')
    message = Mail(
        from_email=from_email,
        to_emails=to_email,
        subject=subject,
        html_content=body)
    
    # Send email via SendGrid
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        
        return jsonify({
            "message": "Email sent successfully",
            "status_code": response.status_code
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500