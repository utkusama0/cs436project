# Variables for Student Management System Terraform configuration

variable "project_id" {
  description = "The GCP project ID"
  type        = string
  default     = "student-management-system"
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The GCP zone"
  type        = string
  default     = "us-central1-a"
}

variable "cluster_name" {
  description = "The name of the GKE cluster"
  type        = string
  default     = "student-mgmt-cluster"
}

variable "sendgrid_api_key" {
  description = "SendGrid API key for sending emails"
  type        = string
  sensitive   = true
}

variable "from_email" {
  description = "The email address to send notifications from"
  type        = string
  default     = "noreply@studentmgmt.com"
}

variable "db_password" {
  description = "PostgreSQL database password"
  type        = string
  sensitive   = true
  default     = "123456"
}
