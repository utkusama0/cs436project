# Script to create VMs for PostgreSQL primary and secondary instances

# Variables
$PROJECT_ID = "student-management-system"
$REGION = "us-central1"
$ZONE = "us-central1-a"
$VM_NAME_PRIMARY = "postgres-primary"
$VM_NAME_SECONDARY = "postgres-secondary"
$DB_PASSWORD = "123456"

# Set the GCP project
Write-Host "Setting up GCP project: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Create VMs for PostgreSQL
Write-Host "Creating VM for PostgreSQL Primary: $VM_NAME_PRIMARY"
gcloud compute instances create $VM_NAME_PRIMARY `
    --zone $ZONE `
    --machine-type "e2-small" `
    --image-family "debian-11" `
    --image-project "debian-cloud" `
    --boot-disk-size "10GB" `
    --tags "postgres" `
    --metadata startup-script="#!/bin/bash
    apt-get update
    apt-get install -y postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
    
    # Configure PostgreSQL
    sudo -u postgres psql -c \"ALTER USER postgres WITH PASSWORD '$DB_PASSWORD';\"
    sudo -u postgres psql -c 'CREATE DATABASE student_management;'
    
    # Update pg_hba.conf to allow remote connections
    echo 'host all all 0.0.0.0/0 md5' >> /etc/postgresql/13/main/pg_hba.conf
    echo \"listen_addresses = '*'\" >> /etc/postgresql/13/main/postgresql.conf
    
    # Restart PostgreSQL to apply changes
    systemctl restart postgresql"

Write-Host "Creating VM for PostgreSQL Secondary: $VM_NAME_SECONDARY"
gcloud compute instances create $VM_NAME_SECONDARY `
    --zone $ZONE `
    --machine-type "e2-small" `
    --image-family "debian-11" `
    --image-project "debian-cloud" `
    --boot-disk-size "10GB" `
    --tags "postgres" `
    --metadata startup-script="#!/bin/bash
    apt-get update
    apt-get install -y postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
    
    # Configure PostgreSQL as a replica
    systemctl stop postgresql
    rm -rf /var/lib/postgresql/13/main
    su - postgres -c 'pg_basebackup -h <PRIMARY_IP> -U postgres -D /var/lib/postgresql/13/main -P -R'
    echo \"primary_conninfo = 'host=<PRIMARY_IP> port=5432 user=postgres password=$DB_PASSWORD'\" >> /etc/postgresql/13/main/postgresql.conf
    touch /var/lib/postgresql/13/main/standby.signal
    systemctl start postgresql"

# Create firewall rules for PostgreSQL access
Write-Host "Creating firewall rules for PostgreSQL access"
gcloud compute firewall-rules create postgres-rule `
    --allow tcp:5432 `
    --target-tags "postgres" `
    --source-ranges "10.0.0.0/8"

Write-Host "VM creation complete. Please replace <PRIMARY_IP> in the secondary VM with the actual IP address of the primary VM."