import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import * as schema from "@shared/schema";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;

let _pool: pg.Pool;

if (!process.env.DATABASE_URL) {
  console.error(
    "⚠️  WARNING: DATABASE_URL is not set. The server will start but all database operations will fail."
  );
  _pool = new Pool();
} else {
  try {
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
    _pool.on("error", (err) => {
      console.error("⚠️  Postgres pool error (non-fatal):", err.message);
    });
  } catch (err) {
    console.error(
      "⚠️  Failed to construct Postgres Pool — DATABASE_URL is likely malformed. " +
        "If your password contains special characters like @ : / ? # & + space, they MUST be URL-encoded (e.g. @ → %40). " +
        "Server will start but DB operations will fail. Error:",
      (err as Error).message
    );
    _pool = new Pool();
  }
}

export const pool = _pool;
export const db = drizzle(pool, { schema });

/**
 * Run all pending Drizzle migrations at startup.
 * Safe to call on every boot — already-applied migrations are skipped.
 */
export async function runAutoMigrate() {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️  Skipping auto-migrate: DATABASE_URL not set.");
    return;
  }
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    // In the compiled dist the migrations folder is copied next to index.cjs
    const migrationsFolder = path.resolve(__dirname, "../migrations");
    await migrate(db, { migrationsFolder });
    console.log("✅ Database migrations applied.");
  } catch (err) {
    console.error("❌ Auto-migrate failed (non-fatal — server will still start):", err);
  }
}
