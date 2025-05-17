# Main Terraform configuration file for Student Management System

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Enable APIs
resource "google_project_service" "compute_api" {
  service            = "compute.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "container_api" {
  service            = "container.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloudfunctions_api" {
  service            = "cloudfunctions.googleapis.com"
  disable_on_destroy = false
}

# Create GKE Cluster
resource "google_container_cluster" "primary" {
  name               = var.cluster_name
  location           = var.zone
  initial_node_count = 1
  
  # Use cheaper node configuration
  node_config {
    machine_type = "e2-small"
    disk_size_gb = 10
    
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
  
  depends_on = [
    google_project_service.compute_api,
    google_project_service.container_api
  ]
}

# Create PostgreSQL VMs (Primary)
resource "google_compute_instance" "postgres_primary" {
  name         = "postgres-primary"
  machine_type = "e2-small" # Cheaper instance
  zone         = var.zone
  
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
      size  = 10 # Smaller disk
    }
  }
  
  network_interface {
    network = "default"
    access_config {}
  }
  
  tags = ["postgres"]
  
  metadata_startup_script = file("${path.module}/scripts/postgres_setup.sh")
  
  depends_on = [
    google_project_service.compute_api
  ]
}

# Create PostgreSQL VMs (Secondary)
resource "google_compute_instance" "postgres_secondary" {
  name         = "postgres-secondary"
  machine_type = "e2-small" # Cheaper instance
  zone         = var.zone
  
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
      size  = 10 # Smaller disk
    }
  }
  
  network_interface {
    network = "default"
    access_config {}
  }
  
  tags = ["postgres"]
  
  metadata_startup_script = templatefile("${path.module}/scripts/postgres_replica_setup.sh", {
    primary_ip = google_compute_instance.postgres_primary.network_interface.0.network_ip
  })
  
  depends_on = [
    google_compute_instance.postgres_primary
  ]
}

# Create firewall rule for PostgreSQL
resource "google_compute_firewall" "postgres_firewall" {
  name    = "postgres-firewall"
  network = "default"
  
  allow {
    protocol = "tcp"
    ports    = ["5432"]
  }
  
  source_ranges = ["10.0.0.0/8"]
  target_tags   = ["postgres"]
}

# Cloud Functions
resource "google_storage_bucket" "function_bucket" {
  name     = "${var.project_id}-functions"
  location = var.region
}

# PDF Generator function
resource "google_cloudfunctions_function" "pdf_generator" {
  name        = "pdf-generator"
  description = "PDF Generator Function"
  runtime     = "python39"
  
  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.function_bucket.name
  source_archive_object = google_storage_bucket_object.pdf_function_zip.name
  trigger_http          = true
  entry_point           = "generate_pdf"
  
  environment_variables = {
    BUCKET_NAME = google_storage_bucket.pdf_bucket.name
  }
  
  depends_on = [
    google_project_service.cloudfunctions_api
  ]
}

resource "google_storage_bucket_object" "pdf_function_zip" {
  name   = "pdf-function.zip"
  bucket = google_storage_bucket.function_bucket.name
  source = "cloud-functions-archive/pdf-generator.zip"
}

# Email Notifier function
resource "google_cloudfunctions_function" "email_notifier" {
  name        = "email-notifier"
  description = "Email Notification Function"
  runtime     = "python39"
  
  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.function_bucket.name
  source_archive_object = google_storage_bucket_object.email_function_zip.name
  trigger_http          = true
  entry_point           = "send_email"
  
  environment_variables = {
    SENDGRID_API_KEY = var.sendgrid_api_key
    FROM_EMAIL       = var.from_email
  }
  
  depends_on = [
    google_project_service.cloudfunctions_api
  ]
}

resource "google_storage_bucket_object" "email_function_zip" {
  name   = "email-function.zip"
  bucket = google_storage_bucket.function_bucket.name
  source = "cloud-functions-archive/email-notifier.zip"
}

# Storage bucket for PDF reports
resource "google_storage_bucket" "pdf_bucket" {
  name     = "${var.project_id}-reports"
  location = var.region
}
