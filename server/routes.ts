import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { getUncachableStripeClient } from "./stripeClient";
import { db } from "./db";
import { sql, eq } from "drizzle-orm";
import { adminUsers } from "@shared/schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { AdminUser, AdminPermissions } from "@shared/schema";
import { sendPrescriptionReadySMS, sendAppointmentScheduledSMS, sendCustomSMS, isTwilioConfigured } from "./twilio";

// Server-side token storage with user info and expiration (in-memory for MVP)
interface AdminSession {
  userId: number;
  email: string;
  name: string;
  role: string;
  permissions: AdminPermissions;
  createdAt: number;
  expiresAt: number;
}
const adminTokens = new Map<string, AdminSession>();
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Default permissions by role
const DEFAULT_PERMISSIONS: Record<string, AdminPermissions> = {
  super_admin: {
    viewLeads: true,
    editLeads: true,
    viewPrescriptions: true,
    createPrescriptions: true,
    viewAppointments: true,
    manageAppointments: true,
    manageProducts: true,
    manageUsers: true,
    manageAvailability: true,
  },
  provider: {
    viewLeads: true,
    editLeads: true,
    viewPrescriptions: true,
    createPrescriptions: true,
    viewAppointments: true,
    manageAppointments: true,
    manageProducts: false,
    manageUsers: false,
    manageAvailability: true,
  },
  staff: {
    viewLeads: true,
    editLeads: false,
    viewPrescriptions: true,
    createPrescriptions: false,
    viewAppointments: true,
    manageAppointments: true,
    manageProducts: false,
    manageUsers: false,
    manageAvailability: false,
  },
};

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function getAdminSession(token: string): AdminSession | null {
  const session = adminTokens.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    adminTokens.delete(token);
    return null;
  }
  return session;
}

function isValidAdminToken(token: string): boolean {
  return getAdminSession(token) !== null;
}

// Extend Express Request to include admin session
declare global {
  namespace Express {
    interface Request {
      adminSession?: AdminSession;
    }
  }
}

// Middleware to protect admin-only routes
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - admin authentication required" });
  }
  
  const session = getAdminSession(token);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized - invalid or expired token" });
  }
  
  req.adminSession = session;
  next();
}

// Permission-based middleware factory
function requirePermission(permission: keyof AdminPermissions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - admin authentication required" });
    }
    
    const session = getAdminSession(token);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized - invalid or expired token" });
    }
    
    req.adminSession = session;
    
    if (!session.permissions[permission]) {
      return res.status(403).json({ message: "Forbidden - insufficient permissions" });
    }
    
    next();
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed data on startup
  await storage.seedProducts();

  // Reset admin password if ADMIN_RESET env var is set
  if (process.env.ADMIN_RESET === 'true') {
    try {
      const allAdmins = await storage.getAdminUsers();
      const superAdmin = allAdmins.find(u => u.role === 'super_admin');
      if (superAdmin) {
        const newHash = bcrypt.hashSync('Welcome123', 10);
        await storage.updateAdminUser(superAdmin.id, { passwordHash: newHash });
        console.log(`Admin password reset for ${superAdmin.email} to Welcome123`);
      }
    } catch (err) {
      console.error("Admin reset error:", err);
    }
  }

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
      
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const trimmedEmail = email.trim().toLowerCase();

      // Look up user in database
      const user = await storage.getAdminUserByEmail(trimmedEmail);
      
      if (!user) {
        // Track failed login attempt
        const current = loginAttempts.get(clientIp) || { count: 0, lastAttempt: 0 };
        loginAttempts.set(clientIp, { count: current.count + 1, lastAttempt: Date.now() });
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Check if user is active
      if (user.isActive !== "true") {
        return res.status(403).json({ message: "Account is disabled. Contact administrator." });
      }

      const isValid = bcrypt.compareSync(password, user.passwordHash);
      
      if (isValid) {
        // Clear login attempts on successful login
        loginAttempts.delete(clientIp);
        
        // Update last login time
        await storage.updateAdminUserLastLogin(user.id);
        
        // Generate secure token and store server-side with user info
        const token = generateSecureToken();
        const now = Date.now();
        adminTokens.set(token, { 
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: user.permissions as AdminPermissions,
          createdAt: now, 
          expiresAt: now + TOKEN_EXPIRY_MS 
        });
        
        res.json({ 
          success: true, 
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions,
          }
        });
      } else {
        // Track failed login attempt
        const current = loginAttempts.get(clientIp) || { count: 0, lastAttempt: 0 };
        loginAttempts.set(clientIp, { 
          count: current.count + 1, 
          lastAttempt: Date.now() 
        });
        
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Admin token verification endpoint
  app.post("/api/admin/verify", async (req, res) => {
    const { token } = req.body;
    if (token && typeof token === "string") {
      const session = getAdminSession(token);
      if (session) {
        res.json({ 
          valid: true,
          user: {
            id: session.userId,
            email: session.email,
            name: session.name,
            role: session.role,
            permissions: session.permissions,
          }
        });
        return;
      }
    }
    res.status(401).json({ valid: false });
  });
  
  // Admin logout endpoint
  app.post("/api/admin/logout", async (req, res) => {
    const { token } = req.body;
    if (token) {
      adminTokens.delete(token);
    }
    res.json({ success: true });
  });
  
  // Check if initial setup is needed (no admin users exist)
  app.get("/api/admin/setup-required", async (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    const users = await storage.getAdminUsers();
    res.json({ setupRequired: users.length === 0 });
  });
  
  // Initial admin setup (only works if no admin users exist)
  app.post("/api/admin/setup", async (req, res) => {
    try {
      const existingUsers = await storage.getAdminUsers();
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "Admin users already exist. Use the admin dashboard to manage users." });
      }
      
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ message: "Email, password, and name are required" });
      }
      
      // Create initial super admin
      const passwordHash = bcrypt.hashSync(password, 10);
      const user = await storage.createAdminUser({
        email: email.toLowerCase(),
        name,
        passwordHash,
        role: "super_admin",
        permissions: DEFAULT_PERMISSIONS.super_admin,
        isActive: "true",
      });
      
      res.status(201).json({ 
        success: true, 
        message: "Super admin created successfully",
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      });
    } catch (error: any) {
      console.error("Admin setup error:", error);
      if (error.code === '23505') { // Unique violation
        return res.status(400).json({ message: "An admin with this email already exists" });
      }
      res.status(500).json({ message: "Failed to create admin user" });
    }
  });
  
  // Admin user management routes (require manageUsers permission)
  app.get("/api/admin/users", requirePermission("manageUsers"), async (req, res) => {
    const users = await storage.getAdminUsers();
    // Don't expose password hashes
    const safeUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      permissions: u.permissions,
      isActive: u.isActive,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt,
    }));
    res.json(safeUsers);
  });
  
  app.post("/api/admin/users", requirePermission("manageUsers"), async (req, res) => {
    try {
      const { email, password, name, role } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ message: "Email, password, and name are required" });
      }
      
      const userRole = role || "staff";
      const permissions = DEFAULT_PERMISSIONS[userRole] || DEFAULT_PERMISSIONS.staff;
      
      const passwordHash = bcrypt.hashSync(password, 10);
      const user = await storage.createAdminUser({
        email: email.toLowerCase(),
        name,
        passwordHash,
        role: userRole,
        permissions,
        isActive: "true",
      });
      
      res.status(201).json({ 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive,
        createdAt: user.createdAt,
      });
    } catch (error: any) {
      console.error("Create admin user error:", error);
      if (error.code === '23505') {
        return res.status(400).json({ message: "An admin with this email already exists" });
      }
      res.status(500).json({ message: "Failed to create admin user" });
    }
  });
  
  app.patch("/api/admin/users/:id", requirePermission("manageUsers"), async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { name, email, role, isActive, password } = req.body;
      
      const updates: any = {};
      if (name) updates.name = name;
      if (email) updates.email = email.toLowerCase();
      if (role) {
        updates.role = role;
        updates.permissions = DEFAULT_PERMISSIONS[role] || DEFAULT_PERMISSIONS.staff;
      }
      if (isActive !== undefined) updates.isActive = isActive;
      
      // Handle password change
      if (password) {
        const user = await storage.getAdminUser(id);
        if (user) {
          // Update password hash directly in database
          await db.update(adminUsers).set({ passwordHash: bcrypt.hashSync(password, 10) }).where(eq(adminUsers.id, id));
        }
      }
      
      const updated = await storage.updateAdminUser(id, updates);
      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ 
        id: updated.id, 
        email: updated.email, 
        name: updated.name, 
        role: updated.role,
        permissions: updated.permissions,
        isActive: updated.isActive,
      });
    } catch (error: any) {
      console.error("Update admin user error:", error);
      if (error.code === '23505') {
        return res.status(400).json({ message: "An admin with this email already exists" });
      }
      res.status(500).json({ message: "Failed to update admin user" });
    }
  });
  
  app.delete("/api/admin/users/:id", requirePermission("manageUsers"), async (req, res) => {
    const id = Number(req.params.id);
    
    // Prevent self-deletion
    if (req.adminSession?.userId === id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
    
    const deleted = await storage.deleteAdminUser(id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true });
  });
  
  // Get current user's session info
  app.get("/api/admin/me", requireAdminAuth, async (req, res) => {
    if (req.adminSession) {
      res.json({
        id: req.adminSession.userId,
        email: req.adminSession.email,
        name: req.adminSession.name,
        role: req.adminSession.role,
        permissions: req.adminSession.permissions,
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
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

  app.post(api.products.create.path, requirePermission("manageProducts"), async (req, res) => {
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

  app.patch(api.products.update.path, requirePermission("manageProducts"), async (req, res) => {
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

  app.delete(api.products.delete.path, requirePermission("manageProducts"), async (req, res) => {
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

  app.get(api.leads.list.path, requirePermission("viewLeads"), async (req, res) => {
    const allLeads = await storage.getLeads();
    res.json(allLeads);
  });

  app.patch(api.leads.update.path, requirePermission("editLeads"), async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.leads.update.input.parse(req.body);
      const oldLead = await storage.getLead(id);
      const updated = await storage.updateLead(id, input);
      if (!updated) {
        return res.status(404).json({ message: "Lead not found" });
      }
      if (input.status && oldLead && input.status !== oldLead.status) {
        storage.createLeadActivity({ leadId: id, type: 'status_change', summary: `Status changed from "${oldLead.status}" to "${input.status}"` }).catch(() => {});
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
  app.get('/api/prescriptions', requirePermission("viewPrescriptions"), async (req, res) => {
    try {
      const prescriptions = await storage.getPrescriptions();
      res.json(prescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
  });

  app.get('/api/prescriptions/lead/:leadId', requirePermission("viewPrescriptions"), async (req, res) => {
    try {
      const leadId = Number(req.params.leadId);
      const prescriptions = await storage.getPrescriptionsByLead(leadId);
      res.json(prescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions for lead:', error);
      res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
  });

  app.post('/api/prescriptions', requirePermission("createPrescriptions"), async (req, res) => {
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

      if (patientPhone) {
        sendPrescriptionReadySMS(patientPhone, patientName, medication).catch(err => 
          console.error('SMS notification failed for prescription:', err)
        );
      }

      storage.createLeadActivity({ leadId, type: 'prescription_created', summary: `Prescription created: ${medication} ${dosage}`, meta: { prescriptionId: prescription.id, medication, dosage } as any }).catch(() => {});

      res.status(201).json(prescription);
    } catch (error) {
      console.error('Error creating prescription:', error);
      res.status(500).json({ error: 'Failed to create prescription' });
    }
  });

  // Appointment routes (admin list requires auth)
  app.get('/api/appointments', requirePermission("viewAppointments"), async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  });

  app.get('/api/appointments/:id', requirePermission("viewAppointments"), async (req, res) => {
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

  app.get('/api/leads/:leadId/appointments', requirePermission("viewAppointments"), async (req, res) => {
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

  app.post('/api/appointments', requirePermission("manageAppointments"), async (req, res) => {
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

      if (patientPhone) {
        sendAppointmentScheduledSMS(patientPhone, patientName, doctorName, new Date(scheduledAt), videoLink).catch(err =>
          console.error('SMS notification failed for appointment:', err)
        );
      }

      storage.createLeadActivity({ leadId, type: 'appointment_scheduled', summary: `Appointment scheduled with ${doctorName}`, meta: { appointmentId: appointment.id, doctorName, scheduledAt } as any }).catch(() => {});

      res.status(201).json(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ error: 'Failed to create appointment' });
    }
  });

  app.patch('/api/appointments/:id', requirePermission("manageAppointments"), async (req, res) => {
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
  app.get('/api/appointments/:appointmentId/notes', requirePermission("viewAppointments"), async (req, res) => {
    try {
      const notes = await storage.getCallNotes(Number(req.params.appointmentId));
      res.json(notes);
    } catch (error) {
      console.error('Error fetching call notes:', error);
      res.status(500).json({ error: 'Failed to fetch call notes' });
    }
  });

  app.post('/api/appointments/:appointmentId/notes', requirePermission("manageAppointments"), async (req, res) => {
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

  app.post('/api/availability', requirePermission("manageAvailability"), async (req, res) => {
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

  app.patch('/api/availability/:id', requirePermission("manageAvailability"), async (req, res) => {
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

  app.delete('/api/availability/:id', requirePermission("manageAvailability"), async (req, res) => {
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

      if (patientPhone) {
        sendAppointmentScheduledSMS(patientPhone.trim(), patientName.trim(), slot.doctorName, new Date(slot.startAt)).catch(err =>
          console.error('SMS notification failed for self-scheduled appointment:', err)
        );
      }

      res.status(201).json(appointment);
    } catch (error) {
      console.error('Error self-scheduling appointment:', error);
      res.status(500).json({ error: 'Failed to schedule appointment' });
    }
  });

  // Admin Payments endpoint - fetch payment data from Stripe synced tables
  app.get('/api/admin/payments', requirePermission("viewLeads"), async (req, res) => {
    try {
      const result = await db.execute(sql`
        SELECT DISTINCT ON (cs.id)
          cs.id,
          cs.customer_email,
          cs.amount_total,
          cs.currency,
          cs.payment_status,
          cs.status AS session_status,
          cs.mode,
          cs.created,
          cs.metadata,
          cs.customer_details,
          cs.payment_intent,
          ch.id AS charge_id,
          ch.payment_intent AS charge_payment_intent,
          ch.payment_method_details,
          ch.outcome,
          ch.status AS charge_status,
          ch.receipt_email,
          ch.description AS charge_description,
          ch.refunded AS charge_refunded,
          ch.amount_refunded AS charge_amount_refunded,
          ch.amount AS charge_amount
        FROM stripe.checkout_sessions cs
        LEFT JOIN stripe.charges ch ON ch.customer = cs.customer AND cs.customer IS NOT NULL AND cs.customer != ''
        ORDER BY cs.id, ch.created DESC
      `);

      const refundsResult = await db.execute(sql`
        SELECT r.payment_intent, r.id, r.amount, r.status, r.reason, r.created
        FROM stripe.refunds r
        ORDER BY r.created DESC
      `);
      const refundsByPi: Record<string, any[]> = {};
      for (const r of refundsResult.rows as any[]) {
        if (r.payment_intent) {
          if (!refundsByPi[r.payment_intent]) refundsByPi[r.payment_intent] = [];
          refundsByPi[r.payment_intent].push({
            id: r.id,
            amount: r.amount ? Number(r.amount) / 100 : 0,
            status: r.status,
            reason: r.reason,
            createdAt: r.created ? new Date(Number(r.created) * 1000).toISOString() : null,
          });
        }
      }
      
      const payments = result.rows.map((row: any) => {
        const customerDetails = row.customer_details || {};
        const paymentMethodDetails = row.payment_method_details || {};
        const outcome = row.outcome || {};
        const card = paymentMethodDetails?.card || {};
        const address = customerDetails?.address || {};
        const pi = row.charge_payment_intent || row.payment_intent || '';

        return {
          id: row.id,
          customerEmail: row.customer_email,
          amount: row.amount_total ? Number(row.amount_total) / 100 : 0,
          currency: row.currency || 'usd',
          paymentStatus: row.payment_status,
          sessionStatus: row.session_status,
          mode: row.mode,
          createdAt: row.created ? new Date(Number(row.created) * 1000).toISOString() : null,
          metadata: row.metadata,
          customerName: customerDetails?.name || null,
          billingAddress: address ? {
            line1: address.line1 || null,
            line2: address.line2 || null,
            city: address.city || null,
            state: address.state || null,
            postalCode: address.postal_code || null,
            country: address.country || null,
          } : null,
          paymentMethod: {
            type: paymentMethodDetails?.type || null,
            cardBrand: card?.brand || null,
            cardLast4: card?.last4 || null,
            cardExpMonth: card?.exp_month || null,
            cardExpYear: card?.exp_year || null,
            cardCountry: card?.country || null,
            cardFunding: card?.funding || null,
            wallet: card?.wallet?.type || null,
          },
          riskAssessment: {
            riskLevel: outcome?.risk_level || null,
            riskScore: outcome?.risk_score ?? null,
            networkStatus: outcome?.network_status || null,
            sellerMessage: outcome?.seller_message || null,
          },
          chargeId: row.charge_id || null,
          chargeStatus: row.charge_status || null,
          chargeAmount: row.charge_amount ? Number(row.charge_amount) / 100 : 0,
          receiptEmail: row.receipt_email || null,
          chargeDescription: row.charge_description || null,
          paymentIntentId: pi || null,
          isRefunded: row.charge_refunded === true,
          amountRefunded: row.charge_amount_refunded ? Number(row.charge_amount_refunded) / 100 : 0,
          refunds: refundsByPi[pi] || [],
        };
      });

      res.json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.json([]);
    }
  });

  app.post('/api/admin/refund', requirePermission("editLeads"), async (req, res) => {
    try {
      const { paymentIntentId, amount, reason } = req.body;

      if (!paymentIntentId || typeof paymentIntentId !== 'string' || !paymentIntentId.startsWith('pi_')) {
        return res.status(400).json({ error: "Valid payment intent ID is required" });
      }

      const validReasons = ['duplicate', 'fraudulent', 'requested_by_customer'];
      if (reason && !validReasons.includes(reason)) {
        return res.status(400).json({ error: "Invalid refund reason" });
      }

      const chargeResult = await db.execute(sql`
        SELECT ch.id, ch.amount, ch.amount_refunded, ch.status, ch.refunded
        FROM stripe.charges ch
        WHERE ch.payment_intent = ${paymentIntentId}
        ORDER BY ch.created DESC
        LIMIT 1
      `);

      if (!chargeResult.rows.length) {
        return res.status(404).json({ error: "No charge found for this payment" });
      }

      const charge = chargeResult.rows[0] as any;
      if (charge.status !== 'succeeded') {
        return res.status(400).json({ error: "Can only refund succeeded charges" });
      }

      const chargeAmountCents = Number(charge.amount) || 0;
      const alreadyRefundedCents = Number(charge.amount_refunded) || 0;
      const refundableCents = chargeAmountCents - alreadyRefundedCents;

      if (refundableCents <= 0) {
        return res.status(400).json({ error: "This charge has already been fully refunded" });
      }

      const stripe = await getUncachableStripeClient();

      const refundParams: any = {
        payment_intent: paymentIntentId,
      };

      if (amount && Number(amount) > 0) {
        const requestedCents = Math.round(Number(amount) * 100);
        if (requestedCents > refundableCents) {
          return res.status(400).json({ 
            error: `Refund amount exceeds refundable balance. Maximum: $${(refundableCents / 100).toFixed(2)}`
          });
        }
        if (requestedCents < 50) {
          return res.status(400).json({ error: "Minimum refund amount is $0.50" });
        }
        refundParams.amount = requestedCents;
      }

      if (reason) {
        refundParams.reason = reason;
      }

      const refund = await stripe.refunds.create(refundParams);

      try {
        const sync = await (await import('./stripeClient')).getStripeSync();
        await sync.sync();
      } catch (syncError) {
        console.error('Stripe sync after refund failed:', syncError);
      }

      res.json({
        success: true,
        refund: {
          id: refund.id,
          amount: refund.amount / 100,
          status: refund.status,
          currency: refund.currency,
        },
      });
    } catch (error: any) {
      console.error('Error processing refund:', error);
      const message = error?.type === 'StripeInvalidRequestError' 
        ? error.message 
        : error?.message || "Failed to process refund";
      res.status(400).json({ 
        error: message,
        code: error?.code || "unknown"
      });
    }
  });

  app.post('/api/admin/send-sms', requirePermission("editLeads"), async (req, res) => {
    try {
      const { phone, message, leadId } = req.body;

      if (!phone || typeof phone !== 'string') {
        return res.status(400).json({ error: "Phone number is required" });
      }
      if (!message || typeof message !== 'string' || message.trim().length < 1) {
        return res.status(400).json({ error: "Message is required" });
      }
      if (message.length > 1600) {
        return res.status(400).json({ error: "Message too long (max 1600 characters)" });
      }

      if (!isTwilioConfigured()) {
        return res.status(503).json({ error: "SMS service is not configured" });
      }

      const result = await sendCustomSMS(phone, message.trim());

      if (!result.success) {
        return res.status(400).json({ error: result.error || "Failed to send SMS" });
      }

      if (leadId) {
        storage.createLeadActivity({ leadId: Number(leadId), type: 'sms_sent', summary: `SMS sent to ${phone}`, meta: { phone, messagePreview: message.trim().substring(0, 100) } as any }).catch(() => {});
      }

      res.json({ success: true, sid: result.sid });
    } catch (error: any) {
      console.error('Error sending SMS:', error);
      res.status(500).json({ error: error?.message || "Failed to send SMS" });
    }
  });

  app.get('/api/admin/sms-status', requirePermission("viewLeads"), async (_req, res) => {
    res.json({ configured: isTwilioConfigured() });
  });

  // CRM: Lead Activities (timeline)
  app.get('/api/leads/:id/activities', requirePermission("viewLeads"), async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const activities = await storage.getLeadActivities(leadId);
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to fetch activities" });
    }
  });

  // CRM: Lead Timeline (combined activities + appointments + prescriptions)
  app.get('/api/leads/:id/timeline', requirePermission("viewLeads"), async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const [activities, appts, rxs, notes] = await Promise.all([
        storage.getLeadActivities(leadId),
        storage.getAppointmentsByLead(leadId),
        storage.getPrescriptionsByLead(leadId),
        storage.getLeadNotes(leadId),
      ]);

      const timeline: any[] = [];
      activities.forEach(a => timeline.push({ ...a, timelineType: 'activity' }));
      appts.forEach(a => timeline.push({ id: `appt-${a.id}`, leadId, type: 'appointment', summary: `Appointment with ${a.doctorName} - ${a.status}`, meta: { appointmentId: a.id, doctorName: a.doctorName, status: a.status, scheduledAt: a.scheduledAt, videoLink: a.videoLink }, createdAt: a.createdAt, timelineType: 'appointment' }));
      rxs.forEach(r => timeline.push({ id: `rx-${r.id}`, leadId, type: 'prescription', summary: `${r.medication} ${r.dosage} prescribed by ${r.providerName}`, meta: { prescriptionId: r.id, medication: r.medication, dosage: r.dosage, status: r.status }, createdAt: r.createdAt, timelineType: 'prescription' }));
      notes.forEach(n => timeline.push({ id: `note-${n.id}`, leadId, type: 'note', summary: n.content, authorName: n.authorName, createdAt: n.createdAt, timelineType: 'note' }));

      timeline.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json(timeline);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to fetch timeline" });
    }
  });

  // CRM: Lead Notes
  app.get('/api/leads/:id/notes', requirePermission("viewLeads"), async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const notes = await storage.getLeadNotes(leadId);
      res.json(notes);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to fetch notes" });
    }
  });

  app.post('/api/leads/:id/notes', requirePermission("editLeads"), async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const { content, authorName } = req.body;
      if (!content || !authorName) {
        return res.status(400).json({ error: "Content and author name are required" });
      }
      const note = await storage.createLeadNote({ leadId, content, authorName });
      await storage.createLeadActivity({ leadId, type: 'note_added', summary: `Note added by ${authorName}`, authorName });
      res.json(note);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to create note" });
    }
  });

  app.delete('/api/leads/:id/notes/:noteId', requirePermission("editLeads"), async (req, res) => {
    try {
      const noteId = parseInt(req.params.noteId);
      const deleted = await storage.deleteLeadNote(noteId);
      if (!deleted) return res.status(404).json({ error: "Note not found" });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to delete note" });
    }
  });

  // CRM: Lead Tags
  app.get('/api/leads/:id/tags', requirePermission("viewLeads"), async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const tags = await storage.getLeadTags(leadId);
      res.json(tags);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to fetch tags" });
    }
  });

  app.post('/api/leads/:id/tags', requirePermission("editLeads"), async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const { tag } = req.body;
      if (!tag || typeof tag !== 'string' || tag.trim().length < 1) {
        return res.status(400).json({ error: "Tag is required" });
      }
      const existing = await storage.getLeadTags(leadId);
      if (existing.some(t => t.tag.toLowerCase() === tag.trim().toLowerCase())) {
        return res.status(409).json({ error: "Tag already exists" });
      }
      const created = await storage.createLeadTag({ leadId, tag: tag.trim() });
      await storage.createLeadActivity({ leadId, type: 'tag_added', summary: `Tag "${tag.trim()}" added` });
      res.json(created);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to create tag" });
    }
  });

  app.delete('/api/leads/:id/tags/:tagId', requirePermission("editLeads"), async (req, res) => {
    try {
      const tagId = parseInt(req.params.tagId);
      const deleted = await storage.deleteLeadTag(tagId);
      if (!deleted) return res.status(404).json({ error: "Tag not found" });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to delete tag" });
    }
  });

  // CRM: Lead Tasks
  app.get('/api/leads/:id/tasks', requirePermission("viewLeads"), async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const tasks = await storage.getLeadTasks(leadId);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to fetch tasks" });
    }
  });

  app.post('/api/leads/:id/tasks', requirePermission("editLeads"), async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const { title, dueAt, assignedTo, createdBy } = req.body;
      if (!title || !createdBy) {
        return res.status(400).json({ error: "Title and createdBy are required" });
      }
      const task = await storage.createLeadTask({
        leadId,
        title: title.trim(),
        dueAt: dueAt ? new Date(dueAt) : null,
        assignedTo: assignedTo || null,
        createdBy,
        status: 'pending',
      });
      await storage.createLeadActivity({ leadId, type: 'task_created', summary: `Task "${title.trim()}" created by ${createdBy}`, authorName: createdBy });
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to create task" });
    }
  });

  app.patch('/api/leads/:id/tasks/:taskId', requirePermission("editLeads"), async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const leadId = parseInt(req.params.id);
      const { status, title, dueAt, assignedTo } = req.body;
      const updates: any = {};
      if (status) {
        updates.status = status;
        if (status === 'completed') updates.completedAt = new Date();
      }
      if (title) updates.title = title;
      if (dueAt !== undefined) updates.dueAt = dueAt ? new Date(dueAt) : null;
      if (assignedTo !== undefined) updates.assignedTo = assignedTo;
      const updated = await storage.updateLeadTask(taskId, updates);
      if (!updated) return res.status(404).json({ error: "Task not found" });
      if (status === 'completed') {
        await storage.createLeadActivity({ leadId, type: 'task_completed', summary: `Task "${updated.title}" completed` });
      }
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to update task" });
    }
  });

  app.delete('/api/leads/:id/tasks/:taskId', requirePermission("editLeads"), async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const deleted = await storage.deleteLeadTask(taskId);
      if (!deleted) return res.status(404).json({ error: "Task not found" });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || "Failed to delete task" });
    }
  });

  // Admin Reports endpoint - financial summaries
  app.get('/api/admin/reports', requirePermission("viewLeads"), async (req, res) => {
    try {
      const [paymentsResult, subscriptionsResult, leadsResult] = await Promise.all([
        db.execute(sql`
          SELECT 
            cs.payment_status,
            cs.mode,
            cs.amount_total,
            cs.currency,
            cs.created
          FROM stripe.checkout_sessions cs
          WHERE cs.payment_status IS NOT NULL
        `),
        db.execute(sql`
          SELECT 
            s.id,
            s.status,
            s.created,
            s.current_period_start,
            s.current_period_end,
            s.items
          FROM stripe.subscriptions s
        `),
        db.execute(sql`
          SELECT 
            l.status,
            l.payment_status,
            l.created_at
          FROM leads l
        `)
      ]);

      const payments = paymentsResult.rows as any[];
      const subscriptions = subscriptionsResult.rows as any[];
      const leads = leadsResult.rows as any[];

      const totalRevenue = payments
        .filter((p: any) => p.payment_status === 'paid')
        .reduce((sum: number, p: any) => sum + (Number(p.amount_total) || 0), 0) / 100;

      const totalPaid = payments.filter((p: any) => p.payment_status === 'paid').length;
      const totalUnpaid = payments.filter((p: any) => p.payment_status === 'unpaid').length;
      const totalPending = payments.filter((p: any) => p.payment_status === 'no_payment_required' || !p.payment_status).length;

      const subscriptionPayments = payments.filter((p: any) => p.mode === 'subscription').length;
      const oneTimePayments = payments.filter((p: any) => p.mode === 'payment').length;

      const activeSubscriptions = subscriptions.filter((s: any) => s.status === 'active').length;
      const canceledSubscriptions = subscriptions.filter((s: any) => s.status === 'canceled').length;
      const totalSubscriptions = subscriptions.length;

      const now = new Date();
      const thirtyDaysAgo = Math.floor((now.getTime() - 30 * 24 * 60 * 60 * 1000) / 1000);
      const sevenDaysAgo = Math.floor((now.getTime() - 7 * 24 * 60 * 60 * 1000) / 1000);

      const revenueThisMonth = payments
        .filter((p: any) => p.payment_status === 'paid' && Number(p.created) >= thirtyDaysAgo)
        .reduce((sum: number, p: any) => sum + (Number(p.amount_total) || 0), 0) / 100;

      const revenueThisWeek = payments
        .filter((p: any) => p.payment_status === 'paid' && Number(p.created) >= sevenDaysAgo)
        .reduce((sum: number, p: any) => sum + (Number(p.amount_total) || 0), 0) / 100;

      const monthlyRevenue: Record<string, number> = {};
      payments
        .filter((p: any) => p.payment_status === 'paid')
        .forEach((p: any) => {
          const date = new Date(Number(p.created) * 1000);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyRevenue[key] = (monthlyRevenue[key] || 0) + (Number(p.amount_total) || 0) / 100;
        });

      const totalLeads = leads.length;
      const convertedLeads = leads.filter((l: any) => l.payment_status === 'completed' || l.status === 'completed').length;
      const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

      res.json({
        overview: {
          totalRevenue,
          revenueThisMonth,
          revenueThisWeek,
          totalPaid,
          totalUnpaid,
          totalPending,
        },
        paymentTypes: {
          subscriptionPayments,
          oneTimePayments,
        },
        subscriptions: {
          total: totalSubscriptions,
          active: activeSubscriptions,
          canceled: canceledSubscriptions,
        },
        leads: {
          total: totalLeads,
          converted: convertedLeads,
          conversionRate: Number(conversionRate),
        },
        monthlyRevenue,
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.json({
        overview: { totalRevenue: 0, revenueThisMonth: 0, revenueThisWeek: 0, totalPaid: 0, totalUnpaid: 0, totalPending: 0 },
        paymentTypes: { subscriptionPayments: 0, oneTimePayments: 0 },
        subscriptions: { total: 0, active: 0, canceled: 0 },
        leads: { total: 0, converted: 0, conversionRate: 0 },
        monthlyRevenue: {},
      });
    }
  });

  return httpServer;
}
