# Student Management System – Deployment Guide 🚀

This guide walks you through deploying the **Student Management System** on Google Cloud Platform (GCP). Before you begin, **clone the repository** to your local machine and open a terminal in the project’s root directory.

---

## Prerequisites

* A **GCP project** with billing enabled.
* **`gcloud`** CLI installed and authenticated (`gcloud init`).
* **`kubectl`** installed.
* **Docker** installed and configured to push to Google Container Registry (GCR) **or** Artifact Registry (`gcloud auth configure-docker`).
* Repository cloned locally.
* `db_setup/scripts.sql` **and** `db_setup/populate_db_fixed.py` present in the repo.

---

## 1  Environment Setup (GCP) ☁️

### 1.1  Set project‑wide configuration

```bash
# 1  Replace with **your** GCP project ID
aexport PROJECT_ID="your-gcp-project-id"

# 2  Point gcloud at that project
gcloud config set project "$PROJECT_ID"
```

### 1.2  Enable required GCP APIs

```bash
# Core services for this deployment
gcloud services enable \
    container.googleapis.com         \  # Google Kubernetes Engine
    cloudfunctions.googleapis.com     \  # Cloud Functions
    secretmanager.googleapis.com      \  # Secret storage
    compute.googleapis.com            \  # VMs / networking
    artifactregistry.googleapis.com      # Container registry (or GCR)
```

Additional APIs often required by **other** features in the repo or your workflow:

* Cloud Monitoring API `monitoring.googleapis.com`
* Cloud Logging API `logging.googleapis.com`
* Analytics Hub API `analyticshub.googleapis.com`
* **BigQuery** family `bigquery.googleapis.com`, `bigqueryconnection.googleapis.com`
* Cloud Dataplex API `dataplex.googleapis.com`
* Cloud Datastore / Firestore `datastore.googleapis.com`
* Cloud SQL API `sqladmin.googleapis.com`
* Cloud Trace API `cloudtrace.googleapis.com`
* Dataform API `dataform.googleapis.com`

> Enable any that your application explicitly relies on.

### 1.3  Create a GKE cluster

```bash
# Three‑node development cluster
gcloud container clusters create student-management-cluster \
    --num-nodes=3 \
    --zone=us-central1-a \
    --machine-type=e2-medium \
    --project "$PROJECT_ID"

# Fetch credentials so kubectl can talk to it
gcloud container clusters get-credentials student-management-cluster \
    --zone us-central1-a --project "$PROJECT_ID"
```

### 1.4  Provision the **primary** PostgreSQL VM

```bash
gcloud compute instances create postgres-primary \
    --project "$PROJECT_ID" \
    --zone us-central1-a \
    --machine-type e2-medium \
    --image-family debian-11 --image-project debian-cloud \
    --boot-disk-size 100GB \
    --tags postgres-db,postgres-primary

# External IP for application connectivity
export POSTGRES_PRIMARY_VM_IP=$(gcloud compute instances describe postgres-primary \
  --zone us-central1-a --project "$PROJECT_ID" \
  --format 'get(networkInterfaces[0].accessConfigs[0].natIP)')
echo "Primary PostgreSQL IP → $POSTGRES_PRIMARY_VM_IP"
```

### 1.5  Provision the **replica** PostgreSQL VM

```bash
gcloud compute instances create postgres-replica \
    --project "$PROJECT_ID" \
    --zone us-central1-a \
    --machine-type e2-medium \
    --image-family debian-11 --image-project debian-cloud \
    --boot-disk-size 100GB \
    --tags postgres-db,postgres-replica

# Useful IPs
export POSTGRES_REPLICA_VM_IP=$(gcloud compute instances describe postgres-replica \
  --zone us-central1-a --project "$PROJECT_ID" \
  --format 'get(networkInterfaces[0].accessConfigs[0].natIP)')
export POSTGRES_PRIMARY_INTERNAL_IP=$(gcloud compute instances describe postgres-primary \
  --zone us-central1-a --project "$PROJECT_ID" \
  --format 'get(networkInterfaces[0].networkIP)')
```

### 1.6  Open the firewall for PostgreSQL traffic

```bash
# 1  Allow GKE pods → PostgreSQL VMs (5432)
export GKE_POD_CIDR=$(gcloud container clusters describe student-management-cluster \
    --zone us-central1-a --project "$PROJECT_ID" --format 'get(clusterIpv4Cidr)')

gcloud compute firewall-rules create pg-allow-gke-pods \
    --project "$PROJECT_ID" --allow tcp:5432 \
    --source-ranges "$GKE_POD_CIDR" --target-tags postgres-db

# 2  Allow replica → primary streaming replication

gcloud compute firewall-rules create pg-allow-replica-to-primary \
    --project "$PROJECT_ID" --allow tcp:5432 \
    --source-tags postgres-replica --target-tags postgres-primary
```

---

## 2  Database Setup 🐘

### 2.1  Initialise the **primary** instance

```bash
# SSH into the primary
 gcloud compute ssh postgres-primary --zone us-central1-a --project "$PROJECT_ID"

# Install PostgreSQL 13+
 sudo apt update && sudo apt install -y postgresql postgresql-contrib git

# Create user & DB
 sudo -u postgres psql -c "CREATE USER studentadmin WITH PASSWORD 'yoursecurepassword';"
 sudo -u postgres psql -c "CREATE DATABASE studentdb OWNER studentadmin;"

# Clone repo (or scp scripts) & load schema
 git clone <your‑repo‑url> repo && cd repo/db_setup
 sudo -u postgres psql -d studentdb -f scripts.sql

# Seed with Faker data
 sudo apt install -y python3 python3-pip && pip3 install psycopg2-binary Faker
 sed -i "s/localhost/127.0.0.1/" populate_db_fixed.py  # ensure host
 python3 populate_db_fixed.py
```

#### Configure for streaming replication & remote access

```bash
PG_DIR=$(basename $(find /etc/postgresql -mindepth 1 -maxdepth 1 -type d | head -n1))

# postgresql.conf tweaks
sudo tee -a /etc/postgresql/$PG_DIR/main/postgresql.conf > /dev/null <<EOF
listen_addresses = '*'
wal_level       = replica
max_wal_senders = 10
max_replication_slots = 10
EOF

# pg_hba.conf rules
sudo tee -a /etc/postgresql/$PG_DIR/main/pg_hba.conf > /dev/null <<EOF
# GKE pods
host studentdb studentadmin ${GKE_POD_CIDR} md5
# Replica
host replication replication_user ${POSTGRES_REPLICA_VM_IP}/32 scram-sha-256
EOF

# Replication role
sudo -u postgres psql -c "CREATE USER replication_user WITH REPLICATION LOGIN PASSWORD 'yourreplicationpassword';"

sudo systemctl restart postgresql && exit
```

### 2.2  Initialise the **replica** instance

```bash
# SSH in
gcloud compute ssh postgres-replica --zone us-central1-a --project "$PROJECT_ID"

sudo apt update && sudo apt install -y postgresql postgresql-contrib
PG_DIR=$(basename $(find /etc/postgresql -mindepth 1 -maxdepth 1 -type d | head -n1))

# Wipe data folder and base backup
sudo systemctl stop postgresql
sudo -u postgres rm -rf /var/lib/postgresql/$PG_DIR/main/*

sudo -u postgres pg_basebackup \
  -h $POSTGRES_PRIMARY_INTERNAL_IP -U replication_user -p 5432 \
  -D /var/lib/postgresql/$PG_DIR/main -Fp -Xs -P -R

sudo chown -R postgres:postgres /var/lib/postgresql/$PG_DIR/main
sudo chmod 0700 /var/lib/postgresql/$PG_DIR/main
sudo systemctl start postgresql && exit
```

#### Verifying replication

```bash
# From your local shell
 gcloud compute ssh postgres-primary --zone us-central1-a --project "$PROJECT_ID" \
   --command "sudo -u postgres psql -c 'SELECT client_addr,state,write_lag,flush_lag,replay_lag FROM pg_stat_replication;'"
```

### 2.3  Point micro‑services at the database

Update each deployment (or Secret) so env‑vars reference the **external IP** of `postgres-primary`:

```text
DATABASE_URL=postgresql://studentadmin:yoursecurepassword@${POSTGRES_PRIMARY_VM_IP}:5432/studentdb
```

---

## 3  Cloud Functions 🚀

```bash
gcloud functions deploy spring-term-info \
  --project "$PROJECT_ID" --region us-central1 \
  --runtime python39 --trigger-http --allow-unauthenticated \
  --source cloud-functions/spring-term-info

export SPRING_TERM_URL=$(gcloud functions describe spring-term-info \
  --project "$PROJECT_ID" --region us-central1 --format 'get(https_trigger.url)')
```

Inject `SPRING_TERM_URL` into the React frontend (e.g. `REACT_APP_SPRING_TERM_URL`).

---

## 4  Kubernetes Deployment ☸️

### 4.1  Namespace

```bash
kubectl create namespace student-management
```

### 4.2  Build & push images

```bash
# Student Service – repeat analogously for other services
 docker build -t gcr.io/$PROJECT_ID/student-service:latest \
        -f backend/student_service/Dockerfile backend/student_service
 docker push gcr.io/$PROJECT_ID/student-service:latest

# Frontend
 docker build -t gcr.io/$PROJECT_ID/frontend:latest \
        -f frontend/student-management-ui/Dockerfile frontend/student-management-ui
 docker push gcr.io/$PROJECT_ID/frontend:latest
```

### 4.3  Apply manifests (Kustomize)

```bash
kubectl apply -k k8s/base -n student-management
```

### 4.4  Restart deployments to pick up new images

```bash
kubectl -n student-management rollout restart deployment/student-service
kubectl -n student-management rollout restart deployment/course-service
kubectl -n student-management rollout restart deployment/grade-service
kubectl -n student-management rollout restart deployment/frontend
```

### 4.5  Ingress & external IP

```bash
kubectl get ingress -n student-management -w  # wait until ADDRESS is populated
export INGRESS_IP=$(kubectl get ingress -n student-management -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')
```

> If you rely on **Nginx Ingress** (annotations such as `kubernetes.io/ingress.class: nginx`) make sure the controller is installed first.

---

## 5  Accessing the application 🌐

| Component         | URL                                 |
| ----------------- | ----------------------------------- |
| Frontend          | `http://${INGRESS_IP}`              |
| Backend (example) | `http://${INGRESS_IP}/api/students` |

---

## 6  Performance Testing (Locust) 🪰

```bash
pip install locust
locust -f tests/locustfile.py --host "http://$INGRESS_IP"
```

* Web UI: [http://localhost:8089](http://localhost:8089)
* **Tip:** While a load test is running, view current pod count:

  ```bash
  kubectl get hpa -n student-management
  kubectl top pods -n student-management
  ```
* **Cost visibility:** use **Billing → Reports** in the GCP console and filter by **Resource → Kubernetes Engine** for the test time‑window.

---

## 7  Monitoring & Logging 📊

| Task                | Command                                                              |
| ------------------- | -------------------------------------------------------------------- |
| Tail pod logs       | `kubectl logs -f -n student-management <pod>`                        |
| Live metrics        | **GCP Console → Monitoring → Metrics Explorer**                      |
| HPA status          | `kubectl get hpa -n student-management`                              |
| Cloud Function logs | `gcloud functions logs read spring-term-info --region us-central1`   |
| PostgreSQL logs     | `sudo tail -f /var/log/postgresql/postgresql-*.log` (run on each VM) |

---

## 8  Cost optimisation 💰

1. Use **e2-medium** (or smaller) for dev/test.
2. Enable **HPA** to match traffic.
3. Prefer **Cloud Functions** for sporadic tasks.
4. Regularly audit **Billing → Reports** and shut down idle resources.

> **Important:** Always delete or stop resources when you’re done to avoid charges.

---

## 9  Cleanup 🧹

```bash
# GKE
 gcloud container clusters delete student-management-cluster \
   --zone us-central1-a --project "$PROJECT_ID" --quiet

# Cloud Function
 gcloud functions delete spring-term-info --region us-central1 --project "$PROJECT_ID" --quiet

# PostgreSQL VMs
 gcloud compute instances delete postgres-primary postgres-replica \
   --zone us-central1-a --project "$PROJECT_ID" --quiet

# Firewall rules
 gcloud compute firewall-rules delete pg-allow-gke-pods pg-allow-replica-to-primary \
   --project "$PROJECT_ID" --quiet

# (Optional) Delete container images to reclaim storage
# gcloud container images list --repository gcr.io/$PROJECT_ID
# gcloud container images delete gcr.io/$PROJECT_ID/frontend:latest --force-delete-tags --quiet
```

---
