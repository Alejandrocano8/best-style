import { NextResponse } from "next/server";
import { handleAdminError } from "@/app/api/admin/_utils";
import { clientUnauthorized, requireClientUser } from "@/app/api/client/_utils";
import { clientAppointments } from "@/infrastructure/container";

export async function GET(request: Request) {
  const user = await requireClientUser();
  if (!user) return clientUnauthorized();

  const date = new URL(request.url).searchParams.get("date") ?? undefined;

  try {
    const result = await clientAppointments.list(user.id, date ?? undefined);
    return NextResponse.json(result);
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function POST(request: Request) {
  const user = await requireClientUser();
  if (!user) return clientUnauthorized();

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  try {
    await clientAppointments.schedule(user.id, {
      petId: typeof body.petId === "string" ? body.petId : "",
      petName: typeof body.petName === "string" ? body.petName : undefined,
      serviceId: typeof body.serviceId === "string" ? body.serviceId : "",
      date: typeof body.date === "string" ? body.date : "",
      time: typeof body.time === "string" ? body.time : "",
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleAdminError(error);
  }
}
