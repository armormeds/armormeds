#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# ArmorMeds GCP one-time infrastructure setup
# Run this from Cloud Shell (console.cloud.google.com → >_ icon)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

PROJECT_ID="armormeds-production"
REGION="us-central1"
VPC_NAME="armormeds-vpc"
SUBNET_NAME="armormeds-subnet"
CONNECTOR_NAME="armormeds-connector"
SA_NAME="armormeds-run"
REGISTRY="armormeds"

echo "▶ Setting project..."
gcloud config set project "$PROJECT_ID"

# ── Artifact Registry ────────────────────────────────────────────────────────
echo "▶ Creating Artifact Registry repository..."
gcloud artifacts repositories create "$REGISTRY" \
  --repository-format=docker \
  --location="$REGION" \
  --description="ArmorMeds Docker images" \
  --quiet || echo "  (already exists)"

# ── VPC + Subnet ─────────────────────────────────────────────────────────────
echo "▶ Creating VPC..."
gcloud compute networks create "$VPC_NAME" \
  --subnet-mode=custom \
  --quiet || echo "  (already exists)"

echo "▶ Creating subnet..."
gcloud compute networks subnets create "$SUBNET_NAME" \
  --network="$VPC_NAME" \
  --region="$REGION" \
  --range="10.8.0.0/28" \
  --quiet || echo "  (already exists)"

# ── Serverless VPC Access connector ─────────────────────────────────────────
echo "▶ Creating VPC Access connector (Cloud Run → Cloud SQL)..."
gcloud compute networks vpc-access connectors create "$CONNECTOR_NAME" \
  --network="$VPC_NAME" \
  --region="$REGION" \
  --range="10.8.0.0/28" \
  --quiet || echo "  (already exists)"

# ── Service Account for Cloud Run ────────────────────────────────────────────
echo "▶ Creating service account..."
gcloud iam service-accounts create "$SA_NAME" \
  --display-name="ArmorMeds Cloud Run SA" \
  --quiet || echo "  (already exists)"

SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant Secret Manager access (so Cloud Run can read secrets)
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor" \
  --quiet

# Grant Cloud SQL Client access
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/cloudsql.client" \
  --quiet

# ── Secrets in Secret Manager ────────────────────────────────────────────────
echo "▶ Creating secret placeholders in Secret Manager..."
echo "  NOTE: After running this, populate each secret with:"
echo "        gcloud secrets versions add SECRET_NAME --data-file=-"
echo ""

for SECRET in SESSION_SECRET STRIPE_SECRET_KEY VITE_STRIPE_PUBLIC_KEY \
              TWILIO_ACCOUNT_SID TWILIO_AUTH_TOKEN TWILIO_PHONE_NUMBER \
              DATABASE_URL; do
  gcloud secrets create "$SECRET" \
    --replication-policy=user-managed \
    --locations="$REGION" \
    --quiet 2>/dev/null && echo "  Created: $SECRET" || echo "  Already exists: $SECRET"
done

# ── Cloud SQL (PostgreSQL 15) ─────────────────────────────────────────────────
echo ""
echo "▶ Creating Cloud SQL instance (this takes ~5 minutes)..."
gcloud sql instances create armormeds-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region="$REGION" \
  --network="$VPC_NAME" \
  --no-assign-ip \
  --storage-type=SSD \
  --storage-size=10GB \
  --storage-auto-increase \
  --backup-start-time=02:00 \
  --enable-bin-log \
  --deletion-protection \
  --quiet || echo "  (already exists)"

echo ""
echo "▶ Creating database..."
gcloud sql databases create armormeds \
  --instance=armormeds-db \
  --quiet || echo "  (already exists)"

echo ""
echo "─────────────────────────────────────────────────────────────────────────"
echo "✅ Infrastructure ready."
echo ""
echo "Next steps:"
echo "  1. Populate each secret:  gcloud secrets versions add SESSION_SECRET --data-file=-"
echo "  2. Connect Cloud Build to GitHub (console → Cloud Build → Triggers)"
echo "  3. Set DATABASE_URL secret to your Cloud SQL private IP connection string"
echo "  4. Run first deploy:  gcloud builds submit --config cloudbuild.yaml ."
echo "─────────────────────────────────────────────────────────────────────────"
