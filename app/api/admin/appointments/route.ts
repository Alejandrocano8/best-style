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
    await manageAppointments.create({
      ownerId: asOptionalText(body.ownerId),
      ownerName: asText(body.ownerName),
      petId: asOptionalText(body.petId),
      petName: asText(body.petName),
      serviceId: asOptionalText(body.serviceId),
      serviceName: asText(body.serviceName),
      date: asText(body.date),
      time: asText(body.time),
      status: isStatus(body.status) ? body.status : "pending",
      veterinarianId: asOptionalText(body.veterinarianId),
      veterinarian: asOptionalText(body.veterinarian),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleAdminError(error);
  }
}
