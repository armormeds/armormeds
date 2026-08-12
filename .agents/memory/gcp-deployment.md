---
name: GCP deployment quirks (armormeds-production)
description: Hard-won lessons from migrating this app to Cloud Run + Cloud SQL; read before touching GCP deploy config or re-running DB migrations.
---

# GCP deployment quirks

Project: `armormeds-production`, region `us-central1`. App on Cloud Run (`armormeds`), DB on Cloud SQL Postgres 15 (`armormeds-db`, private IP 172.22.128.3, db `armormeds`, user `armormeds_app`).

- **VPC connectors kept failing** ("failed to get healthy") in this project. We use **Direct VPC egress** instead: Cloud Run deploys with `--network=armormeds-vpc --subnet=armormeds-run-subnet` (10.10.0.0/24). Do not reintroduce `--vpc-connector`.
  **Why:** two connector creations failed with internal errors; direct egress works and is cheaper.
- **Cloud Build runs as the compute default SA** (`562518692979-compute@...`), not the legacy cloudbuild SA. Any new permission (secrets, SQL, deploy) must be granted to the compute SA.
- **Manual builds need `--substitutions=COMMIT_SHA=$(git rev-parse HEAD)`** — `$COMMIT_SHA` is only auto-filled by triggers.
- **Postgres 15 blocks CREATE in `public` schema for non-owners.** Grants for `armormeds_app` were applied (USAGE/CREATE on schema, ALL on tables/sequences + default privileges). New DB users need the same.
- **DB imports:** use GCS + `gcloud sql import sql` (instance is private-IP only). Dumps must be `--schema=public` (the app-managed `stripe` schema has triggers depending on `public.set_updated_at_metadata()` — `--clean` dumps fail on it), without `CREATE SCHEMA public`, with `CREATE OR REPLACE FUNCTION`, imported with `--user=armormeds_app`.
  **How to apply:** `pg_dump --schema=public --no-owner --no-privileges`, strip `CREATE SCHEMA public;`/`COMMENT ON SCHEMA public`, sed `CREATE FUNCTION`→`CREATE OR REPLACE FUNCTION`.
- **App tolerates missing Twilio/DB env** at boot (warns, keeps serving); DB-backed routes crash the instance (Cloud Run raw 503) when queries fail — a raw "Service Unavailable" on API routes usually means a DB problem, not a routing one.
- The app **self-manages Stripe webhooks** at startup (deletes orphaned ones pointing at dead URLs, registers for the current host) and self-seeds/rebuilds its `stripe` schema.
- HIPAA BAA for GCP is accepted at **console → IAM & Admin → Privacy & Security** (`/iam-admin/privacy`), self-serve; it was accepted for this account Aug 2026.
