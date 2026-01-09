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

      let products = Array.from(productsMap.values());
      
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

  return httpServer;
}
