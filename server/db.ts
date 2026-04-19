import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import "dotenv/config";

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
