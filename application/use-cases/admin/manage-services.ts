import { AuthError } from "@/application/errors/auth-error";
import type { AdminRepository } from "@/domain/repositories/admin-repository";

export type CreateServiceInput = {
  name: string;
  icon: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
};

export type UpdateServiceInput = {
  name?: string;
  icon?: string;
  durationMinutes?: number;
  price?: number;
  isActive?: boolean;
};

export class ManageServices {
  constructor(private readonly repository: AdminRepository) {}

  async create(input: CreateServiceInput): Promise<void> {
    const name = input.name.trim();

    if (!name) {
      throw new AuthError("Ingresa el nombre del servicio.", 400);
    }

    if (!Number.isFinite(input.durationMinutes) || input.durationMinutes <= 0) {
      throw new AuthError("La duración debe ser mayor a cero.", 400);
    }

    if (!Number.isFinite(input.price) || input.price < 0) {
      throw new AuthError("Ingresa un precio válido.", 400);
    }

    await this.repository.createService({
      name,
      icon: input.icon.trim() || "🛁",
      durationMinutes: Math.round(input.durationMinutes),
      price: input.price,
      isActive: input.isActive,
    });
  }

  async update(id: string, input: UpdateServiceInput): Promise<void> {
    if (!id) {
      throw new AuthError("Servicio no válido.", 400);
    }

    if (input.name !== undefined && !input.name.trim()) {
      throw new AuthError("Ingresa el nombre del servicio.", 400);
    }

    if (
      input.durationMinutes !== undefined &&
      (!Number.isFinite(input.durationMinutes) || input.durationMinutes <= 0)
    ) {
      throw new AuthError("La duración debe ser mayor a cero.", 400);
    }

    if (input.price !== undefined && (!Number.isFinite(input.price) || input.price < 0)) {
      throw new AuthError("Ingresa un precio válido.", 400);
    }

    await this.repository.updateService(id, {
      name: input.name?.trim(),
      icon: input.icon?.trim(),
      durationMinutes:
        input.durationMinutes !== undefined ? Math.round(input.durationMinutes) : undefined,
      price: input.price,
      isActive: input.isActive,
    });
  }
}
