import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { getUncachableStripeClient } from "./stripeClient";
import { db } from "./db";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Admin password - in production, store hashed password in database
// Default password is "admin123" - change this in production!
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "admin123", 10);

// Server-side token storage with expiration (in-memory for MVP)
const adminTokens = new Map<string, { createdAt: number; expiresAt: number }>();
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function isValidAdminToken(token: string): boolean {
  const session = adminTokens.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    adminTokens.delete(token);
    return false;
  }
  return true;
}

// Middleware to protect admin-only routes
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  if (!token || !isValidAdminToken(token)) {
    return res.status(401).json({ message: "Unauthorized - admin authentication required" });
  }
  
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed data on startup
  await storage.seedProducts();

  // Register object storage routes for secure file uploads
  registerObjectStorageRoutes(app);

  // Admin authentication endpoint with rate limiting
  app.post("/api/admin/login", async (req, res) => {
    try {
      const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
      const attempts = loginAttempts.get(clientIp);
      
      // Check for rate limiting lockout
      if (attempts && attempts.count >= MAX_LOGIN_ATTEMPTS) {
        const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
        if (timeSinceLastAttempt < LOCKOUT_DURATION_MS) {
          const minutesRemaining = Math.ceil((LOCKOUT_DURATION_MS - timeSinceLastAttempt) / 60000);
          return res.status(429).json({ 
            message: `Too many login attempts. Please try again in ${minutesRemaining} minutes.` 
          });
        } else {
          // Reset after lockout period
          loginAttempts.delete(clientIp);
        }
      }
      
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      const isValid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
      
      if (isValid) {
        // Clear login attempts on successful login
        loginAttempts.delete(clientIp);
        
        // Generate secure token and store server-side
        const token = generateSecureToken();
        const now = Date.now();
        adminTokens.set(token, { 
          createdAt: now, 
          expiresAt: now + TOKEN_EXPIRY_MS 
        });
        
        res.json({ success: true, token });
      } else {
        // Track failed login attempt
        const current = loginAttempts.get(clientIp) || { count: 0, lastAttempt: 0 };
        loginAttempts.set(clientIp, { 
          count: current.count + 1, 
          lastAttempt: Date.now() 
        });
        
        res.status(401).json({ message: "Invalid password" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Admin token verification endpoint
  app.post("/api/admin/verify", async (req, res) => {
    const { token } = req.body;
    if (token && typeof token === "string" && isValidAdminToken(token)) {
      res.json({ valid: true });
    } else {
      res.status(401).json({ valid: false });
    }
  });
  
  // Admin logout endpoint
  app.post("/api/admin/logout", async (req, res) => {
    const { token } = req.body;
    if (token) {
      adminTokens.delete(token);
    }
    res.json({ success: true });
  });

  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  app.post(api.products.create.path, requireAdminAuth, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(api.products.update.path, requireAdminAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.products.update.input.parse(req.body);
      const updated = await storage.updateProduct(id, input);
      if (!updated) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.products.delete.path, requireAdminAuth, async (req, res) => {
    const id = Number(req.params.id);
    const deleted = await storage.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ success: true });
  });

  app.post(api.leads.create.path, async (req, res) => {
    try {
      console.log('Received lead submission:', req.body);
      const input = api.leads.create.input.parse(req.body);
      const lead = await storage.createLead(input);
      res.status(201).json(lead);
    } catch (err) {
      console.error('Lead submission error:', err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.leads.list.path, requireAdminAuth, async (req, res) => {
    const allLeads = await storage.getLeads();
    res.json(allLeads);
  });

  app.patch(api.leads.update.path, requireAdminAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.leads.update.input.parse(req.body);
      const updated = await storage.updateLead(id, input);
      if (!updated) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get('/api/stripe/products/:category?', async (req, res) => {
    try {
      const category = req.params.category;
      
      // First try to get from database
      let products: any[] = [];
      try {
        const result = await db.execute(sql`
          SELECT 
            p.id as product_id,
            p.name as product_name,
            p.description as product_description,
            p.active as product_active,
            p.metadata as product_metadata,
            p.images as product_images,
            pr.id as price_id,
            pr.unit_amount,
            pr.currency,
            pr.recurring,
            pr.active as price_active
          FROM stripe.products p
          LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
          WHERE p.active = true
          ORDER BY p.name, pr.unit_amount
        `);

        const productsMap = new Map();
        for (const row of result.rows as any[]) {
          if (!productsMap.has(row.product_id)) {
            productsMap.set(row.product_id, {
              id: row.product_id,
              name: row.product_name,
              description: row.product_description,
              active: row.product_active,
              metadata: row.product_metadata,
              images: row.product_images,
              prices: []
            });
          }
          if (row.price_id) {
            productsMap.get(row.product_id).prices.push({
              id: row.price_id,
              unit_amount: row.unit_amount,
              currency: row.currency,
              recurring: row.recurring,
              active: row.price_active,
            });
          }
        }
        products = Array.from(productsMap.values());
      } catch (dbError) {
        console.error('Database query failed, falling back to Stripe API:', dbError);
      }
      
      // Fallback: fetch directly from Stripe API if database is empty
      if (products.length === 0) {
        console.log('No products in database, fetching directly from Stripe...');
        try {
          const stripe = await getUncachableStripeClient();
          const stripeProducts = await stripe.products.list({ active: true, limit: 100 });
          
          for (const product of stripeProducts.data) {
            const prices = await stripe.prices.list({ product: product.id, active: true });
            products.push({
              id: product.id,
              name: product.name,
              description: product.description,
              active: product.active,
              metadata: product.metadata,
              images: product.images,
              prices: prices.data.map(price => ({
                id: price.id,
                unit_amount: price.unit_amount,
                currency: price.currency,
                recurring: price.recurring,
                active: price.active,
              }))
            });
          }
          console.log(`Fetched ${products.length} products directly from Stripe`);
        } catch (stripeError) {
          console.error('Failed to fetch from Stripe API:', stripeError);
        }
      }
      
      // Filter by category if provided
      if (category) {
        products = products.filter((p: any) => p.metadata?.category === category);
      }

      res.json({ data: products });
    } catch (error) {
      console.error('Error fetching Stripe products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.post('/api/stripe/checkout', async (req, res) => {
    try {
      const { priceId, productName, customerEmail } = req.body;

      if (!priceId) {
        return res.status(400).json({ error: 'Price ID is required' });
      }

      const stripe = await getUncachableStripeClient();
      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout/cancel`,
        customer_email: customerEmail,
        metadata: {
          productName: productName || 'Medication Subscription',
        },
      });

      res.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
      console.error('Checkout error:', error);
      res.status(500).json({ error: error.message || 'Failed to create checkout session' });
    }
  });

  app.post('/api/stripe/checkout-one-time', async (req, res) => {
    try {
      const { priceId, productName, customerEmail } = req.body;

      if (!priceId) {
        return res.status(400).json({ error: 'Price ID is required' });
      }

      const stripe = await getUncachableStripeClient();
      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout/cancel`,
        customer_email: customerEmail,
        metadata: {
          productName: productName || 'Medication Purchase',
        },
      });

      res.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
      console.error('Checkout error:', error);
      res.status(500).json({ error: error.message || 'Failed to create checkout session' });
    }
  });

  // Prescription routes (admin only)
  app.get('/api/prescriptions', requireAdminAuth, async (req, res) => {
    try {
      const prescriptions = await storage.getPrescriptions();
      res.json(prescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
  });

  app.get('/api/prescriptions/lead/:leadId', requireAdminAuth, async (req, res) => {
    try {
      const leadId = Number(req.params.leadId);
      const prescriptions = await storage.getPrescriptionsByLead(leadId);
      res.json(prescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions for lead:', error);
      res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
  });

  app.post('/api/prescriptions', requireAdminAuth, async (req, res) => {
    try {
      const { leadId, patientName, patientDob, patientAddress, patientPhone, medication, dosage, quantity, refills, instructions, providerName, providerNpi, providerLicense, providerSignature } = req.body;
      
      // Validate required fields
      if (!leadId || typeof leadId !== 'number') {
        return res.status(400).json({ error: 'Valid lead ID is required' });
      }
      if (!patientName || typeof patientName !== 'string' || patientName.trim().length < 2) {
        return res.status(400).json({ error: 'Patient name is required (minimum 2 characters)' });
      }
      if (!patientAddress || typeof patientAddress !== 'string' || patientAddress.trim().length < 5) {
        return res.status(400).json({ error: 'Patient address is required' });
      }
      if (!medication || typeof medication !== 'string' || medication.trim().length < 2) {
        return res.status(400).json({ error: 'Medication name is required' });
      }
      if (!dosage || typeof dosage !== 'string') {
        return res.status(400).json({ error: 'Dosage is required' });
      }
      if (!quantity || typeof quantity !== 'string') {
        return res.status(400).json({ error: 'Quantity is required' });
      }
      if (!instructions || typeof instructions !== 'string' || instructions.trim().length < 5) {
        return res.status(400).json({ error: 'Instructions are required (minimum 5 characters)' });
      }
      if (!providerName || typeof providerName !== 'string' || providerName.trim().length < 2) {
        return res.status(400).json({ error: 'Provider name is required' });
      }

      // Generate unique prescription number using crypto-grade randomness
      const crypto = await import('crypto');
      const randomBytes = crypto.randomBytes(8).toString('hex').toUpperCase();
      const prescriptionNumber = `RX-${Date.now()}-${randomBytes}`;

      const prescription = await storage.createPrescription({
        leadId,
        patientName,
        patientDob: patientDob || null,
        patientAddress: patientAddress || null,
        patientPhone: patientPhone || null,
        medication,
        dosage,
        quantity,
        refills: refills || "0",
        instructions,
        providerName,
        providerNpi: providerNpi || null,
        providerLicense: providerLicense || null,
        providerSignature: providerSignature || null,
        prescriptionNumber,
        status: "active",
      });

      // Update lead status to completed and prescription status to ready
      await storage.updateLead(leadId, { 
        status: "completed", 
        prescriptionStatus: "ready",
        prescriptionNotifiedAt: new Date()
      });

      // TODO: Send email notification to patient when email service is configured
      // The lead's email can be fetched from storage.getLead(leadId)
      // Email should inform patient that prescription is ready, no call required,
      // but they can optionally schedule a consultation if desired

      res.status(201).json(prescription);
    } catch (error) {
      console.error('Error creating prescription:', error);
      res.status(500).json({ error: 'Failed to create prescription' });
    }
  });

  // Appointment routes (admin list requires auth)
  app.get('/api/appointments', requireAdminAuth, async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  });

  app.get('/api/appointments/:id', requireAdminAuth, async (req, res) => {
    try {
      const appointment = await storage.getAppointment(Number(req.params.id));
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      console.error('Error fetching appointment:', error);
      res.status(500).json({ error: 'Failed to fetch appointment' });
    }
  });

  app.get('/api/leads/:leadId/appointments', requireAdminAuth, async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByLead(Number(req.params.leadId));
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching lead appointments:', error);
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  });

  app.get('/api/appointments/patient/:email', async (req, res) => {
    try {
      const email = decodeURIComponent(req.params.email);
      const appointments = await storage.getAppointmentsByPatientEmail(email);
      const sanitizedAppointments = appointments.map(apt => ({
        id: apt.id,
        patientName: apt.patientName,
        doctorName: apt.doctorName,
        reason: apt.reason,
        scheduledAt: apt.scheduledAt,
        duration: apt.duration,
        status: apt.status,
        videoLink: apt.videoLink,
        completedAt: apt.completedAt,
        createdAt: apt.createdAt,
      }));
      res.json(sanitizedAppointments);
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  });

  app.post('/api/appointments', requireAdminAuth, async (req, res) => {
    try {
      const { leadId, patientName, patientEmail, patientPhone, doctorName, reason, scheduledAt, duration, videoLink } = req.body;
      
      if (!leadId || typeof leadId !== 'number') {
        return res.status(400).json({ error: 'Valid lead ID is required' });
      }
      if (!patientName || typeof patientName !== 'string' || patientName.trim().length < 2) {
        return res.status(400).json({ error: 'Patient name is required' });
      }
      if (!patientEmail || typeof patientEmail !== 'string' || !patientEmail.includes('@')) {
        return res.status(400).json({ error: 'Valid patient email is required' });
      }
      if (!doctorName || typeof doctorName !== 'string' || doctorName.trim().length < 2) {
        return res.status(400).json({ error: 'Doctor name is required' });
      }
      if (!reason || typeof reason !== 'string' || reason.trim().length < 5) {
        return res.status(400).json({ error: 'Reason for appointment is required (minimum 5 characters)' });
      }
      if (!scheduledAt) {
        return res.status(400).json({ error: 'Scheduled date/time is required' });
      }

      const appointment = await storage.createAppointment({
        leadId,
        patientName: patientName.trim(),
        patientEmail: patientEmail.trim(),
        patientPhone: patientPhone?.trim() || null,
        doctorName: doctorName.trim(),
        reason: reason.trim(),
        scheduledAt: new Date(scheduledAt),
        duration: duration || 30,
        videoLink: videoLink?.trim() || null,
        status: 'scheduled',
      });

      // Update lead status to indicate follow-up needed
      await storage.updateLead(leadId, { status: 'follow-up' });

      res.status(201).json(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ error: 'Failed to create appointment' });
    }
  });

  app.patch('/api/appointments/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = req.body;
      
      // Convert scheduledAt string to Date if present
      if (updates.scheduledAt) {
        updates.scheduledAt = new Date(updates.scheduledAt);
      }
      if (updates.completedAt) {
        updates.completedAt = new Date(updates.completedAt);
      }

      const updated = await storage.updateAppointment(id, updates);
      if (!updated) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json(updated);
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ error: 'Failed to update appointment' });
    }
  });

  // Call notes routes (admin only)
  app.get('/api/appointments/:appointmentId/notes', requireAdminAuth, async (req, res) => {
    try {
      const notes = await storage.getCallNotes(Number(req.params.appointmentId));
      res.json(notes);
    } catch (error) {
      console.error('Error fetching call notes:', error);
      res.status(500).json({ error: 'Failed to fetch call notes' });
    }
  });

  app.post('/api/appointments/:appointmentId/notes', requireAdminAuth, async (req, res) => {
    try {
      const appointmentId = Number(req.params.appointmentId);
      const { authorName, noteType, content } = req.body;
      
      // Verify appointment exists
      const appointment = await storage.getAppointment(appointmentId);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      if (!authorName || typeof authorName !== 'string' || authorName.trim().length < 2) {
        return res.status(400).json({ error: 'Author name is required' });
      }
      if (!content || typeof content !== 'string' || content.trim().length < 5) {
        return res.status(400).json({ error: 'Note content is required (minimum 5 characters)' });
      }

      const note = await storage.createCallNote({
        appointmentId,
        authorName: authorName.trim(),
        noteType: noteType || 'general',
        content: content.trim(),
      });

      res.status(201).json(note);
    } catch (error) {
      console.error('Error creating call note:', error);
      res.status(500).json({ error: 'Failed to create call note' });
    }
  });

  // Provider Availability routes (admin)
  app.get('/api/availability', async (req, res) => {
    try {
      const from = req.query.from ? new Date(req.query.from as string) : undefined;
      const slots = await storage.getAvailableSlots(from);
      res.json(slots);
    } catch (error) {
      console.error('Error fetching availability:', error);
      res.status(500).json({ error: 'Failed to fetch availability' });
    }
  });

  app.post('/api/availability', requireAdminAuth, async (req, res) => {
    try {
      const { doctorName, startAt, endAt, notes } = req.body;
      
      if (!doctorName || typeof doctorName !== 'string' || doctorName.trim().length < 2) {
        return res.status(400).json({ error: 'Doctor name is required' });
      }
      if (!startAt || !endAt) {
        return res.status(400).json({ error: 'Start and end times are required' });
      }

      const slot = await storage.createAvailabilitySlot({
        doctorName: doctorName.trim(),
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        status: 'available',
        notes: notes?.trim() || null,
      });

      res.status(201).json(slot);
    } catch (error) {
      console.error('Error creating availability slot:', error);
      res.status(500).json({ error: 'Failed to create availability slot' });
    }
  });

  app.patch('/api/availability/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = req.body;
      
      if (updates.startAt) updates.startAt = new Date(updates.startAt);
      if (updates.endAt) updates.endAt = new Date(updates.endAt);

      const updated = await storage.updateAvailabilitySlot(id, updates);
      if (!updated) {
        return res.status(404).json({ error: 'Availability slot not found' });
      }
      res.json(updated);
    } catch (error) {
      console.error('Error updating availability slot:', error);
      res.status(500).json({ error: 'Failed to update availability slot' });
    }
  });

  app.delete('/api/availability/:id', requireAdminAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteAvailabilitySlot(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: 'Availability slot not found' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting availability slot:', error);
      res.status(500).json({ error: 'Failed to delete availability slot' });
    }
  });

  // Patient self-scheduling endpoint
  app.post('/api/availability/book', async (req, res) => {
    try {
      const { availabilityId, patientName, patientEmail, patientPhone } = req.body;
      
      if (!availabilityId || typeof availabilityId !== 'number') {
        return res.status(400).json({ error: 'Availability slot ID is required' });
      }
      if (!patientName || typeof patientName !== 'string' || patientName.trim().length < 2) {
        return res.status(400).json({ error: 'Patient name is required' });
      }
      if (!patientEmail || typeof patientEmail !== 'string' || !patientEmail.includes('@')) {
        return res.status(400).json({ error: 'Valid email is required' });
      }

      const result = await storage.bookAvailabilitySlot(
        availabilityId,
        patientName.trim(),
        patientEmail.trim(),
        patientPhone?.trim()
      );

      if (!result) {
        return res.status(400).json({ error: 'This time slot is no longer available' });
      }

      res.status(201).json(result.appointment);
    } catch (error) {
      console.error('Error booking appointment:', error);
      res.status(500).json({ error: 'Failed to book appointment' });
    }
  });

  // Patient self-scheduling endpoint
  app.post('/api/appointments/self-schedule', async (req, res) => {
    try {
      const { slotId, patientEmail, patientName, patientPhone, reason } = req.body;
      
      if (!slotId || typeof slotId !== 'number') {
        return res.status(400).json({ error: 'Valid slot ID is required' });
      }
      if (!patientEmail || typeof patientEmail !== 'string' || !patientEmail.includes('@')) {
        return res.status(400).json({ error: 'Valid email is required' });
      }
      if (!patientName || typeof patientName !== 'string' || patientName.trim().length < 2) {
        return res.status(400).json({ error: 'Patient name is required' });
      }

      // Get the slot
      const slot = await storage.getAvailabilitySlot(slotId);
      if (!slot) {
        return res.status(404).json({ error: 'Time slot not found' });
      }
      if (slot.status !== 'available') {
        return res.status(400).json({ error: 'This time slot is no longer available' });
      }

      // Find lead by email
      const normalizedEmail = patientEmail.toLowerCase().trim();
      let lead = await storage.getLeadByEmail(normalizedEmail);
      
      // If no lead exists, create one
      if (!lead) {
        lead = await storage.createLead({
          name: patientName.trim(),
          email: normalizedEmail,
          phone: patientPhone?.trim() || null,
          medicationInterest: null,
          message: 'Self-scheduled telehealth consultation',
        });
      }

      // Mark slot as booked
      await storage.updateAvailabilitySlot(slotId, { status: 'booked' });

      // Create appointment
      const duration = Math.round((new Date(slot.endAt).getTime() - new Date(slot.startAt).getTime()) / 60000);
      const appointment = await storage.createAppointment({
        leadId: lead.id,
        patientName: patientName.trim(),
        patientEmail: normalizedEmail,
        patientPhone: patientPhone?.trim() || null,
        doctorName: slot.doctorName,
        reason: reason?.trim() || 'Telehealth consultation',
        scheduledAt: slot.startAt,
        duration: duration || 30,
        videoLink: null,
        status: 'scheduled',
      });

      // Update lead status
      await storage.updateLead(lead.id, { status: 'follow-up' });

      res.status(201).json(appointment);
    } catch (error) {
      console.error('Error self-scheduling appointment:', error);
      res.status(500).json({ error: 'Failed to schedule appointment' });
    }
  });

  return httpServer;
}
