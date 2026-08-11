#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Populate GCP Secret Manager from environment / manual input
# Run from Cloud Shell AFTER running setup.sh
# ─────────────────────────────────────────────────────────────────────────────
# Usage: paste each secret value when prompted
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

PROJECT_ID="armormeds-production"
gcloud config set project "$PROJECT_ID"

populate_secret() {
  local NAME="$1"
  echo ""
  echo "Enter value for $NAME (input hidden):"
  read -rs VALUE
  echo -n "$VALUE" | gcloud secrets versions add "$NAME" --data-file=-
  echo "  ✅ $NAME saved"
}

populate_secret SESSION_SECRET
populate_secret STRIPE_SECRET_KEY
populate_secret VITE_STRIPE_PUBLIC_KEY
populate_secret TWILIO_ACCOUNT_SID
populate_secret TWILIO_AUTH_TOKEN
populate_secret TWILIO_PHONE_NUMBER

echo ""
echo "─────────────────────────────────────────────────────────────────────────"
echo "DATABASE_URL must be set after Cloud SQL is fully provisioned."
echo "Format: postgresql://USER:PASSWORD@PRIVATE_IP:5432/armormeds"
echo "Run:  echo -n 'your-connection-string' | gcloud secrets versions add DATABASE_URL --data-file=-"
echo "─────────────────────────────────────────────────────────────────────────"
