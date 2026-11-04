import { Pool } from "pg";
import fs from "node:fs";
import path from "node:path";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Run with: node --env-file=.env.local scripts/apply-migration.mjs");
  process.exit(1);
}

const migrationsDir = path.join(process.cwd(), "supabase/migrations");
const files = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

try {
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    await pool.query(sql);
    console.log(`Applied ${file}`);
  }
  console.log("All migrations applied successfully.");
} catch (error) {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
