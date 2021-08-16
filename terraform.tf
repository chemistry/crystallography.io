variable "project_id" {}
variable "domain" {}
variable "graphql_service_name" {}
variable "region" {
    default = "europe-west1"
}

variable "image" {
    default = "gcr.io/crystallography-io/graphql-api:latest"
}

terraform {
    required_version = ">= 0.14"

    required_providers {
        # Cloud Run support was added on 3.3.0
        google = ">= 3.3"
    }
}

provider "google" {
    project = var.project_id
}

# Enables the Cloud Run API
resource "google_project_service" "run_api" {
    service = "run.googleapis.com"
    disable_on_destroy = true
}

# Create the Cloud Run service
resource "google_cloud_run_service" "run_service" {
    name = var.graphql_service_name
    location = var.region
    autogenerate_revision_name = true

    metadata {
        namespace = var.project_id
    }

    template {
        spec {
            containers {
                image = data.external.image_digest.result.image
            }
        }
    }

    traffic {
        percent         = 100
        latest_revision = true
    }

    # Waits for the Cloud Run API to be enabled
    depends_on = [google_project_service.run_api]
}

# Allow unauthenticated users to invoke the service
resource "google_cloud_run_service_iam_member" "run_all_users" {
    service  = google_cloud_run_service.run_service.name
    location = google_cloud_run_service.run_service.location
    role     = "roles/run.invoker"
    member   = "allUsers"
}

resource "google_cloud_run_domain_mapping" "run_service" {
    location = var.region
    name     = var.domain

    metadata {
        namespace = var.project_id
    }

    spec {
        route_name = google_cloud_run_service.run_service.name
    }
}

# WORKAROUND
data "external" "image_digest" {
  program = ["bash", "get_latest_tag.sh", var.project_id, var.graphql_service_name]
}
# END WORKAROUND

# Display the service URL
output "service_url" {
    value = google_cloud_run_service.run_service.status[0].url
}
