FROM python:3.9-slim

WORKDIR /app

# Copy the database.py from parent directory
COPY ../database.py .

# Copy service files
COPY . .

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8080

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
