import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { getUncachableStripeClient } from "./stripeClient";
import { db } from "./db";
import { sql } from "drizzle-orm";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed data on startup
  await storage.seedProducts();

  // Register object storage routes for secure file uploads
  registerObjectStorageRoutes(app);

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

  app.post(api.products.create.path, async (req, res) => {
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

  app.patch(api.products.update.path, async (req, res) => {
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

  app.delete(api.products.delete.path, async (req, res) => {
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

  app.get(api.leads.list.path, async (req, res) => {
    const allLeads = await storage.getLeads();
    res.json(allLeads);
  });

  app.patch(api.leads.update.path, async (req, res) => {
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

  // Prescription routes
  app.get('/api/prescriptions', async (req, res) => {
    try {
      const prescriptions = await storage.getPrescriptions();
      res.json(prescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
  });

  app.get('/api/prescriptions/lead/:leadId', async (req, res) => {
    try {
      const leadId = Number(req.params.leadId);
      const prescriptions = await storage.getPrescriptionsByLead(leadId);
      res.json(prescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions for lead:', error);
      res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
  });

  app.post('/api/prescriptions', async (req, res) => {
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

      // Update lead status to completed
      await storage.updateLead(leadId, { status: "completed" });

      res.status(201).json(prescription);
    } catch (error) {
      console.error('Error creating prescription:', error);
      res.status(500).json({ error: 'Failed to create prescription' });
    }
  });

  // Appointment routes
  app.get('/api/appointments', async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  });

  app.get('/api/appointments/:id', async (req, res) => {
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

  app.get('/api/leads/:leadId/appointments', async (req, res) => {
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

  app.post('/api/appointments', async (req, res) => {
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

  app.patch('/api/appointments/:id', async (req, res) => {
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

  // Call notes routes
  app.get('/api/appointments/:appointmentId/notes', async (req, res) => {
    try {
      const notes = await storage.getCallNotes(Number(req.params.appointmentId));
      res.json(notes);
    } catch (error) {
      console.error('Error fetching call notes:', error);
      res.status(500).json({ error: 'Failed to fetch call notes' });
    }
  });

  app.post('/api/appointments/:appointmentId/notes', async (req, res) => {
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

  return httpServer;
}
