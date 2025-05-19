FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy requirements and database files
COPY requirements.txt .
COPY ../database.py .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the service files
COPY . .

# Set environment variables
ENV PYTHONPATH=/app
ENV DB_HOST=10.128.0.2
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=12345678
ENV DB_NAME=student_management
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

# Expose the port
EXPOSE 8082

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8082"]