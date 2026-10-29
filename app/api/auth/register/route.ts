import { NextResponse } from "next/server";
import { AuthError } from "@/application/errors/auth-error";
import { registerClient } from "@/infrastructure/container";
import { setSessionCookie } from "@/infrastructure/auth/session";

type RegisterBody = {
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  email?: unknown;
  password?: unknown;
};

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  let body: RegisterBody;

  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  try {
    const user = await registerClient.execute({
      firstName: asText(body.firstName),
      lastName: asText(body.lastName),
      phone: asText(body.phone),
      email: asText(body.email),
      password: asText(body.password),
    });

    await setSessionCookie(user);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este correo." },
        { status: 409 },
      );
    }

    console.error("Registration failed:", error);
    return NextResponse.json(
      { error: "No pudimos crear tu cuenta. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
