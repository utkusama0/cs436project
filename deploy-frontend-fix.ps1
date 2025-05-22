# Frontend fix deployment script

Write-Host "Building and deploying frontend fixes..." -ForegroundColor Green

# Navigate to the frontend directory
Set-Location $PSScriptRoot\frontend\student-management-ui

# Print current working directory
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan

# Build the Docker image
Write-Host "Building Docker image..." -ForegroundColor Cyan
docker build -t gcr.io/cs436termproject-460018/frontend:latest --no-cache .

# Push the image to Google Container Registry
Write-Host "Pushing Docker image to GCR..." -ForegroundColor Cyan
docker push gcr.io/cs436termproject-460018/frontend:latest

Write-Host "Image pushed successfully!" -ForegroundColor Green
Write-Host "Now run the following commands in Google Cloud Shell:" -ForegroundColor Green

Write-Host "# Step 1: Apply the ingress.yaml configuration" -ForegroundColor Yellow
Write-Host "cd ~/cs436project" -ForegroundColor Yellow
Write-Host "kubectl apply -f k8s/base/ingress.yaml" -ForegroundColor Yellow
Write-Host ""

Write-Host "# Step 2: Apply the frontend environment configuration" -ForegroundColor Yellow
Write-Host "kubectl apply -f k8s/base/frontend/configmap-frontend-env.yaml" -ForegroundColor Yellow
Write-Host ""

Write-Host "# Step 3: Restart the frontend deployment" -ForegroundColor Yellow
Write-Host "kubectl rollout restart deployment/frontend -n student-management" -ForegroundColor Yellow
Write-Host "kubectl rollout status deployment/frontend -n student-management" -ForegroundColor Yellow
Write-Host ""

Write-Host "# Step 4: Check that everything is working" -ForegroundColor Yellow
Write-Host "kubectl get pods -n student-management" -ForegroundColor Yellow
Write-Host "kubectl logs -n student-management deployment/frontend --tail=50" -ForegroundColor Yellow
Write-Host "kubectl get ingress -n student-management" -ForegroundColor Yellow

# Return to the root directory
Set-Location $PSScriptRoot
