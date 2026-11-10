import { AuthError } from "@/application/errors/auth-error";
import type { User, UserRole } from "@/domain/entities/user";
import type { AdminRepository } from "@/domain/repositories/admin-repository";
import type { PasswordHasher } from "@/domain/services/password-hasher";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES: UserRole[] = ["Administrador", "Veterinario", "Cliente"];

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
};

function isRole(value: unknown): value is UserRole {
  return typeof value === "string" && ROLES.includes(value as UserRole);
}

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return `${first}${last}`.toUpperCase() || "US";
}

export class ManageUsers {
  constructor(
    private readonly repository: AdminRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async create(input: CreateUserInput): Promise<User> {
    const name = input.name.trim().replace(/\s+/g, " ");
    const email = input.email.trim().toLowerCase();

    if (!name) {
      throw new AuthError("Ingresa el nombre del usuario.", 400);
    }

    if (!EMAIL_PATTERN.test(email)) {
      throw new AuthError("Ingresa un correo electrónico válido.", 400);
    }

    if (input.password.length < 8) {
      throw new AuthError("La contraseña debe tener al menos 8 caracteres.", 400);
    }

    if (!isRole(input.role)) {
      throw new AuthError("Selecciona un rol válido.", 400);
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    return this.repository.createUser({
      name,
      initials: buildInitials(name),
      email,
      role: input.role,
      isActive: input.isActive,
      passwordHash,
    });
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    if (!id) {
      throw new AuthError("Usuario no válido.", 400);
    }

    if (input.role !== undefined && !isRole(input.role)) {
      throw new AuthError("Selecciona un rol válido.", 400);
    }

    let name: string | undefined;
    if (input.name !== undefined) {
      name = input.name.trim().replace(/\s+/g, " ");
      if (!name) {
        throw new AuthError("Ingresa el nombre del usuario.", 400);
      }
    }

    let email: string | undefined;
    if (input.email !== undefined) {
      email = input.email.trim().toLowerCase();
      if (!EMAIL_PATTERN.test(email)) {
        throw new AuthError("Ingresa un correo electrónico válido.", 400);
      }
    }

    let passwordHash: string | undefined;
    if (input.password) {
      if (input.password.length < 8) {
        throw new AuthError("La contraseña debe tener al menos 8 caracteres.", 400);
      }
      passwordHash = await this.passwordHasher.hash(input.password);
    }

    return this.repository.updateUser(id, {
      name,
      initials: name ? buildInitials(name) : undefined,
      email,
      passwordHash,
      role: input.role,
      isActive: input.isActive,
    });
  }

  async delete(id: string): Promise<void> {
    if (!id) {
      throw new AuthError("Usuario no válido.", 400);
    }

    await this.repository.deleteUser(id);
  }
}
