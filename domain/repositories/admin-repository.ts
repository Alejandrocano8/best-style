import type { AppointmentStatus } from "@/domain/entities/appointment";
import type { User, UserRole } from "@/domain/entities/user";

export type CreateUserInput = {
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  passwordHash: string;
};

export type UpdateUserInput = {
  name?: string;
  initials?: string;
  email?: string;
  passwordHash?: string;
  role?: UserRole;
  isActive?: boolean;
};

export type CreateAppointmentInput = {
  ownerId: string | null;
  ownerName: string;
  petId: string | null;
  petName: string;
  serviceId: string | null;
  serviceName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  veterinarianId: string | null;
  veterinarian: string | null;
};

export type UpdateAppointmentInput = {
  status?: AppointmentStatus;
  date?: string;
  time?: string;
  veterinarianId?: string | null;
  veterinarian?: string | null;
};

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

export type CreateClientInput = {
  name: string;
  initials: string;
  nationalId: string | null;
  phone: string | null;
};

export interface AdminRepository {
  createUser(input: CreateUserInput): Promise<User>;
  updateUser(id: string, input: UpdateUserInput): Promise<User>;
  deleteUser(id: string): Promise<void>;
  createAppointment(input: CreateAppointmentInput): Promise<void>;
  updateAppointment(id: string, input: UpdateAppointmentInput): Promise<void>;
  createService(input: CreateServiceInput): Promise<void>;
  updateService(id: string, input: UpdateServiceInput): Promise<void>;
  createClient(input: CreateClientInput): Promise<void>;
}
