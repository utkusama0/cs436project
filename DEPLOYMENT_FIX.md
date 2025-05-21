# Student Management System Deployment Fix

This document provides the exact steps to fix the issues with the frontend application and ensure both the frontend and backend endpoints work correctly.

## What Went Wrong

1. **API Routing Issues**: The Ingress configuration with regex paths and rewrite targets was causing problems with the API endpoints.
2. **Nginx Redirection Issues**: The Nginx configuration was causing redirection loops with the `/index.html` route.
3. **Missing or Incorrect Script Inclusion**: The index.html file wasn't properly set up for Vite's script injection.

## Solution Steps

### Step 1: Local Machine (PowerShell)

Run the provided PowerShell script to build and push the Docker image:

```powershell
# Navigate to the project root
cd D:\cs436project\cs436project\cs436project

# Execute the deployment script
.\deploy-frontend-fix.ps1
```

### Step 2: Google Cloud Shell

After the Docker image is pushed, complete the deployment in the GCP Cloud Shell:

```bash
# Navigate to your project directory
cd ~/cs436project

# Step 1: Apply the updated Ingress configuration
kubectl apply -f k8s/base/ingress.yaml

# Step 2: Apply the frontend environment configuration
kubectl apply -f k8s/base/frontend/configmap-frontend-env.yaml

# Step 3: Restart the frontend deployment
kubectl rollout restart deployment/frontend -n student-management
kubectl rollout status deployment/frontend -n student-management

# Step 4: Verify everything is working
kubectl get pods -n student-management
kubectl logs -n student-management deployment/frontend --tail=50
kubectl get ingress -n student-management

# Step 5: Test API endpoints
# Use your Ingress IP address here
INGRESS_IP=$(kubectl get ingress -n student-management api-gateway-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
curl http://$INGRESS_IP/api/students/
curl http://$INGRESS_IP/api/courses/
curl http://$INGRESS_IP/api/grades/
```

## Verification

1. After all steps are completed, visit your application in a browser at the Ingress IP address.
2. You should see the frontend UI load correctly.
3. The frontend should be able to fetch data from the backend API endpoints.
4. The API endpoints should return JSON data when accessed directly.

## Troubleshooting

If you still encounter issues:

1. **Frontend 500 Errors**:
   ```bash
   kubectl logs -n student-management deployment/frontend -f
   ```

2. **API Endpoint Issues**:
   ```bash
   # Check student service logs
   kubectl logs -n student-management deployment/student-service -f
   
   # Check course service logs
   kubectl logs -n student-management deployment/course-service -f
   
   # Check grade service logs
   kubectl logs -n student-management deployment/grade-service -f
   ```

3. **Ingress Issues**:
   ```bash
   kubectl describe ingress -n student-management api-gateway-ingress
   ```

4. **Last Resort - Reset Everything**:
   ```bash
   kubectl rollout restart deployment -n student-management
   ```

## Summary of Changes Made

1. **Ingress Configuration**: Simplified to ensure proper routing of API and frontend requests.
2. **Nginx Configuration**: Optimized for React single page application with proper routing.
3. **Index.html**: Corrected to allow proper script injection by Vite build process.
4. **Frontend Environment**: Updated to ensure proper API base URL configuration.
