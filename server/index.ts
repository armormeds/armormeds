import express, { type Request, Response, NextFunction } from "express";
import "dotenv/config";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { runMigrations } from 'stripe-replit-sync';
import { getStripeSync, getStripePublishableKey } from './stripeClient';
import { WebhookHandlers } from './webhookHandlers';

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn('⚠️  DATABASE_URL not set — Stripe initialization skipped.');
    return;
  }

  try {
    log('Initializing Stripe schema...', 'stripe');
    await runMigrations({ databaseUrl });
    log('Stripe schema ready', 'stripe');

    const stripeSync = await getStripeSync();

    log('Setting up managed webhook...', 'stripe');
    const webhookBaseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
    try {
      const result = await stripeSync.findOrCreateManagedWebhook(
        `${webhookBaseUrl}/api/stripe/webhook`
      );
      if (result?.webhook?.url) {
        log(`Webhook configured: ${result.webhook.url}`, 'stripe');
      } else {
        log('Webhook setup completed (no URL returned)', 'stripe');
      }
    } catch (webhookError) {
      log('Webhook setup skipped - will use manual configuration', 'stripe');
      console.error('Webhook setup error:', webhookError);
    }

    log('Syncing Stripe data...', 'stripe');
    await stripeSync.syncBackfill();
    log('Stripe data synced', 'stripe');
  } catch (error) {
    console.error('Failed to initialize Stripe (non-fatal):', error);
  }
}

// Run in background — never block startup or surface unhandled rejections
void initStripe();

app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature' });
    }

    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;

      if (!Buffer.isBuffer(req.body)) {
        const errorMsg = 'STRIPE WEBHOOK ERROR: req.body is not a Buffer.';
        console.error(errorMsg);
        return res.status(500).json({ error: 'Webhook processing error' });
      }

      await WebhookHandlers.processWebhook(req.body as Buffer, sig);

      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error.message);
      res.status(400).json({ error: 'Webhook processing error' });
    }
  }
);

app.get('/api/stripe/config', async (req, res) => {
  try {
    const publishableKey = await getStripePublishableKey();
    res.json({ publishableKey });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get Stripe config' });
  }
});

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Health check endpoint — responds immediately before anything else loads
  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

  // Register API routes (DB seeding runs in background, won't block this)
  try {
    await registerRoutes(httpServer, app);
  } catch (err) {
    console.error("registerRoutes error (non-fatal):", err);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Bind port FIRST so Cloud Run health check passes immediately
  const port = parseInt(process.env.PORT || "5001", 10);
  httpServer.listen({ port, host: "0.0.0.0" }, () => {
    log(`serving on port ${port}`);
  });

  // Set up static file serving or Vite dev server after port is open
  if (process.env.NODE_ENV === "production") {
    try {
      serveStatic(app);
    } catch (err) {
      console.error("Static serving setup failed (non-fatal):", err);
    }
  } else {
    try {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    } catch (err) {
      console.error("Vite setup failed (non-fatal):", err);
    }
  }
})();
