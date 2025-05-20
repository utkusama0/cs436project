# course_service/Dockerfile

FROM python:3.9-slim

WORKDIR /app

# Shared requirements & DB config
COPY requirements.txt  ./requirements.txt
COPY database.py       ./database.py

RUN pip install --no-cache-dir -r requirements.txt

# Only bring in course_service code
COPY course_service/ ./

ENV PYTHONPATH=/app
ENV DB_HOST=10.128.0.2
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=12345678
ENV DB_NAME=student_management
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

EXPOSE 8081
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8081"]
