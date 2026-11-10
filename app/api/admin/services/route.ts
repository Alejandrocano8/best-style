import { NextResponse } from "next/server";
import { manageServices } from "@/infrastructure/container";
import { getAdminUser } from "@/infrastructure/auth/session";
import {
  asBoolean,
  asNumber,
  asText,
  handleAdminError,
  unauthorized,
} from "@/app/api/admin/_utils";

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
    await manageServices.create({
      name: asText(body.name),
      icon: asText(body.icon),
      durationMinutes: asNumber(body.durationMinutes, 30),
      price: asNumber(body.price, 0),
      isActive: asBoolean(body.isActive, true),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleAdminError(error);
  }
}
