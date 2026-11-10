import { NextResponse } from "next/server";
import type { UserRole } from "@/domain/entities/user";
import { manageUsers } from "@/infrastructure/container";
import { getAdminUser } from "@/infrastructure/auth/session";
import { asText, handleAdminError, unauthorized } from "@/app/api/admin/_utils";

const ROLES: UserRole[] = ["Administrador", "Veterinario", "Cliente"];

function isRole(value: unknown): value is UserRole {
  return typeof value === "string" && ROLES.includes(value as UserRole);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminUser();
  if (!admin) return unauthorized();

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  if (body.role !== undefined && !isRole(body.role)) {
    return NextResponse.json({ error: "Selecciona un rol válido." }, { status: 400 });
  }

  if (body.isActive !== undefined && typeof body.isActive !== "boolean") {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  }

  const { id } = await params;

  if (id === admin.id && body.isActive === false) {
    return NextResponse.json(
      { error: "No puedes desactivar tu propia cuenta." },
      { status: 400 },
    );
  }

  try {
    const user = await manageUsers.update(id, {
      name: body.name !== undefined ? asText(body.name) : undefined,
      email: body.email !== undefined ? asText(body.email) : undefined,
      password: typeof body.password === "string" ? body.password : undefined,
      role: isRole(body.role) ? body.role : undefined,
      isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
    });

    return NextResponse.json({ user });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminUser();
  if (!admin) return unauthorized();

  const { id } = await params;

  if (id === admin.id) {
    return NextResponse.json(
      { error: "No puedes eliminar tu propia cuenta." },
      { status: 400 },
    );
  }

  try {
    await manageUsers.delete(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleAdminError(error);
  }
}
