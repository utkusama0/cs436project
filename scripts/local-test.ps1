# Local Docker Testing Script

Write-Host "Testing Student Management System locally with Docker Compose"

# Navigate to project root directory
Set-Location -Path $PSScriptRoot/..

# Build and run services with docker-compose
Write-Host "Building and starting services..."
docker-compose build
docker-compose up -d

# Check if containers are running
Write-Host "Checking container status..."
docker-compose ps

Write-Host "`nLocalhost Service URLs:"
Write-Host "------------------------"
Write-Host "Frontend:        http://localhost:80"
Write-Host "API Gateway:     http://localhost:8000"
Write-Host "Student Service: http://localhost:8081"
Write-Host "Course Service:  http://localhost:8082"
Write-Host "Grade Service:   http://localhost:8083"
Write-Host "PostgreSQL:      localhost:5432"
Write-Host "Redis:           localhost:6379"
Write-Host "`nView logs with 'docker-compose logs -f'"
Write-Host "Stop services with 'docker-compose down'"
