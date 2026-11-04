import type { AuthenticatedUser } from "@/domain/entities/auth-user";
import type { UserRole } from "@/domain/entities/user";
import type { AuthRepository } from "@/domain/repositories/auth-repository";
import type { PasswordHasher } from "@/domain/services/password-hasher";
import { AuthError } from "@/application/errors/auth-error";

export type LoginUserInput = {
  email: string;
  password: string;
  role?: UserRole;
};

export class LoginUser {
  constructor(
    private readonly repository: AuthRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: LoginUserInput): Promise<AuthenticatedUser> {
    const email = input.email.trim().toLowerCase();

    if (!email || !input.password) {
      throw new AuthError("Ingresa tu correo y contraseña.", 400);
    }

    const record = await this.repository.findByEmail(email);

    if (!record || !record.passwordHash) {
      throw new AuthError("Correo o contraseña incorrectos.", 401);
    }

    if (!record.isActive) {
      throw new AuthError("Tu cuenta está inactiva. Contacta a Best Style.", 403);
    }

    const passwordMatches = await this.passwordHasher.verify(input.password, record.passwordHash);

    if (!passwordMatches) {
      throw new AuthError("Correo o contraseña incorrectos.", 401);
    }

    if (input.role && record.role !== input.role) {
      // Permitir login si las credenciales son correctas; usar el rol real de la cuenta
    }

    return {
      id: record.id,
      name: record.name,
      initials: record.initials,
      email: record.email,
      role: record.role,
    };
  }
}
