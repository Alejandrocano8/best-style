export type UserRole = "Administrador" | "Veterinario" | "Cliente";

export type User = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};
