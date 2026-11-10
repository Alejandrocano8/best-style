import { NextResponse } from "next/server";
import { createClient } from "@/infrastructure/container";
import { getAdminUser } from "@/infrastructure/auth/session";
import { asText, handleAdminError, unauthorized } from "@/app/api/admin/_utils";

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return unauthorized();

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  try {
    await createClient.execute({
      name: asText(body.name),
      nationalId: asText(body.nationalId),
      phone: asText(body.phone),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleAdminError(error);
  }
}
