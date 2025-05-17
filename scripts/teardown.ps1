# Script to tear down all GCP resources
# Warning: This will delete all resources created in the project

# Variables
$PROJECT_ID = "student-management-system"
$REGION = "us-central1"
$ZONE = "us-central1-a"
$CLUSTER_NAME = "student-mgmt-cluster"
$VM_NAME_PRIMARY = "postgres-primary"
$VM_NAME_SECONDARY = "postgres-secondary"

# Set the GCP project
Write-Host "Setting GCP project: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Delete Cloud Functions
Write-Host "Deleting Cloud Functions..."
gcloud functions delete pdf-generator --region=$REGION --quiet
gcloud functions delete email-notifier --region=$REGION --quiet

# Delete GKE Cluster
Write-Host "Deleting GKE Cluster: $CLUSTER_NAME"
gcloud container clusters delete $CLUSTER_NAME --zone=$ZONE --quiet

# Delete VMs
Write-Host "Deleting PostgreSQL VMs..."
gcloud compute instances delete $VM_NAME_PRIMARY --zone=$ZONE --quiet
gcloud compute instances delete $VM_NAME_SECONDARY --zone=$ZONE --quiet

# Delete firewall rules
Write-Host "Deleting firewall rules..."
gcloud compute firewall-rules delete postgres-rule --quiet

Write-Host "Teardown complete!"