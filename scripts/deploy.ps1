# Deploy the Student Management System to GCP

# Variables
$PROJECT_ID = "student-management-system"
$REGION = "us-central1"
$ZONE = "us-central1-a"
$CLUSTER_NAME = "student-mgmt-cluster"

# Set the GCP project
Write-Host "Setting up GCP project: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Get credentials for kubectl
gcloud container clusters get-credentials $CLUSTER_NAME --zone $ZONE --project $PROJECT_ID

# Build and push Docker images
Write-Host "Building and pushing Docker images..."

# Student Service
Write-Host "Building student-service image..."
cd ../backend/student_service
docker build -t gcr.io/$PROJECT_ID/student-service:latest .
docker push gcr.io/$PROJECT_ID/student-service:latest
cd ../../scripts

# Course Service
Write-Host "Building course-service image..."
cd ../backend/course_service
docker build -t gcr.io/$PROJECT_ID/course-service:latest .
docker push gcr.io/$PROJECT_ID/course-service:latest
cd ../../scripts

# Grade Service
Write-Host "Building grade-service image..."
cd ../backend/grade_service
docker build -t gcr.io/$PROJECT_ID/grade-service:latest .
docker push gcr.io/$PROJECT_ID/grade-service:latest
cd ../../scripts

# API Gateway
Write-Host "Building api-gateway image..."
cd ../backend/api-gateway
docker build -t gcr.io/$PROJECT_ID/api-gateway:latest .
docker push gcr.io/$PROJECT_ID/api-gateway:latest
cd ../../scripts

# Frontend
Write-Host "Building frontend image..."
cd ../frontend
docker build -t gcr.io/$PROJECT_ID/frontend:latest .
docker push gcr.io/$PROJECT_ID/frontend:latest
cd ../scripts

# Deploy to Kubernetes
Write-Host "Deploying to Kubernetes..."

# Create namespace
kubectl apply -f ../k8s/base/namespace.yaml

# Deploy secrets and config
kubectl apply -f ../k8s/base/secrets/db-credentials.yaml
kubectl apply -f ../k8s/base/configmaps/app-config.yaml

# Deploy Redis
kubectl apply -f ../k8s/base/redis/deployment.yaml
kubectl apply -f ../k8s/base/redis/service.yaml

# Deploy Backend Services
kubectl apply -f ../k8s/base/backend/student/deployment.yaml
kubectl apply -f ../k8s/base/backend/student/service.yaml
kubectl apply -f ../k8s/base/backend/student/hpa.yaml

kubectl apply -f ../k8s/base/backend/course/deployment.yaml
kubectl apply -f ../k8s/base/backend/course/service.yaml
kubectl apply -f ../k8s/base/backend/course/hpa.yaml

kubectl apply -f ../k8s/base/backend/grade/deployment.yaml
kubectl apply -f ../k8s/base/backend/grade/service.yaml
kubectl apply -f ../k8s/base/backend/grade/hpa.yaml

# Deploy Frontend
kubectl apply -f ../k8s/base/frontend/deployment.yaml
kubectl apply -f ../k8s/base/frontend/service.yaml
kubectl apply -f ../k8s/base/frontend/hpa.yaml

# Apply Ingress last
kubectl apply -f ../k8s/base/ingress.yaml

Write-Host "Deployment completed successfully!"
Write-Host "It may take a few minutes for the ingress to provision external IP..."
Write-Host "Check the status with: kubectl get ingress -n student-management"