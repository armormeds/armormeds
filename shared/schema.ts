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
  status: text("status").notNull().default("new"), // "new", "contacted", "completed", "archived"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, status: true, createdAt: true });

export type Product = typeof products.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type UpdateLeadRequest = Partial<z.infer<typeof insertLeadSchema> & { status: string }>;
