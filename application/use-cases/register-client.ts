import type { AuthenticatedUser } from "@/domain/entities/auth-user";
import type { AuthRepository } from "@/domain/repositories/auth-repository";
import type { PasswordHasher } from "@/domain/services/password-hasher";
import { AuthError } from "@/application/errors/auth-error";

export type RegisterClientInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class RegisterClient {
  constructor(
    private readonly repository: AuthRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: RegisterClientInput): Promise<AuthenticatedUser> {
    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();
    const phone = input.phone.trim();
    const email = input.email.trim().toLowerCase();

    if (!firstName || !lastName) {
      throw new AuthError("Ingresa tus nombres y apellidos.", 400);
    }

    if (!EMAIL_PATTERN.test(email)) {
      throw new AuthError("Ingresa un correo electrónico válido.", 400);
    }

    if (input.password.length < 8) {
      throw new AuthError("La contraseña debe tener al menos 8 caracteres.", 400);
    }

    const existingUser = await this.repository.findByEmail(email);

    if (existingUser) {
      throw new AuthError("Ya existe una cuenta con este correo.", 409);
    }

    const name = `${firstName} ${lastName}`.replace(/\s+/g, " ").trim();
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    const passwordHash = await this.passwordHasher.hash(input.password);

    return this.repository.createClientAccount({
      name,
      initials,
      email,
      phone: phone || null,
      passwordHash,
    });
  }
}
