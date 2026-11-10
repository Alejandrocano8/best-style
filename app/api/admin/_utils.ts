import { NextResponse } from "next/server";
import { AuthError } from "@/application/errors/auth-error";

export function unauthorized() {
  return NextResponse.json(
    { error: "No tienes permisos para realizar esta acción." },
    { status: 403 },
  );
}

export function handleAdminError(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  const code = (error as { code?: string }).code;

  if (code === "23505") {
    return NextResponse.json(
      { error: "Ya existe un registro con esos datos." },
      { status: 409 },
    );
  }

  if (error instanceof Error && error.message.endsWith("_NOT_FOUND")) {
    return NextResponse.json({ error: "No encontramos el registro." }, { status: 404 });
  }

  console.error("Admin action failed:", error);
  return NextResponse.json(
    { error: "No pudimos completar la operación. Intenta de nuevo." },
    { status: 500 },
  );
}

export function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function asOptionalText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

export function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
