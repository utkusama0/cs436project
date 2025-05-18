FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy files from parent directory first
COPY ../requirements.txt .
COPY ../database.py .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy service-specific files
COPY . .

# Set PYTHONPATH to allow relative imports
ENV PYTHONPATH=/app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]