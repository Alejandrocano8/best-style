import { NextResponse } from "next/server";
import type { UserRole } from "@/domain/entities/user";
import { manageUsers } from "@/infrastructure/container";
import { getAdminUser } from "@/infrastructure/auth/session";
import { asBoolean, asText, handleAdminError, unauthorized } from "@/app/api/admin/_utils";

const ROLES: UserRole[] = ["Administrador", "Veterinario", "Cliente"];

function isRole(value: unknown): value is UserRole {
  return typeof value === "string" && ROLES.includes(value as UserRole);
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return unauthorized();

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  if (!isRole(body.role)) {
    return NextResponse.json({ error: "Selecciona un rol válido." }, { status: 400 });
  }

  try {
    const user = await manageUsers.create({
      name: asText(body.name),
      email: asText(body.email),
      password: asText(body.password),
      role: body.role,
      isActive: asBoolean(body.isActive, true),
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return handleAdminError(error);
  }
}
