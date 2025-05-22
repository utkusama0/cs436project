# student_service/Dockerfile

FROM python:3.9-slim

# 1) Set working dir
WORKDIR /app

# 2) Copy only the shared files (from the build context root)
COPY requirements.txt  ./requirements.txt
COPY database.py       ./database.py

# 3) Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 4) Copy just your student_service code
# ...existing code...
# 4) Copy the entire student_service directory into /app
COPY student_service/ ./student_service/
# ...existing code...

# 5) Environment variables (unchanged)
ENV PYTHONPATH=/app
ENV DB_HOST=10.128.0.2
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=12345678
ENV DB_NAME=student_management
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

# 6) Expose port and start Uvicorn
EXPOSE 8080
CMD ["uvicorn", "student_service.main:app", "--host", "0.0.0.0", "--port", "8080"]
