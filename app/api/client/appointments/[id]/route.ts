import { NextResponse } from "next/server";
import { handleAdminError } from "@/app/api/admin/_utils";
import { clientUnauthorized, requireClientUser } from "@/app/api/client/_utils";
import { clientAppointments } from "@/infrastructure/container";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireClientUser();
  if (!user) return clientUnauthorized();

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  if (body.status !== "cancelled") {
    return NextResponse.json({ error: "Solo puedes cancelar tus citas." }, { status: 400 });
  }

  try {
    const { id } = await params;
    await clientAppointments.cancel(user.id, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleAdminError(error);
  }
}
