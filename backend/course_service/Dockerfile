FROM python:3.9-slim

WORKDIR /app


# Copy the database.py from parent directory

# Copy requirements and database files
COPY requirements.txt .

COPY ../database.py .

# Copy service files


# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


COPY . .


# Run the application

ENV PYTHONPATH=/app
ENV DB_HOST=10.128.0.2
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=12345678
ENV DB_NAME=student_management
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

# Expose the port
EXPOSE 8081

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8081"]
