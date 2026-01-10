import { products, leads, prescriptions, appointments, callNotes, type Product, type InsertProduct, type InsertLead, type Lead, type UpdateLeadRequest, type UpdateProductRequest, type Prescription, type InsertPrescription, type Appointment, type InsertAppointment, type CallNote, type InsertCallNote } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: UpdateProductRequest): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getLeads(): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, updates: UpdateLeadRequest): Promise<Lead>;
  getPrescriptions(): Promise<Prescription[]>;
  getPrescriptionsByLead(leadId: number): Promise<Prescription[]>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByLead(leadId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment | undefined>;
  getCallNotes(appointmentId: number): Promise<CallNote[]>;
  createCallNote(note: InsertCallNote): Promise<CallNote>;
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

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await db.insert(products).values(product as any).returning();
    return created;
  }

  async updateProduct(id: number, updates: UpdateProductRequest): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead as any).returning();
    return lead;
  }

  async updateLead(id: number, updates: UpdateLeadRequest): Promise<Lead> {
    const [updated] = await db.update(leads).set(updates).where(eq(leads.id, id)).returning();
    return updated;
  }

  async getPrescriptions(): Promise<Prescription[]> {
    return await db.select().from(prescriptions);
  }

  async getPrescriptionsByLead(leadId: number): Promise<Prescription[]> {
    return await db.select().from(prescriptions).where(eq(prescriptions.leadId, leadId));
  }

  async createPrescription(prescription: InsertPrescription): Promise<Prescription> {
    const [created] = await db.insert(prescriptions).values(prescription as any).returning();
    return created;
  }

  async getAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments).orderBy(desc(appointments.scheduledAt));
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async getAppointmentsByLead(leadId: number): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.leadId, leadId)).orderBy(desc(appointments.scheduledAt));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [created] = await db.insert(appointments).values(appointment as any).returning();
    return created;
  }

  async updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment | undefined> {
    const [updated] = await db.update(appointments).set(updates).where(eq(appointments.id, id)).returning();
    return updated;
  }

  async getCallNotes(appointmentId: number): Promise<CallNote[]> {
    return await db.select().from(callNotes).where(eq(callNotes.appointmentId, appointmentId)).orderBy(desc(callNotes.createdAt));
  }

  async createCallNote(note: InsertCallNote): Promise<CallNote> {
    const [created] = await db.insert(callNotes).values(note as any).returning();
    return created;
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
          benefits: ["Reduces appetite", "Supports weight loss", "Improves metabolic health", "Weekly injection"],
          category: "weight-loss"
        },
        {
          name: "Tirzepatide",
          description: "The first and only unimolecular GIP and GLP-1 receptor agonist. It activates both the GLP-1 and GIP receptors to improve blood sugar control.",
          price: "Starts at $399/mo",
          image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=600",
          benefits: ["Dual action mechanism", "Significantly greater weight loss", "Improved glycemic control", "Weekly injection"],
          category: "weight-loss"
        },
        {
          name: "Finasteride",
          description: "A prescription medication that treats male pattern baldness by blocking DHT, the hormone responsible for hair loss. FDA-approved and clinically proven to stop hair loss and regrow hair.",
          price: "Starts at $49/mo",
          image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=600",
          benefits: ["Blocks DHT hormone", "Stops hair loss", "Promotes regrowth", "Daily oral tablet"],
          category: "hair-loss"
        },
        {
          name: "Minoxidil",
          description: "A topical treatment that stimulates hair follicles and increases blood flow to the scalp. Can be used alone or combined with Finasteride for enhanced results.",
          price: "Starts at $35/mo",
          image: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=600",
          benefits: ["Stimulates follicles", "Increases blood flow", "Easy topical application", "Works for all hair types"],
          category: "hair-loss"
        },
        {
          name: "Finasteride + Minoxidil Combo",
          description: "The most effective combination for treating male pattern baldness. Dual-action approach that blocks DHT while stimulating hair growth.",
          price: "Starts at $69/mo",
          image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&q=80&w=600",
          benefits: ["Maximum effectiveness", "Dual-action treatment", "Clinically proven combo", "Best value"],
          category: "hair-loss"
        },
        {
          name: "Sildenafil (Generic Viagra)",
          description: "The most popular ED medication. Works by increasing blood flow to help achieve and maintain an erection when sexually stimulated.",
          price: "Starts at $2/dose",
          image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=600",
          benefits: ["Works in 30-60 minutes", "Lasts 4-6 hours", "Proven effectiveness", "Available in multiple doses"],
          category: "sexual-health"
        },
        {
          name: "Tadalafil (Generic Cialis)",
          description: "Known as the 'weekend pill' for its long-lasting effects. Provides up to 36 hours of effectiveness for spontaneous intimacy.",
          price: "Starts at $4/dose",
          image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=600",
          benefits: ["Lasts up to 36 hours", "Daily or as-needed options", "Spontaneous intimacy", "Lower dose daily option"],
          category: "sexual-health"
        },
        {
          name: "Vardenafil (Generic Levitra)",
          description: "A fast-acting ED medication that works in as little as 25 minutes. May work better for some men who don't respond to other ED medications.",
          price: "Starts at $5/dose",
          image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=600",
          benefits: ["Fast-acting formula", "Works in 25 minutes", "Lasts 4-5 hours", "Alternative option"],
          category: "sexual-health"
        }
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
