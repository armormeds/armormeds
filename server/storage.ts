import { products, leads, type Product, type InsertLead, type Lead, type UpdateLeadRequest } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product>;
  getLeads(): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, updates: UpdateLeadRequest): Promise<Lead>;
  seedProducts(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    const [updated] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return updated;
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async updateLead(id: number, updates: UpdateLeadRequest): Promise<Lead> {
    const [updated] = await db.update(leads).set(updates).where(eq(leads.id, id)).returning();
    return updated;
  }

  async seedProducts(): Promise<void> {
    const existing = await this.getProducts();
    if (existing.length === 0) {
      await db.insert(products).values([
        {
          name: "Semaglutide",
          description: "A GLP-1 receptor agonist that mimics the GLP-1 hormone, which is released in the gastrointestinal tract in response to eating. It prompts the body to produce more insulin, which reduces blood sugar (glucose).",
          price: "Starts at $299/mo",
          image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600",
          benefits: ["Reduces appetite", "Supports weight loss", "Improves metabolic health", "Weekly injection"]
        },
        {
          name: "Tirzepatide",
          description: "The first and only unimolecular GIP and GLP-1 receptor agonist. It activates both the GLP-1 and GIP receptors to improve blood sugar control.",
          price: "Starts at $399/mo",
          image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=600",
          benefits: ["Dual action mechanism", "Significantly greater weight loss", "Improved glycemic control", "Weekly injection"]
        }
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
