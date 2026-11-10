import { AuthError } from "@/application/errors/auth-error";
import type { AppointmentStatus } from "@/domain/entities/appointment";
import type { AdminRepository } from "@/domain/repositories/admin-repository";

const STATUSES: AppointmentStatus[] = ["confirmed", "pending", "completed", "cancelled"];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

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

function isStatus(value: unknown): value is AppointmentStatus {
  return typeof value === "string" && STATUSES.includes(value as AppointmentStatus);
}

export class ManageAppointments {
  constructor(private readonly repository: AdminRepository) {}

  async create(input: CreateAppointmentInput): Promise<void> {
    const ownerName = input.ownerName.trim();
    const petName = input.petName.trim();
    const serviceName = input.serviceName.trim();

    if (!ownerName || !petName || !serviceName) {
      throw new AuthError("Selecciona el cliente, la mascota y el servicio.", 400);
    }

    if (!DATE_PATTERN.test(input.date) || !TIME_PATTERN.test(input.time)) {
      throw new AuthError("Selecciona una fecha y una hora válidas.", 400);
    }

    if (!isStatus(input.status)) {
      throw new AuthError("Selecciona un estado válido.", 400);
    }

    await this.repository.createAppointment({
      ownerId: input.ownerId,
      ownerName,
      petId: input.petId,
      petName,
      serviceId: input.serviceId,
      serviceName,
      date: input.date,
      time: input.time,
      status: input.status,
      veterinarianId: input.veterinarianId,
      veterinarian: input.veterinarian,
    });
  }

  async update(id: string, input: UpdateAppointmentInput): Promise<void> {
    if (!id) {
      throw new AuthError("Cita no válida.", 400);
    }

    if (input.status !== undefined && !isStatus(input.status)) {
      throw new AuthError("Selecciona un estado válido.", 400);
    }

    if (input.date !== undefined && !DATE_PATTERN.test(input.date)) {
      throw new AuthError("Selecciona una fecha válida.", 400);
    }

    if (input.time !== undefined && !TIME_PATTERN.test(input.time)) {
      throw new AuthError("Selecciona una hora válida.", 400);
    }

    await this.repository.updateAppointment(id, input);
  }
}
