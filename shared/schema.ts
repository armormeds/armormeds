import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  image: text("image").notNull(),
  benefits: jsonb("benefits").$type<string[]>().notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  medicationInterest: text("medication_interest"),
  message: text("message"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  // Extended medical intake fields
  goals: jsonb("goals").$type<string[]>(),
  state: text("state"),
  patientType: text("patient_type"),
  previousTreatments: text("previous_treatments"),
  solutionTypes: jsonb("solution_types").$type<string[]>(),
  medicalConditions: jsonb("medical_conditions").$type<string[]>(),
  currentMedications: text("current_medications"),
  allergies: text("allergies"),
  dateOfBirth: text("date_of_birth"),
  heightFeet: text("height_feet"),
  heightInches: text("height_inches"),
  weight: text("weight"),
  sex: text("sex"),
  hasPancreatitis: text("has_pancreatitis"),
  hasThyroidCancer: text("has_thyroid_cancer"),
  hasKidneyIssues: text("has_kidney_issues"),
  hasDiabetes: text("has_diabetes"),
  isPregnant: text("is_pregnant"),
  previousGlp: text("previous_glp"),
  glpDetails: text("glp_details"),
  consentGiven: text("consent_given"),
  // Document uploads (stored as JSON array of document paths)
  documentPaths: jsonb("document_paths").$type<string[]>(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, status: true, createdAt: true });

export type Product = typeof products.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type UpdateLeadRequest = {
  status?: string;
  name?: string;
  email?: string;
  phone?: string | null;
};
