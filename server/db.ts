import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import "dotenv/config";

const { Pool } = pg;

let _pool: pg.Pool;

if (!process.env.DATABASE_URL) {
  console.error(
    "⚠️  WARNING: DATABASE_URL is not set. The server will start but all database operations will fail."
  );
  _pool = new Pool();
} else {
  try {
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
    _pool.on("error", (err) => {
      console.error("⚠️  Postgres pool error (non-fatal):", err.message);
    });
  } catch (err) {
    console.error(
      "⚠️  Failed to construct Postgres Pool — DATABASE_URL is likely malformed. " +
        "If your password contains special characters like @ : / ? # & + space, they MUST be URL-encoded (e.g. @ → %40). " +
        "Server will start but DB operations will fail. Error:",
      (err as Error).message
    );
    _pool = new Pool();
  }
}

export const pool = _pool;
export const db = drizzle(pool, { schema });

/**
 * Ensure all required tables exist using CREATE TABLE IF NOT EXISTS.
 * Each statement runs independently so existing tables are skipped without
 * rolling back the rest.  Safe to call on every boot.
 */
export async function runAutoMigrate() {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️  Skipping auto-migrate: DATABASE_URL not set.");
    return;
  }

  const statements = [
    `CREATE TABLE IF NOT EXISTS "admin_users" (
      "id" serial PRIMARY KEY NOT NULL,
      "email" text NOT NULL,
      "name" text NOT NULL,
      "password_hash" text NOT NULL,
      "role" text DEFAULT 'staff' NOT NULL,
      "permissions" jsonb NOT NULL,
      "is_active" text DEFAULT 'true' NOT NULL,
      "last_login_at" timestamp,
      "created_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "admin_users_email_unique" UNIQUE("email")
    )`,
    `CREATE TABLE IF NOT EXISTS "leads" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" text NOT NULL,
      "email" text NOT NULL,
      "phone" text,
      "medication_interest" text,
      "message" text,
      "status" text DEFAULT 'new' NOT NULL,
      "payment_status" text DEFAULT 'pending' NOT NULL,
      "prescription_status" text DEFAULT 'pending' NOT NULL,
      "prescription_notified_at" timestamp,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "goals" jsonb,
      "state" text,
      "patient_type" text,
      "previous_treatments" text,
      "solution_types" jsonb,
      "medical_conditions" jsonb,
      "current_medications" text,
      "allergies" text,
      "date_of_birth" text,
      "height_feet" text,
      "height_inches" text,
      "weight" text,
      "sex" text,
      "has_pancreatitis" text,
      "has_thyroid_cancer" text,
      "has_kidney_issues" text,
      "has_diabetes" text,
      "is_pregnant" text,
      "previous_glp" text,
      "glp_details" text,
      "consent_given" text,
      "goal_weight" text,
      "blood_pressure_range" text,
      "heart_rate_range" text,
      "has_opiate_use" text,
      "has_prior_surgery" text,
      "has_disqualifying_conditions" jsonb,
      "has_monitoring_conditions" jsonb,
      "document_paths" jsonb,
      "lead_source" text
    )`,
    `CREATE TABLE IF NOT EXISTS "products" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" text NOT NULL,
      "description" text NOT NULL,
      "price" text NOT NULL,
      "image" text,
      "benefits" jsonb,
      "category" text DEFAULT 'general' NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "prescriptions" (
      "id" serial PRIMARY KEY NOT NULL,
      "lead_id" integer NOT NULL,
      "patient_name" text NOT NULL,
      "patient_dob" text,
      "patient_address" text,
      "patient_phone" text,
      "medication" text NOT NULL,
      "dosage" text NOT NULL,
      "quantity" text NOT NULL,
      "refills" text DEFAULT '0' NOT NULL,
      "instructions" text NOT NULL,
      "provider_name" text NOT NULL,
      "provider_npi" text,
      "provider_license" text,
      "provider_signature" text,
      "prescription_number" text NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "status" text DEFAULT 'active' NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "appointments" (
      "id" serial PRIMARY KEY NOT NULL,
      "lead_id" integer NOT NULL,
      "patient_name" text NOT NULL,
      "patient_email" text NOT NULL,
      "patient_phone" text,
      "doctor_name" text NOT NULL,
      "reason" text NOT NULL,
      "scheduled_at" timestamp NOT NULL,
      "duration" integer DEFAULT 30 NOT NULL,
      "video_link" text,
      "status" text DEFAULT 'scheduled' NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "completed_at" timestamp
    )`,
    `CREATE TABLE IF NOT EXISTS "call_notes" (
      "id" serial PRIMARY KEY NOT NULL,
      "appointment_id" integer NOT NULL,
      "author_name" text NOT NULL,
      "note_type" text DEFAULT 'general' NOT NULL,
      "content" text NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "lead_activities" (
      "id" serial PRIMARY KEY NOT NULL,
      "lead_id" integer NOT NULL,
      "type" text NOT NULL,
      "summary" text NOT NULL,
      "meta" jsonb,
      "author_name" text,
      "created_at" timestamp DEFAULT now() NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "lead_notes" (
      "id" serial PRIMARY KEY NOT NULL,
      "lead_id" integer NOT NULL,
      "author_name" text NOT NULL,
      "content" text NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "lead_tags" (
      "id" serial PRIMARY KEY NOT NULL,
      "lead_id" integer NOT NULL,
      "tag" text NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "lead_tasks" (
      "id" serial PRIMARY KEY NOT NULL,
      "lead_id" integer NOT NULL,
      "title" text NOT NULL,
      "due_at" timestamp,
      "status" text DEFAULT 'pending' NOT NULL,
      "assigned_to" text,
      "created_by" text NOT NULL,
      "completed_at" timestamp,
      "created_at" timestamp DEFAULT now() NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
      "id" serial PRIMARY KEY NOT NULL,
      "email" text NOT NULL,
      "token" text NOT NULL,
      "type" text NOT NULL,
      "expires_at" timestamp NOT NULL,
      "used_at" timestamp,
      "created_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
    )`,
    `CREATE TABLE IF NOT EXISTS "patient_users" (
      "id" serial PRIMARY KEY NOT NULL,
      "email" text NOT NULL,
      "name" text NOT NULL,
      "password_hash" text,
      "google_id" text,
      "avatar" text,
      "phone" text,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "last_login_at" timestamp,
      CONSTRAINT "patient_users_email_unique" UNIQUE("email")
    )`,
    `CREATE TABLE IF NOT EXISTS "provider_availability" (
      "id" serial PRIMARY KEY NOT NULL,
      "provider_name" text NOT NULL,
      "day_of_week" integer NOT NULL,
      "start_at" timestamp NOT NULL,
      "end_at" timestamp NOT NULL,
      "status" text DEFAULT 'available' NOT NULL,
      "notes" text,
      "created_at" timestamp DEFAULT now() NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "shipments" (
      "id" serial PRIMARY KEY NOT NULL,
      "prescription_id" integer,
      "lead_id" integer NOT NULL,
      "carrier" text NOT NULL,
      "tracking_number" text NOT NULL,
      "status" text DEFAULT 'label_created' NOT NULL,
      "notes" text,
      "shipped_at" timestamp,
      "estimated_delivery" timestamp,
      "delivered_at" timestamp,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "sms_logs" (
      "id" serial PRIMARY KEY NOT NULL,
      "recipient_phone" text NOT NULL,
      "recipient_name" text,
      "message" text NOT NULL,
      "message_type" text DEFAULT 'custom' NOT NULL,
      "sent_by" text DEFAULT 'system' NOT NULL,
      "twilio_sid" text,
      "status" text DEFAULT 'sent' NOT NULL,
      "error_message" text,
      "lead_id" integer,
      "sent_at" timestamp DEFAULT now() NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "conversations" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" text NOT NULL,
      "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "messages" (
      "id" serial PRIMARY KEY NOT NULL,
      "conversation_id" integer NOT NULL,
      "role" text NOT NULL,
      "content" text NOT NULL,
      "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`,
    `ALTER TABLE "messages" ADD CONSTRAINT IF NOT EXISTS "messages_conversation_id_conversations_id_fk"
      FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE cascade ON UPDATE no action`,
  ];

  let created = 0;
  let skipped = 0;
  for (const sql of statements) {
    try {
      await pool.query(sql);
      created++;
    } catch (err: any) {
      // 42P07 = duplicate_table, 42710 = duplicate_object (constraint) — safe to skip
      if (err.code === "42P07" || err.code === "42710") {
        skipped++;
      } else {
        console.error("⚠️  Migration statement failed (non-fatal):", err.message, "\nSQL:", sql.slice(0, 80));
      }
    }
  }
  console.log(`✅ Auto-migrate complete: ${created} statements run, ${skipped} already existed.`);
}
