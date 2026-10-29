import type { AuthenticatedUser } from "@/domain/entities/auth-user";

export type AuthUserRecord = AuthenticatedUser & {
  isActive: boolean;
  passwordHash: string | null;
};

export type CreateClientAccountInput = {
  name: string;
  initials: string;
  email: string;
  phone: string | null;
  passwordHash: string;
};

export interface AuthRepository {
  findByEmail(email: string): Promise<AuthUserRecord | null>;
  createClientAccount(input: CreateClientAccountInput): Promise<AuthenticatedUser>;
}
