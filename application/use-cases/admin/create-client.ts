import { AuthError } from "@/application/errors/auth-error";
import type { AdminRepository } from "@/domain/repositories/admin-repository";

export type CreateClientInput = {
  name: string;
  nationalId: string;
  phone: string;
};

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return `${first}${last}`.toUpperCase() || "CL";
}

export class CreateClient {
  constructor(private readonly repository: AdminRepository) {}

  async execute(input: CreateClientInput): Promise<void> {
    const name = input.name.trim().replace(/\s+/g, " ");
    const nationalId = input.nationalId.trim();
    const phone = input.phone.trim();

    if (!name) {
      throw new AuthError("Ingresa el nombre del cliente.", 400);
    }

    await this.repository.createClient({
      name,
      initials: buildInitials(name),
      nationalId: nationalId || null,
      phone: phone || null,
    });
  }
}
