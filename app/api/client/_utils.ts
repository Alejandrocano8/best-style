import { NextResponse } from "next/server";
import { getSessionUser } from "@/infrastructure/auth/session";

export async function requireClientUser() {
  const user = await getSessionUser();
  return user?.role === "Cliente" ? user : null;
}

export function clientUnauthorized() {
  return NextResponse.json(
    { error: "Inicia sesión como cliente para gestionar tus citas." },
    { status: 403 },
  );
}
