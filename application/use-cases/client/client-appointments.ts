import { AuthError } from "@/application/errors/auth-error";
import type {
  ClientAppointment,
  ClientProfile,
  ClientRepository,
} from "@/domain/repositories/client-repository";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const OPENING_TIME = "08:00";
const CLOSING_TIME = "17:00";

export type ScheduleClientAppointmentInput = {
  petId: string;
  petName?: string;
  serviceId: string;
  date: string;
  time: string;
};

export type ClientAppointmentsResult = {
  client: ClientProfile;
  appointments: ClientAppointment[];
  bookedTimes: string[];
  today: string;
};

export function todayIso(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export class ClientAppointments {
  constructor(private readonly repository: ClientRepository) {}

  async list(userId: string, date?: string): Promise<ClientAppointmentsResult> {
    const client = await this.requireClient(userId);
    const [appointments, bookedTimes] = await Promise.all([
      this.repository.listAppointments(client.id),
      date && DATE_PATTERN.test(date) ? this.repository.bookedTimes(date) : Promise.resolve([]),
    ]);

    return { client, appointments, bookedTimes, today: todayIso() };
  }

  async schedule(userId: string, input: ScheduleClientAppointmentInput): Promise<void> {
    const client = await this.requireClient(userId);

    if (!input.serviceId) {
      throw new AuthError("Selecciona un servicio.", 400);
    }

    const manualPetName = (input.petName ?? "").trim();
    if (!input.petId && manualPetName.length < 2) {
      throw new AuthError("Selecciona una mascota o escribe su nombre.", 400);
    }

    if (!DATE_PATTERN.test(input.date) || input.date < todayIso()) {
      throw new AuthError("Selecciona una fecha válida a partir de hoy.", 400);
    }

    if (
      !TIME_PATTERN.test(input.time) ||
      input.time < OPENING_TIME ||
      input.time > CLOSING_TIME
    ) {
      throw new AuthError("Selecciona una hora entre las 8:00 am y las 5:00 pm.", 400);
    }

    const [pet, service] = await Promise.all([
      input.petId
        ? this.repository.findPetForClient(input.petId, client.id)
        : Promise.resolve(null),
      this.repository.findActiveService(input.serviceId),
    ]);

    if (input.petId && !pet) {
      throw new AuthError("La mascota seleccionada no está registrada a tu nombre.", 400);
    }

    if (!service) {
      throw new AuthError("El servicio seleccionado no está disponible.", 400);
    }

    if (await this.repository.isSlotTaken(input.date, input.time)) {
      throw new AuthError("Ese horario ya está ocupado. Elige otra hora.", 409);
    }

    await this.repository.createAppointment({
      ownerId: client.id,
      ownerName: client.name,
      petId: pet?.id ?? null,
      petName: pet?.name ?? manualPetName,
      serviceId: service.id,
      serviceName: service.name,
      date: input.date,
      time: input.time,
    });
  }

  async cancel(userId: string, appointmentId: string): Promise<void> {
    const client = await this.requireClient(userId);

    if (!appointmentId) {
      throw new AuthError("Cita no válida.", 400);
    }

    try {
      await this.repository.cancelAppointment(appointmentId, client.id);
    } catch (error) {
      if (error instanceof Error && error.message === "APPOINTMENT_NOT_FOUND") {
        throw new AuthError("No encontramos la cita o ya no se puede cancelar.", 404);
      }
      throw error;
    }
  }

  private async requireClient(userId: string): Promise<ClientProfile> {
    const client = await this.repository.findProfileByUserId(userId);
    if (!client) {
      throw new AuthError("No encontramos tu perfil de cliente.", 403);
    }
    return client;
  }
}
