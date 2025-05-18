#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
    fi
}

# Get function URLs
PDF_GENERATOR_URL=$(gcloud functions describe generate-transcript --format='value(httpsTrigger.url)')
EMAIL_NOTIFIER_URL=$(gcloud functions describe notify-grade-update --format='value(httpsTrigger.url)')

echo "Testing Cloud Functions..."
echo "PDF Generator URL: $PDF_GENERATOR_URL"
echo "Email Notifier URL: $EMAIL_NOTIFIER_URL"

# Test PDF Generator
echo -e "\nTesting PDF Generator Function..."

# Test Case 1: Valid student ID
echo "Test Case 1: Valid student ID"
curl -X POST $PDF_GENERATOR_URL \
    -H "Content-Type: application/json" \
    -d '{"student_id": "S10001"}' \
    -o test_transcript_1.pdf
print_status $? "Generate PDF for valid student"

# Test Case 2: Invalid student ID
echo -e "\nTest Case 2: Invalid student ID"
curl -X POST $PDF_GENERATOR_URL \
    -H "Content-Type: application/json" \
    -d '{"student_id": "INVALID"}' \
    -w "\nStatus Code: %{http_code}\n"
print_status $? "Handle invalid student ID"

# Test Case 3: Missing student ID
echo -e "\nTest Case 3: Missing student ID"
curl -X POST $PDF_GENERATOR_URL \
    -H "Content-Type: application/json" \
    -d '{}' \
    -w "\nStatus Code: %{http_code}\n"
print_status $? "Handle missing student ID"

# Test Email Notifier
echo -e "\nTesting Email Notifier Function..."

# Test Case 1: Valid student and course
echo "Test Case 1: Valid student and course"
curl -X POST $EMAIL_NOTIFIER_URL \
    -H "Content-Type: application/json" \
    -d '{"student_id": "S10001", "course_code": "CS101"}' \
    -w "\nStatus Code: %{http_code}\n"
print_status $? "Send email for valid student and course"

# Test Case 2: Invalid student ID
echo -e "\nTest Case 2: Invalid student ID"
curl -X POST $EMAIL_NOTIFIER_URL \
    -H "Content-Type: application/json" \
    -d '{"student_id": "INVALID", "course_code": "CS101"}' \
    -w "\nStatus Code: %{http_code}\n"
print_status $? "Handle invalid student ID"

# Test Case 3: Invalid course code
echo -e "\nTest Case 3: Invalid course code"
curl -X POST $EMAIL_NOTIFIER_URL \
    -H "Content-Type: application/json" \
    -d '{"student_id": "S10001", "course_code": "INVALID"}' \
    -w "\nStatus Code: %{http_code}\n"
print_status $? "Handle invalid course code"

# Test Case 4: Missing parameters
echo -e "\nTest Case 4: Missing parameters"
curl -X POST $EMAIL_NOTIFIER_URL \
    -H "Content-Type: application/json" \
    -d '{}' \
    -w "\nStatus Code: %{http_code}\n"
print_status $? "Handle missing parameters"

echo -e "\nCloud Functions Testing Complete!" 