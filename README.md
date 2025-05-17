# Student Management System - CS436 Project

This is a student management system with microservices architecture.

## Architecture Overview

The system consists of:

- **Backend Services**:
  - Student Service: Manages student information
  - Course Service: Manages course information
  - Grade Service: Manages grade information
  - API Gateway: Routes requests to appropriate services
  - Redis Cache: Provides caching for performance

- **Database**:
  - PostgreSQL Primary: Main database
  - PostgreSQL Secondary: Database replica for redundancy

- **Cloud Functions**:
  - PDF Generator: Generates PDF reports
  - Email Notifier: Sends email notifications

- **Frontend**:
  - Student Management UI: React-based web interface

## Deployment Plan

### 1. Local Testing with Docker

Before deploying to GCP, test the system locally:

```powershell
# Run the local testing script
.\scripts\local-test.ps1
```

This will start all components in Docker containers and provide URLs for accessing the services.

### 2. GCP Deployment

Follow these steps to deploy to GCP:

1. **Setup GCP Environment**:
   ```powershell
   .\scripts\setup-gcp.ps1
   ```
   This will create:
   - GCP Project
   - GKE Cluster
   - PostgreSQL VMs
   - Cloud Functions

2. **Deploy the Application**:
   ```powershell
   .\scripts\deploy.ps1
   ```
   This will:
   - Build and push Docker images to GCR
   - Deploy Kubernetes resources
   - Configure networking

3. **Teardown (if needed)**:
   ```powershell
   .\scripts\teardown.ps1
   ```

## Configuration

- Database configuration is stored in `k8s/base/secrets/db-credentials.yaml`
- Environment variables are stored in `k8s/base/configmaps/app-config.yaml`
- Network routing is configured in the API Gateway's `nginx.conf`

## Development

- Frontend code is in the `frontend/student-management-ui` directory
- Backend services are in `backend/{service_name}` directories
- Cloud functions are in `cloud-functions/{function_name}` directories