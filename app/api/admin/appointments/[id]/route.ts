import { NextResponse } from "next/server";
import type { AppointmentStatus } from "@/domain/entities/appointment";
import { manageAppointments } from "@/infrastructure/container";
import { getAdminUser } from "@/infrastructure/auth/session";
import {
  asOptionalText,
  asText,
  handleAdminError,
  unauthorized,
} from "@/app/api/admin/_utils";

const STATUSES: AppointmentStatus[] = ["confirmed", "pending", "completed", "cancelled"];

function isStatus(value: unknown): value is AppointmentStatus {
  return typeof value === "string" && STATUSES.includes(value as AppointmentStatus);
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

  if (body.status !== undefined && !isStatus(body.status)) {
    return NextResponse.json({ error: "Selecciona un estado válido." }, { status: 400 });
  }

  try {
    const { id } = await params;

    await manageAppointments.update(id, {
      status: isStatus(body.status) ? body.status : undefined,
      date: body.date !== undefined ? asText(body.date) : undefined,
      time: body.time !== undefined ? asText(body.time) : undefined,
      veterinarianId: asOptionalText(body.veterinarianId),
      veterinarian: asOptionalText(body.veterinarian),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleAdminError(error);
  }
}
