import { NextResponse } from "next/server";
import { AuthError } from "@/application/errors/auth-error";
import type { UserRole } from "@/domain/entities/user";
import { loginUser } from "@/infrastructure/container";
import { setSessionCookie } from "@/infrastructure/auth/session";

type LoginBody = {
  email?: unknown;
  password?: unknown;
  role?: unknown;
};

const ROLES: UserRole[] = ["Administrador", "Veterinario", "Cliente"];

function isRole(value: unknown): value is UserRole {
  return typeof value === "string" && ROLES.includes(value as UserRole);
}

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  try {
    const user = await loginUser.execute({
      email: typeof body.email === "string" ? body.email : "",
      password: typeof body.password === "string" ? body.password : "",
      role: isRole(body.role) ? body.role : undefined,
    });

    await setSessionCookie(user);

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Login failed:", error);
    return NextResponse.json(
      { error: "No pudimos iniciar sesión. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
