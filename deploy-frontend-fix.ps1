# Frontend fix deployment script

Write-Host "Building and deploying frontend fixes..." -ForegroundColor Green

# Navigate to the frontend directory
Set-Location $PSScriptRoot\frontend\student-management-ui

# Build the Docker image
Write-Host "Building Docker image..." -ForegroundColor Cyan
docker build -t gcr.io/cs436termproject-460018/frontend:latest --no-cache .

# Push the image to Google Container Registry
Write-Host "Pushing Docker image to GCR..." -ForegroundColor Cyan
docker push gcr.io/cs436termproject-460018/frontend:latest

Write-Host "Image pushed successfully!" -ForegroundColor Green
Write-Host "Now run the following commands in Google Cloud Shell:"
Write-Host "kubectl apply -f k8s/base/frontend/configmap-frontend-env.yaml" -ForegroundColor Yellow
Write-Host "kubectl apply -f k8s/base/ingress.yaml" -ForegroundColor Yellow
Write-Host "kubectl rollout restart deployment/frontend -n student-management" -ForegroundColor Yellow
Write-Host "kubectl rollout status deployment/frontend -n student-management" -ForegroundColor Yellow

Write-Host "`nAfter deployment, check the logs with:" -ForegroundColor Green
Write-Host "kubectl logs -n student-management deployment/frontend" -ForegroundColor Yellow

# Return to the root directory
Set-Location $PSScriptRoot
