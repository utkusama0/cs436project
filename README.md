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

## Deployment Process

### 1. Environment Setup

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

3. **Manually Create a Virtual Machine for PostgreSQL**
   - Use the GCP Console or CLI to create a VM instance.
   - Select an appropriate machine type (e.g., `e2-medium`).
   - Configure the VM to allow incoming connections from the GKE cluster.

### 2. Database Setup

1. **Install and Configure PostgreSQL on the VM**
   - SSH into the VM and install PostgreSQL:
     ```bash
     sudo apt update
     sudo apt install postgresql postgresql-contrib
     ```
   - Configure PostgreSQL to allow connections from the GKE cluster by updating `pg_hba.conf` and `postgresql.conf`.

2. **Manually Update Backend Microservices**
   - Update the following settings in the backend microservices:
     - Database credentials (user, password)
     - Database connection URLs

3. **Ensure Connectivity**
   - Verify that the VM allows incoming connections from the GKE cluster.

### 3. Cloud Functions Deployment

1. **Deploy the Term Information Cloud Function**
   ```bash
   gcloud functions deploy spring-term-info \
     --runtime python39 \
     --trigger-http \
     --allow-unauthenticated \
     --source cloud-functions/spring-term-info
   ```

2. **Update Frontend Configuration**
   - Manually update the frontend’s `SPRING_TERM_URL` environment variable or configuration file with the URL of the deployed cloud function.

### 4. Kubernetes Deployment

1. **Build and Push Docker Images**
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

2. **Update Kubernetes Deployment Manifests**
   - Update the deployment manifests with:
     - Correct image paths
     - Environment variables (e.g., database URLs, credentials)

3. **Apply Kubernetes Resources**
   ```bash
   kubectl apply -k k8s/base
   ```

4. **Ensure Ingress Configuration**
   - Verify that Ingress is properly configured for path-based routing.

### 5. Deployment Automation Resources

All deployment scripts, Dockerfiles, and Kubernetes configuration files are available in the GitHub repository. Refer to the exact commands and usage instructions provided above.

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
   gcloud functions logs read spring-term-info
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
gcloud functions delete spring-term-info

# Delete Docker images
gcloud container images delete gcr.io/$PROJECT_ID/frontend:latest
gcloud container images delete gcr.io/$PROJECT_ID/student-service:latest
gcloud container images delete gcr.io/$PROJECT_ID/course-service:latest
gcloud container images delete gcr.io/$PROJECT_ID/grade-service:latest
```