import { Pool } from "pg";
import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const options = {
    target: "unspecified",
    allowProduction: false,
    seed: null,
    status: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--target") {
      options.target = argv[++i] ?? "";
    } else if (arg.startsWith("--target=")) {
      options.target = arg.slice("--target=".length);
    } else if (arg === "--allow-production") {
      options.allowProduction = true;
    } else if (arg === "--seed") {
      options.seed = argv[++i] ?? null;
    } else if (arg.startsWith("--seed=")) {
      options.seed = arg.slice("--seed=".length);
    } else if (arg === "--status") {
      options.status = true;
    } else {
      throw new Error(`Argumento desconocido: ${arg}`);
    }
  }

  return options;
}

function describeTarget(connectionString) {
  try {
    const url = new URL(connectionString);
    return `${url.hostname}${url.pathname} (usuario: ${url.username})`;
  } catch {
    return "(DATABASE_URL no se pudo interpretar)";
  }
}

const options = parseArgs(process.argv.slice(2));

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error(
    "DATABASE_URL is not set. Run with: node --env-file=.env.test.local scripts/apply-migration.mjs --target testing",
  );
  process.exit(1);
}

if (options.target === "production" && !options.allowProduction) {
  console.error(
    "Ejecución bloqueada: el destino es producción. Añade --allow-production solo si estás seguro.",
  );
  process.exit(1);
}

const migrationsDir = path.join(process.cwd(), "supabase/migrations");
const files = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

const seedPath = options.seed ? path.resolve(options.seed) : null;

console.log(`Entorno destino: ${options.target}`);
console.log(`Base de datos: ${describeTarget(connectionString)}`);
if (seedPath) {
  console.log(`Seed: ${path.relative(process.cwd(), seedPath)}`);
}

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS _schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrations(client) {
  const result = await client.query("SELECT filename FROM _schema_migrations");
  return new Set(result.rows.map((row) => row.filename));
}

async function runInTransaction(client, sql) {
  await client.query("BEGIN");
  try {
    await client.query(sql);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

try {
  const client = await pool.connect();

  try {
    await ensureMigrationsTable(client);
    const applied = await getAppliedMigrations(client);
    const pending = files.filter((file) => !applied.has(file));

    if (options.status) {
      for (const file of files) {
        console.log(`${applied.has(file) ? "aplicada" : "pendiente"}  ${file}`);
      }
      console.log(`\n${pending.length} migración(es) pendiente(s).`);
    } else {
      for (const file of pending) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

        await client.query("BEGIN");
        try {
          await client.query(sql);
          await client.query("INSERT INTO _schema_migrations (filename) VALUES ($1)", [file]);
          await client.query("COMMIT");
          console.log(`Applied ${file}`);
        } catch (error) {
          await client.query("ROLLBACK");
          throw error;
        }
      }

      if (pending.length === 0) {
        console.log("No hay migraciones pendientes.");
      }

      if (seedPath) {
        const seedSql = fs.readFileSync(seedPath, "utf8");
        await runInTransaction(client, seedSql);
        console.log(`Applied seed ${path.relative(process.cwd(), seedPath)}`);
      }

      console.log("Proceso de migración completado correctamente.");
    }
  } finally {
    client.release();
  }
} catch (error) {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
