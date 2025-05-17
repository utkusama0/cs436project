# Setup GCP Resources for Student Management System

# Variables
$PROJECT_ID = "student-management-system"
$REGION = "us-central1"
$ZONE = "us-central1-a"
$CLUSTER_NAME = "student-mgmt-cluster"

# Set the GCP project
Write-Host "Setting up GCP project: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Enable required APIs
Write-Host "Enabling required GCP APIs..."
gcloud services enable compute.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Create GKE Cluster
Write-Host "Creating GKE cluster: $CLUSTER_NAME"
gcloud container clusters create $CLUSTER_NAME `
    --zone $ZONE `
    --num-nodes 1 `
    --machine-type "e2-small"

# Get credentials for kubectl
gcloud container clusters get-credentials $CLUSTER_NAME --zone $ZONE --project $PROJECT_ID

# Create PostgreSQL VMs (using separate script)
Write-Host "Creating PostgreSQL VMs..."
./create-vm.ps1

# Deploy Cloud Functions
Write-Host "Deploying PDF Generator Cloud Function"
gcloud functions deploy pdf-generator `
    --runtime python39 `
    --trigger-http `
    --source ./cloud-functions/pdf-generator `
    --entry-point generate_pdf `
    --region $REGION

Write-Host "Deploying Email Notifier Cloud Function"
gcloud functions deploy email-notifier `
    --runtime python39 `
    --trigger-http `
    --source ./cloud-functions/email-notifier `
    --entry-point send_email `
    --region $REGION

Write-Host "GCP setup complete!"