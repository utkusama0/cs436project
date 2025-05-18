FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy files from parent directory first
COPY ../requirements.txt .
COPY ../database.py .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire service directory to /app/<service_name>
COPY . /app/student_service

# Set PYTHONPATH to include the parent directory of the package
ENV PYTHONPATH=/app

# Run the application using the package path
CMD ["uvicorn", "student_service.main:app", "--host", "0.0.0.0", "--port", "8080"]