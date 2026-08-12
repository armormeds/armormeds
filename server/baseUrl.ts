import type { Request } from "express";

/**
 * Resolve the app's public base URL in a way that works on any host
 * (Replit, Cloud Run, custom domain).
 *
 * Priority:
 * 1. PUBLIC_BASE_URL env var (set this in production, e.g. https://armormeds.com)
 * 2. The incoming request's forwarded host (works behind proxies/load balancers)
 * 3. REPLIT_DOMAINS (Replit development environment)
 * 4. localhost fallback
 */
export function getPublicBaseUrl(req?: Request): string {
  const fromEnv = process.env.PUBLIC_BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  if (req) {
    const forwardedHost = (req.headers["x-forwarded-host"] as string | undefined)
      ?.split(",")[0]
      ?.trim();
    const host = forwardedHost || req.get("host");
    if (host) {
      const proto =
        (req.headers["x-forwarded-proto"] as string | undefined)?.split(",")[0]?.trim() ||
        (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
      return `${proto}://${host}`;
    }
  }

  const replitDomain = process.env.REPLIT_DOMAINS?.split(",")[0];
  if (replitDomain) return `https://${replitDomain}`;

  return "http://localhost:5000";
}
