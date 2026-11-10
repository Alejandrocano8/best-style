import { NextResponse } from "next/server";
import { manageServices } from "@/infrastructure/container";
import { getAdminUser } from "@/infrastructure/auth/session";
import { handleAdminError, unauthorized } from "@/app/api/admin/_utils";

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

  try {
    const { id } = await params;

    await manageServices.update(id, {
      name: typeof body.name === "string" ? body.name : undefined,
      icon: typeof body.icon === "string" ? body.icon : undefined,
      durationMinutes:
        typeof body.durationMinutes === "number" ? body.durationMinutes : undefined,
      price: typeof body.price === "number" ? body.price : undefined,
      isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleAdminError(error);
  }
}
