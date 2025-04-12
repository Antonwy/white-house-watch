import { drizzle } from 'drizzle-orm/neon-http';
import { config } from "dotenv";
import * as schema from "./schema";
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

config({ path: ".env.local" });

const db = drizzle(DATABASE_URL, { schema: { ...schema } });

export default db;
