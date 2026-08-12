CREATE TABLE "admin_users" (
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
);
--> statement-breakpoint
CREATE TABLE "appointments" (
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
);
--> statement-breakpoint
CREATE TABLE "call_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"author_name" text NOT NULL,
	"note_type" text DEFAULT 'general' NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer NOT NULL,
	"type" text NOT NULL,
	"summary" text NOT NULL,
	"meta" jsonb,
	"author_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer NOT NULL,
	"author_name" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer NOT NULL,
	"tag" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer NOT NULL,
	"title" text NOT NULL,
	"due_at" timestamp,
	"status" text DEFAULT 'pending' NOT NULL,
	"assigned_to" text,
	"created_by" text NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
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
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"type" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "patient_users" (
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
);
--> statement-breakpoint
CREATE TABLE "prescriptions" (
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
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" text NOT NULL,
	"image" text NOT NULL,
	"benefits" jsonb NOT NULL,
	"category" text DEFAULT 'weight-loss' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provider_availability" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor_name" text NOT NULL,
	"start_at" timestamp NOT NULL,
	"end_at" timestamp NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipments" (
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
);
--> statement-breakpoint
CREATE TABLE "sms_logs" (
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
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;