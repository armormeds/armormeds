import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import "dotenv/config";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error(
    "⚠️  WARNING: DATABASE_URL is not set. The server will start but all database operations will fail. Set this environment variable in Cloud Run."
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL || "" });
export const db = drizzle(pool, { schema });
