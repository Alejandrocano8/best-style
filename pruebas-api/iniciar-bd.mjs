// Levanta un PostgreSQL local (solo para pruebas), aplica las migraciones del
// proyecto y crea un administrador de pruebas. No toca la base de datos real.
//
// Uso (desde la raíz del proyecto):  node pruebas-api/iniciar-bd.mjs
// Dejar esta ventana abierta mientras se prueba la API. Ctrl+C para detener.

import EmbeddedPostgres from "embedded-postgres";
import pg from "pg";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { randomBytes, scryptSync } from "node:crypto";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(os.tmpdir(), "best-style-pruebas-pgdata");
const envFile = path.join(raiz, ".env.local");

const PUERTO = 54329;
const USUARIO = "postgres";
const CLAVE_BD = "postgres"; // solo accesible desde este equipo
const BASE = "best_style";
const ADMIN_EMAIL = "admin.pruebas@beststyle.test";

// --- .env.local (ignorado por git) -----------------------------------------
function leerEnv() {
  if (!fs.existsSync(envFile)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(envFile, "utf8")
      .split(/\r?\n/)
      .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
      .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
  );
}

let env = leerEnv();
const urlLocal = `postgresql://${USUARIO}:${CLAVE_BD}@127.0.0.1:${PUERTO}/${BASE}`;

if (env.DATABASE_URL && env.DATABASE_URL !== urlLocal) {
  console.error(
    "Ya existe un .env.local que apunta a otra base de datos. No lo modifico.\n" +
      "Renómbralo o bórralo si quieres usar la base de datos local de pruebas.",
  );
  process.exit(1);
}

if (!env.DATABASE_URL) {
  env = {
    DATABASE_URL: urlLocal,
    AUTH_SECRET: randomBytes(32).toString("hex"),
    PRUEBAS_ADMIN_EMAIL: ADMIN_EMAIL,
    PRUEBAS_ADMIN_PASSWORD: randomBytes(9).toString("base64url"),
  };
  fs.writeFileSync(
    envFile,
    "# Generado por pruebas-api/iniciar-bd.mjs - entorno LOCAL de pruebas\n" +
      Object.entries(env)
        .map(([k, v]) => `${k}=${v}`)
        .join("\n") +
      "\n",
  );
  console.log("Creado .env.local con la configuración local de pruebas.");
}

// --- PostgreSQL embebido ----------------------------------------------------
const servidor = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: USUARIO,
  password: CLAVE_BD,
  port: PUERTO,
  persistent: true,
  initdbFlags: ["--encoding=UTF8", "--locale=C"],
  postgresFlags: ["-c", "ssl=on"],
  onLog: () => {},
  onError: (m) => console.error(String(m)),
});

const nueva = !fs.existsSync(path.join(dataDir, "PG_VERSION"));
if (nueva) await servidor.initialise();

// La app exige conexión SSL: certificado autofirmado para el servidor local.
const crt = path.join(dataDir, "server.crt");
const key = path.join(dataDir, "server.key");
if (!fs.existsSync(crt)) {
  const candidatos = [
    "openssl",
    "C:\\Program Files\\Git\\mingw64\\bin\\openssl.exe",
    "C:\\Program Files\\Git\\usr\\bin\\openssl.exe",
  ];
  let ok = false;
  for (const bin of candidatos) {
    try {
      execFileSync(
        bin,
        ["req", "-new", "-x509", "-days", "365", "-nodes", "-subj", "/CN=localhost", "-out", crt, "-keyout", key],
        { stdio: "ignore", env: { ...process.env, MSYS_NO_PATHCONV: "1" } },
      );
      ok = true;
      break;
    } catch {}
  }
  if (!ok) {
    console.error("No encontré openssl para generar el certificado local (viene con Git para Windows).");
    process.exit(1);
  }
}

await servidor.start();
if (nueva) await servidor.createDatabase(BASE);

// --- Migraciones + administrador de pruebas ---------------------------------
const pool = new pg.Pool({ connectionString: urlLocal, ssl: { rejectUnauthorized: false } });
const dirMigraciones = path.join(raiz, "supabase", "migrations");
for (const archivo of fs.readdirSync(dirMigraciones).filter((f) => f.endsWith(".sql")).sort()) {
  await pool.query(fs.readFileSync(path.join(dirMigraciones, archivo), "utf8"));
  console.log(`Migración aplicada: ${archivo}`);
}

const salt = randomBytes(16).toString("hex");
const hash = `scrypt:${salt}:${scryptSync(env.PRUEBAS_ADMIN_PASSWORD, salt, 64).toString("hex")}`;
await pool.query(
  `INSERT INTO users (name, initials, email, role, is_active, password_hash)
   VALUES ('Admin Pruebas', 'AP', $1, 'Administrador', true, $2)
   ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, is_active = true, role = 'Administrador'`,
  [env.PRUEBAS_ADMIN_EMAIL, hash],
);
await pool.end();

console.log(`\nBase de datos local lista en 127.0.0.1:${PUERTO} (${BASE}).`);
console.log("Administrador de pruebas: credenciales en .env.local");
console.log("Deja esta ventana abierta. Ctrl+C para detener.");

const detener = async () => {
  await servidor.stop();
  process.exit(0);
};
process.on("SIGINT", detener);
process.on("SIGTERM", detener);
setInterval(() => {}, 1 << 30);
