# Student Management System - Cloud Native Architecture

This project implements a cloud-native student management system using Google Cloud Platform (GCP). The system is designed to be scalable, efficient, and cost-effective.

## Architecture Components

1. **Containerized Workloads (Kubernetes)**
   - Frontend (React)
   - Backend Services (FastAPI)
     - Student Service
     - Course Service
     - Grade Service
   - Redis Cache
   - Horizontal Pod Autoscaling (HPA)

2. **Virtual Machines**
   - Primary PostgreSQL Database
   - Replica PostgreSQL Database

3. **Serverless Functions (Google Cloud Functions)**
   - Term information

## Prerequisites

- Google Cloud Platform account with $300 free trial credit
- Google Cloud SDK installed
- kubectl installed
- Docker installed
- Python 3.8+ installed

## Setup Instructions

1. **Enable Required GCP APIs**
   ```bash
   gcloud services enable \
     container.googleapis.com \
     cloudfunctions.googleapis.com \
     secretmanager.googleapis.com \
     compute.googleapis.com
   ```

2. **Create GKE Cluster**
   ```bash
   gcloud container clusters create student-management-cluster \
     --num-nodes=2 \
     --zone=us-central1-a \
     --machine-type=e2-medium
   ```

3. **Get Cluster Credentials**
   ```bash
   gcloud container clusters get-credentials student-management-cluster --zone=us-central1-a
   ```

4. **Create Namespace and Secrets**
   ```bash
   kubectl apply -f k8s/base/namespace.yaml
   kubectl apply -f k8s/base/secrets/db-credentials.yaml
   ```

5. **Build and Push Docker Images**
   ```bash
   # Frontend
   docker build -t gcr.io/$PROJECT_ID/frontend:latest frontend/
   docker push gcr.io/$PROJECT_ID/frontend:latest

   # Backend Services
   docker build -t gcr.io/$PROJECT_ID/student-service:latest backend/student_service/
   docker build -t gcr.io/$PROJECT_ID/course-service:latest backend/course_service/
   docker build -t gcr.io/$PROJECT_ID/grade-service:latest backend/grade_service/
   docker push gcr.io/$PROJECT_ID/student-service:latest
   docker push gcr.io/$PROJECT_ID/course-service:latest
   docker push gcr.io/$PROJECT_ID/grade-service:latest
   ```

6. **Deploy Kubernetes Resources**
   ```bash
   kubectl apply -k k8s/base
   ```

7. **Deploy Cloud Functions**
   ```bash
   # Term Information
   gcloud functions deploy spring-term-info \
     --runtime python39 \
     --trigger-http \
     --allow-unauthenticated \
     --source cloud-functions/spring-term-info
   ```

8. **Set Up Database**
   ```bash
   # On primary VM
   sudo -u postgres psql -d student_management -f scripts/scripts.sql
   python scripts/populate_db.py
   ```

## Performance Testing

1. **Install Locust**
   ```bash
   pip install locust
   ```

2. **Run Load Test**
   ```bash
   locust -f tests/locustfile.py --host=http://<INGRESS_IP>
   ```

3. **Access Locust Web UI**
   - Open http://localhost:8089
   - Set number of users and spawn rate
   - Start test

## Monitoring

1. **View Pod Logs**
   ```bash
   kubectl logs -f -n student-management <pod-name>
   ```

2. **Check HPA Status**
   ```bash
   kubectl get hpa -n student-management
   ```

3. **Monitor Cloud Functions**
   ```bash
   gcloud functions logs read generate-transcript
   gcloud functions logs read notify-grade-update
   ```

## Cost Optimization

- Use e2-medium instances for GKE nodes
- Implement HPA to scale based on demand
- Use Cloud Functions for event-driven workloads
- Monitor and adjust resources based on usage

## Cleanup

To avoid unnecessary charges, clean up resources when not in use:

```bash
# Delete GKE cluster
gcloud container clusters delete student-management-cluster --zone=us-central1-a

# Delete Cloud Functions
gcloud functions delete generate-transcript
gcloud functions delete notify-grade-update

# Delete Docker images
gcloud container images delete gcr.io/$PROJECT_ID/frontend:latest
gcloud container images delete gcr.io/$PROJECT_ID/student-service:latest
gcloud container images delete gcr.io/$PROJECT_ID/course-service:latest
gcloud container images delete gcr.io/$PROJECT_ID/grade-service:latest
```
