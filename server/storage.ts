import { products, leads, prescriptions, appointments, callNotes, providerAvailability, adminUsers, leadActivities, leadNotes, leadTags, leadTasks, patientUsers, type Product, type InsertProduct, type InsertLead, type Lead, type UpdateLeadRequest, type UpdateProductRequest, type Prescription, type InsertPrescription, type Appointment, type InsertAppointment, type CallNote, type InsertCallNote, type ProviderAvailability, type InsertProviderAvailability, type AdminUser, type InsertAdminUser, type UpdateAdminUserRequest, type LeadActivity, type InsertLeadActivity, type LeadNote, type InsertLeadNote, type LeadTag, type InsertLeadTag, type LeadTask, type InsertLeadTask, type PatientUser, type InsertPatientUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc, gte, and } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: UpdateProductRequest): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  getLeadByEmail(email: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, updates: UpdateLeadRequest): Promise<Lead>;
  getPrescriptions(): Promise<Prescription[]>;
  getPrescriptionsByLead(leadId: number): Promise<Prescription[]>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByLead(leadId: number): Promise<Appointment[]>;
  getAppointmentsByPatientEmail(email: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment | undefined>;
  getCallNotes(appointmentId: number): Promise<CallNote[]>;
  createCallNote(note: InsertCallNote): Promise<CallNote>;
  getAvailableSlots(from?: Date): Promise<ProviderAvailability[]>;
  getAvailabilitySlot(id: number): Promise<ProviderAvailability | undefined>;
  createAvailabilitySlot(slot: InsertProviderAvailability): Promise<ProviderAvailability>;
  updateAvailabilitySlot(id: number, updates: Partial<ProviderAvailability>): Promise<ProviderAvailability | undefined>;
  deleteAvailabilitySlot(id: number): Promise<boolean>;
  bookAvailabilitySlot(availabilityId: number, patientName: string, patientEmail: string, patientPhone?: string): Promise<{ appointment: Appointment; lead: Lead } | null>;
  seedProducts(): Promise<void>;
  // Admin user management
  getAdminUsers(): Promise<AdminUser[]>;
  getAdminUser(id: number): Promise<AdminUser | undefined>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: number, updates: UpdateAdminUserRequest): Promise<AdminUser | undefined>;
  deleteAdminUser(id: number): Promise<boolean>;
  updateAdminUserLastLogin(id: number): Promise<void>;
  // Patient user management
  getPatientByEmail(email: string): Promise<PatientUser | undefined>;
  getPatientById(id: number): Promise<PatientUser | undefined>;
  getPatientByGoogleId(googleId: string): Promise<PatientUser | undefined>;
  createPatient(patient: InsertPatientUser): Promise<PatientUser>;
  updatePatient(id: number, updates: Partial<PatientUser>): Promise<PatientUser | undefined>;
  updatePatientLastLogin(id: number): Promise<void>;
  getLeadActivities(leadId: number): Promise<LeadActivity[]>;
  createLeadActivity(activity: InsertLeadActivity): Promise<LeadActivity>;
  getLeadNotes(leadId: number): Promise<LeadNote[]>;
  createLeadNote(note: InsertLeadNote): Promise<LeadNote>;
  deleteLeadNote(id: number): Promise<boolean>;
  getLeadTags(leadId: number): Promise<LeadTag[]>;
  createLeadTag(tag: InsertLeadTag): Promise<LeadTag>;
  deleteLeadTag(id: number): Promise<boolean>;
  getLeadTasks(leadId: number): Promise<LeadTask[]>;
  createLeadTask(task: InsertLeadTask): Promise<LeadTask>;
  updateLeadTask(id: number, updates: Partial<LeadTask>): Promise<LeadTask | undefined>;
  deleteLeadTask(id: number): Promise<boolean>;
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

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async getLeadByEmail(email: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.email, email.toLowerCase()));
    return lead;
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

  async getAppointmentsByPatientEmail(email: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.patientEmail, email.toLowerCase())).orderBy(desc(appointments.scheduledAt));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const normalizedAppointment = {
      ...appointment,
      patientEmail: appointment.patientEmail.toLowerCase(),
    };
    const [created] = await db.insert(appointments).values(normalizedAppointment as any).returning();
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

  async getAvailableSlots(from?: Date): Promise<ProviderAvailability[]> {
    const fromDate = from || new Date();
    return await db.select().from(providerAvailability)
      .where(and(
        eq(providerAvailability.status, "available"),
        gte(providerAvailability.startAt, fromDate)
      ))
      .orderBy(providerAvailability.startAt);
  }

  async getAvailabilitySlot(id: number): Promise<ProviderAvailability | undefined> {
    const [slot] = await db.select().from(providerAvailability).where(eq(providerAvailability.id, id));
    return slot;
  }

  async createAvailabilitySlot(slot: InsertProviderAvailability): Promise<ProviderAvailability> {
    const [created] = await db.insert(providerAvailability).values(slot as any).returning();
    return created;
  }

  async updateAvailabilitySlot(id: number, updates: Partial<ProviderAvailability>): Promise<ProviderAvailability | undefined> {
    const [updated] = await db.update(providerAvailability).set(updates).where(eq(providerAvailability.id, id)).returning();
    return updated;
  }

  async deleteAvailabilitySlot(id: number): Promise<boolean> {
    const result = await db.delete(providerAvailability).where(eq(providerAvailability.id, id)).returning();
    return result.length > 0;
  }

  async bookAvailabilitySlot(availabilityId: number, patientName: string, patientEmail: string, patientPhone?: string): Promise<{ appointment: Appointment; lead: Lead } | null> {
    const slot = await this.getAvailabilitySlot(availabilityId);
    if (!slot || slot.status !== 'available') {
      return null;
    }

    const normalizedEmail = patientEmail.toLowerCase();
    
    let lead: Lead | undefined = await db.select().from(leads).where(eq(leads.email, normalizedEmail)).then(rows => rows[0]);
    
    if (!lead) {
      const [newLead] = await db.insert(leads).values({
        name: patientName,
        email: normalizedEmail,
        phone: patientPhone || '',
        medicationInterest: '',
        message: 'Self-scheduled consultation',
        status: 'new',
      }).returning();
      lead = newLead;
    }

    const [appointment] = await db.insert(appointments).values({
      leadId: lead.id,
      patientName,
      patientEmail: normalizedEmail,
      patientPhone: patientPhone || null,
      doctorName: slot.doctorName,
      reason: 'Telehealth Consultation',
      scheduledAt: slot.startAt,
      duration: Math.round((new Date(slot.endAt).getTime() - new Date(slot.startAt).getTime()) / 60000),
      status: 'scheduled',
    }).returning();

    await this.updateAvailabilitySlot(availabilityId, { status: 'booked' });

    return { appointment, lead };
  }

  // Admin user management
  async getAdminUsers(): Promise<AdminUser[]> {
    return await db.select().from(adminUsers).orderBy(adminUsers.name);
  }

  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user;
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email.toLowerCase()));
    return user;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [created] = await db.insert(adminUsers).values({
      ...user,
      email: user.email.toLowerCase(),
    } as any).returning();
    return created;
  }

  async updateAdminUser(id: number, updates: UpdateAdminUserRequest): Promise<AdminUser | undefined> {
    const updateData: any = { ...updates };
    if (updates.email) {
      updateData.email = updates.email.toLowerCase();
    }
    const [updated] = await db.update(adminUsers).set(updateData).where(eq(adminUsers.id, id)).returning();
    return updated;
  }

  async deleteAdminUser(id: number): Promise<boolean> {
    const result = await db.delete(adminUsers).where(eq(adminUsers.id, id)).returning();
    return result.length > 0;
  }

  async updateAdminUserLastLogin(id: number): Promise<void> {
    await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, id));
  }

  async getPatientByEmail(email: string): Promise<PatientUser | undefined> {
    const [patient] = await db.select().from(patientUsers).where(eq(patientUsers.email, email.toLowerCase()));
    return patient;
  }

  async getPatientById(id: number): Promise<PatientUser | undefined> {
    const [patient] = await db.select().from(patientUsers).where(eq(patientUsers.id, id));
    return patient;
  }

  async getPatientByGoogleId(googleId: string): Promise<PatientUser | undefined> {
    const [patient] = await db.select().from(patientUsers).where(eq(patientUsers.googleId, googleId));
    return patient;
  }

  async createPatient(patient: InsertPatientUser): Promise<PatientUser> {
    const [created] = await db.insert(patientUsers).values({ ...patient, email: patient.email.toLowerCase() }).returning();
    return created;
  }

  async updatePatient(id: number, updates: Partial<PatientUser>): Promise<PatientUser | undefined> {
    const [updated] = await db.update(patientUsers).set(updates as any).where(eq(patientUsers.id, id)).returning();
    return updated;
  }

  async updatePatientLastLogin(id: number): Promise<void> {
    await db.update(patientUsers).set({ lastLoginAt: new Date() }).where(eq(patientUsers.id, id));
  }

  async getLeadActivities(leadId: number): Promise<LeadActivity[]> {
    return await db.select().from(leadActivities).where(eq(leadActivities.leadId, leadId)).orderBy(desc(leadActivities.createdAt));
  }

  async createLeadActivity(activity: InsertLeadActivity): Promise<LeadActivity> {
    const [created] = await db.insert(leadActivities).values(activity as any).returning();
    return created;
  }

  async getLeadNotes(leadId: number): Promise<LeadNote[]> {
    return await db.select().from(leadNotes).where(eq(leadNotes.leadId, leadId)).orderBy(desc(leadNotes.createdAt));
  }

  async createLeadNote(note: InsertLeadNote): Promise<LeadNote> {
    const [created] = await db.insert(leadNotes).values(note as any).returning();
    return created;
  }

  async deleteLeadNote(id: number): Promise<boolean> {
    const result = await db.delete(leadNotes).where(eq(leadNotes.id, id)).returning();
    return result.length > 0;
  }

  async getLeadTags(leadId: number): Promise<LeadTag[]> {
    return await db.select().from(leadTags).where(eq(leadTags.leadId, leadId)).orderBy(desc(leadTags.createdAt));
  }

  async createLeadTag(tag: InsertLeadTag): Promise<LeadTag> {
    const [created] = await db.insert(leadTags).values(tag as any).returning();
    return created;
  }

  async deleteLeadTag(id: number): Promise<boolean> {
    const result = await db.delete(leadTags).where(eq(leadTags.id, id)).returning();
    return result.length > 0;
  }

  async getLeadTasks(leadId: number): Promise<LeadTask[]> {
    return await db.select().from(leadTasks).where(eq(leadTasks.leadId, leadId)).orderBy(desc(leadTasks.createdAt));
  }

  async createLeadTask(task: InsertLeadTask): Promise<LeadTask> {
    const [created] = await db.insert(leadTasks).values(task as any).returning();
    return created;
  }

  async updateLeadTask(id: number, updates: Partial<LeadTask>): Promise<LeadTask | undefined> {
    const [updated] = await db.update(leadTasks).set(updates).where(eq(leadTasks.id, id)).returning();
    return updated;
  }

  async deleteLeadTask(id: number): Promise<boolean> {
    const result = await db.delete(leadTasks).where(eq(leadTasks.id, id)).returning();
    return result.length > 0;
  }

  async seedProducts(): Promise<void> {
    const existing = await this.getProducts();
    const existingCategories = new Set(existing.map(p => p.category));
    
    const allProducts = [
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
    ];

    const productsToInsert = allProducts.filter(p => !existingCategories.has(p.category));
    
    if (productsToInsert.length > 0) {
      await db.insert(products).values(productsToInsert);
    }
  }
}

export const storage = new DatabaseStorage();
