import type { UserRole } from "@/domain/entities/user";

export type AuthenticatedUser = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
};
