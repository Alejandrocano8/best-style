// Llama a cada endpoint de la API de Best Style y guarda la evidencia
// (petición, código de estado y respuesta) en pruebas-api/RESULTADOS.md.
//
// Requisitos: la base local y la app encendidas (ver iniciar-bd.mjs).
// Uso (desde la raíz):  node --env-file=.env.local pruebas-api/probar-api.mjs

import pg from "pg";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.API_URL ?? "http://localhost:3100";
const ADMIN_EMAIL = process.env.PRUEBAS_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.PRUEBAS_ADMIN_PASSWORD;
const dir = path.dirname(fileURLToPath(import.meta.url));

if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !process.env.DATABASE_URL) {
  console.error("Faltan variables. Ejecuta con: node --env-file=.env.local pruebas-api/probar-api.mjs");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const idDe = async (sql, params) => (await pool.query(sql, params)).rows[0]?.id;

const sufijo = Date.now().toString(36);
const resultados = [];
let seccionActual = "";

const seccion = (nombre) => {
  seccionActual = nombre;
  console.log(`\n== ${nombre}`);
};

const ocultar = (body) =>
  body && typeof body === "object" && "password" in body ? { ...body, password: "********" } : body;

async function probar(nombre, metodo, ruta, { body, cookie, esperado, crudo } = {}) {
  const res = await fetch(BASE + ruta, {
    method: metodo,
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    body: crudo ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });
  const texto = await res.text();
  let json;
  try {
    json = JSON.parse(texto);
  } catch {
    json = texto.slice(0, 200);
  }
  const setCookie = res.headers.get("set-cookie");
  const ok = res.status === esperado;
  resultados.push({
    seccion: seccionActual,
    nombre,
    metodo,
    ruta,
    body: crudo ?? ocultar(body),
    esperado,
    obtenido: res.status,
    respuesta: json,
    ok,
  });
  console.log(`${ok ? "OK   " : "FALLA"} ${metodo.padEnd(6)} ${ruta}  ->  ${res.status} (esperado ${esperado})  ${nombre}`);
  return { status: res.status, json, cookie: setCookie ? setCookie.split(";")[0] : null };
}

// ---------------------------------------------------------------- Autenticación
seccion("Autenticación");
const login = await probar("Login correcto (administrador)", "POST", "/api/auth/login", {
  body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  esperado: 200,
});
const admin = login.cookie;
const adminId = login.json?.user?.id;

await probar("Login con contraseña incorrecta", "POST", "/api/auth/login", {
  body: { email: ADMIN_EMAIL, password: "clave-incorrecta" },
  esperado: 401,
});
await probar("Login sin datos", "POST", "/api/auth/login", { body: {}, esperado: 400 });
await probar("Login con JSON mal formado", "POST", "/api/auth/login", { crudo: "{esto no es json", esperado: 400 });

const correoCliente = `cliente.${sufijo}@beststyle.test`;
const registro = await probar("Registro de cliente nuevo", "POST", "/api/auth/register", {
  body: { firstName: "Cliente", lastName: "Demo", phone: "300 123 4567", email: correoCliente, password: "ClaveDemo123" },
  esperado: 201,
});
const cliente = registro.cookie;
await probar("Registro con correo repetido", "POST", "/api/auth/register", {
  body: { firstName: "Cliente", lastName: "Demo", phone: "", email: correoCliente, password: "ClaveDemo123" },
  esperado: 409,
});
await probar("Registro con correo inválido", "POST", "/api/auth/register", {
  body: { firstName: "Cliente", lastName: "Demo", phone: "", email: "no-es-correo", password: "ClaveDemo123" },
  esperado: 400,
});
await probar("Registro con contraseña corta", "POST", "/api/auth/register", {
  body: { firstName: "Cliente", lastName: "Demo", phone: "", email: `otro.${sufijo}@beststyle.test`, password: "123" },
  esperado: 400,
});
await probar("Cerrar sesión", "POST", "/api/auth/logout", { cookie: cliente, esperado: 200 });

// ---------------------------------------------------------------- Permisos
seccion("Permisos de administración");
const usuarioNuevo = { name: "Vet Demo", email: `vet.${sufijo}@beststyle.test`, password: "ClaveDemo123", role: "Veterinario" };
await probar("Crear usuario sin sesión", "POST", "/api/admin/users", { body: usuarioNuevo, esperado: 403 });
await probar("Crear usuario con sesión de cliente", "POST", "/api/admin/users", { body: usuarioNuevo, cookie: cliente, esperado: 403 });
await probar("Crear servicio con cookie falsificada", "POST", "/api/admin/services", {
  body: { name: "Hack" },
  cookie: "best_style_session=abc.def",
  esperado: 403,
});

// ---------------------------------------------------------------- Usuarios
seccion("Usuarios");
const creado = await probar("Crear usuario veterinario", "POST", "/api/admin/users", { body: usuarioNuevo, cookie: admin, esperado: 201 });
const vetId = creado.json?.user?.id;
await probar("Crear usuario con correo repetido", "POST", "/api/admin/users", { body: usuarioNuevo, cookie: admin, esperado: 409 });
await probar("Crear usuario con rol inválido", "POST", "/api/admin/users", {
  body: { ...usuarioNuevo, email: `x.${sufijo}@beststyle.test`, role: "Jefe" },
  cookie: admin,
  esperado: 400,
});
await probar("Editar nombre del usuario", "PATCH", `/api/admin/users/${vetId}`, {
  body: { name: "Vet Demo Editado" },
  cookie: admin,
  esperado: 200,
});
await probar("Desactivar la propia cuenta (no permitido)", "PATCH", `/api/admin/users/${adminId}`, {
  body: { isActive: false },
  cookie: admin,
  esperado: 400,
});
await probar("Eliminar la propia cuenta (no permitido)", "DELETE", `/api/admin/users/${adminId}`, { cookie: admin, esperado: 400 });
await probar("Editar usuario que no existe", "PATCH", "/api/admin/users/99999999-9999-4999-8999-999999999999", {
  body: { name: "Nadie" },
  cookie: admin,
  esperado: 404,
});

// ---------------------------------------------------------------- Servicios
seccion("Servicios");
const nombreServicio = `Baño demo ${sufijo}`;
await probar("Crear servicio", "POST", "/api/admin/services", {
  body: { name: nombreServicio, icon: "🛁", durationMinutes: 45, price: 35000, isActive: true },
  cookie: admin,
  esperado: 201,
});
const servicioId = await idDe("SELECT id FROM services WHERE name = $1", [nombreServicio]);
await probar("Crear servicio sin nombre", "POST", "/api/admin/services", {
  body: { name: "", durationMinutes: 30, price: 1000 },
  cookie: admin,
  esperado: 400,
});
await probar("Crear servicio con duración 0", "POST", "/api/admin/services", {
  body: { name: "Servicio malo", durationMinutes: 0, price: 1000 },
  cookie: admin,
  esperado: 400,
});
await probar("Editar precio del servicio", "PATCH", `/api/admin/services/${servicioId}`, {
  body: { price: 40000, isActive: false },
  cookie: admin,
  esperado: 200,
});
await probar("Editar servicio con precio negativo", "PATCH", `/api/admin/services/${servicioId}`, {
  body: { price: -5 },
  cookie: admin,
  esperado: 400,
});

// ---------------------------------------------------------------- Clientes
seccion("Clientes");
const cedula = `DEMO-${sufijo}`;
await probar("Crear cliente", "POST", "/api/admin/clients", {
  body: { name: "Cliente Mostrador", nationalId: cedula, phone: "301 000 0000" },
  cookie: admin,
  esperado: 201,
});
const clienteId = await idDe("SELECT id FROM clients WHERE national_id = $1", [cedula]);
await probar("Crear cliente con cédula repetida", "POST", "/api/admin/clients", {
  body: { name: "Otro Cliente", nationalId: cedula, phone: "" },
  cookie: admin,
  esperado: 409,
});
await probar("Crear cliente sin nombre", "POST", "/api/admin/clients", {
  body: { name: "", nationalId: "", phone: "" },
  cookie: admin,
  esperado: 400,
});

// ---------------------------------------------------------------- Citas
seccion("Citas");
const mascota = `Rocky ${sufijo}`;
await probar("Crear cita", "POST", "/api/admin/appointments", {
  body: {
    ownerId: clienteId,
    ownerName: "Cliente Mostrador",
    petName: mascota,
    serviceId: servicioId,
    serviceName: nombreServicio,
    date: "2026-12-15",
    time: "10:30",
    status: "pending",
    veterinarianId: vetId,
    veterinarian: "Vet Demo Editado",
  },
  cookie: admin,
  esperado: 201,
});
const citaId = await idDe("SELECT id FROM appointments WHERE pet_name = $1", [mascota]);
await probar("Crear cita con fecha inválida", "POST", "/api/admin/appointments", {
  body: { ownerName: "Cliente Mostrador", petName: "Rocky", serviceName: nombreServicio, date: "15/12/2026", time: "10:30" },
  cookie: admin,
  esperado: 400,
});
await probar("Crear cita sin mascota", "POST", "/api/admin/appointments", {
  body: { ownerName: "Cliente Mostrador", petName: "", serviceName: nombreServicio, date: "2026-12-15", time: "10:30" },
  cookie: admin,
  esperado: 400,
});
await probar("Confirmar la cita", "PATCH", `/api/admin/appointments/${citaId}`, {
  body: { status: "confirmed" },
  cookie: admin,
  esperado: 200,
});
const trasConfirmar = (await pool.query("SELECT status, veterinarian_id FROM appointments WHERE id = $1", [citaId])).rows[0];
await probar("Reprogramar la cita", "PATCH", `/api/admin/appointments/${citaId}`, {
  body: { date: "2026-12-16", time: "15:00", veterinarianId: vetId, veterinarian: "Vet Demo Editado" },
  cookie: admin,
  esperado: 200,
});
await probar("Cambiar a un estado inválido", "PATCH", `/api/admin/appointments/${citaId}`, {
  body: { status: "perdida" },
  cookie: admin,
  esperado: 400,
});

// ---------------------------------------------------------------- Limpieza
seccion("Eliminar usuario");
await probar("Eliminar el usuario veterinario", "DELETE", `/api/admin/users/${vetId}`, { cookie: admin, esperado: 200 });
await probar("Eliminar un usuario que ya no existe", "DELETE", `/api/admin/users/${vetId}`, { cookie: admin, esperado: 404 });

await pool.end();

// ---------------------------------------------------------------- Informe
const bien = resultados.filter((r) => r.ok).length;
const fecha = new Date().toLocaleString("es-CO");
let md = `# Pruebas de la API - Best Style\n\n`;
md += `- **Fecha de ejecución:** ${fecha}\n- **Servidor:** ${BASE} (Next.js en local)\n`;
md += `- **Base de datos:** PostgreSQL local con las migraciones del proyecto\n`;
md += `- **Resultado:** ${bien} de ${resultados.length} peticiones respondieron con el código esperado\n\n`;
md += `## Resumen\n\n| # | Sección | Prueba | Petición | Esperado | Obtenido | |\n|---|---|---|---|---|---|---|\n`;
resultados.forEach((r, i) => {
  md += `| ${i + 1} | ${r.seccion} | ${r.nombre} | \`${r.metodo} ${r.ruta.replace(/[0-9a-f-]{36}/, "{id}")}\` | ${r.esperado} | ${r.obtenido} | ${r.ok ? "✅" : "❌"} |\n`;
});
md += `\n## Observación\n\nTras "Confirmar la cita" (solo se envió \`status\`), la cita quedó con estado \`${trasConfirmar?.status}\` y veterinario ${trasConfirmar?.veterinarian_id ? "asignado" : "**sin asignar (se borró)**"}.\n`;
md += `\n## Detalle\n`;
resultados.forEach((r, i) => {
  md += `\n### ${i + 1}. ${r.nombre}\n\n\`${r.metodo} ${r.ruta}\`\n\n`;
  if (r.body !== undefined) md += `Cuerpo enviado:\n\n\`\`\`json\n${typeof r.body === "string" ? r.body : JSON.stringify(r.body, null, 2)}\n\`\`\`\n\n`;
  md += `Respuesta: **${r.obtenido}** (esperado ${r.esperado}) ${r.ok ? "✅" : "❌"}\n\n\`\`\`json\n${typeof r.respuesta === "string" ? r.respuesta : JSON.stringify(r.respuesta, null, 2)}\n\`\`\`\n`;
});
fs.writeFileSync(path.join(dir, "RESULTADOS.md"), md);

console.log(`\n${bien} de ${resultados.length} con el código esperado. Informe: pruebas-api/RESULTADOS.md`);
console.log(`Tras confirmar la cita -> estado: ${trasConfirmar?.status}, veterinario: ${trasConfirmar?.veterinarian_id ?? "NULL"}`);
