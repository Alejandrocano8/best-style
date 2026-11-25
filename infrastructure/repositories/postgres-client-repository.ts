import type { AppointmentStatus } from "@/domain/entities/appointment";
import type {
  ClientAppointment,
  ClientPetOption,
  ClientProfile,
  ClientRepository,
  ClientServiceOption,
  ScheduleClientAppointmentInput,
} from "@/domain/repositories/client-repository";
import { pool } from "@/infrastructure/db/pg-pool";

type ProfileRow = {
  id: string;
  name: string;
};

type PetRow = {
  id: string;
  name: string;
  icon: string | null;
};

type ServiceRow = {
  id: string;
  name: string;
  price: string;
};

type AppointmentRow = {
  id: string;
  pet_id: string | null;
  pet_name: string;
  service_id: string | null;
  service_name: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  veterinarian: string | null;
  price: string;
};

export class PostgresClientRepository implements ClientRepository {
  async findProfileByUserId(userId: string): Promise<ClientProfile | null> {
    const result = await pool.query<ProfileRow>(
      "SELECT id, name FROM clients WHERE user_id = $1 LIMIT 1",
      [userId],
    );

    const row = result.rows[0];
    return row ? { id: row.id, name: row.name } : null;
  }

  async findPetForClient(petId: string, clientId: string): Promise<ClientPetOption | null> {
    const result = await pool.query<PetRow>(
      "SELECT id, name, icon FROM pets WHERE id = $1 AND owner_id = $2 LIMIT 1",
      [petId, clientId],
    );

    const row = result.rows[0];
    return row ? { id: row.id, name: row.name, icon: row.icon ?? "" } : null;
  }

  async findActiveService(serviceId: string): Promise<ClientServiceOption | null> {
    const result = await pool.query<ServiceRow>(
      "SELECT id, name, price FROM services WHERE id = $1 AND is_active = true LIMIT 1",
      [serviceId],
    );

    const row = result.rows[0];
    return row ? { id: row.id, name: row.name, price: Number(row.price) } : null;
  }

  async isSlotTaken(date: string, time: string): Promise<boolean> {
    const result = await pool.query<{ total: string }>(
      `SELECT count(*) AS total
       FROM appointments
       WHERE appointment_date = $1
         AND appointment_time = $2::time
         AND status IN ('pending', 'confirmed')`,
      [date, time],
    );

    return Number(result.rows[0].total) > 0;
  }

  async bookedTimes(date: string): Promise<string[]> {
    const result = await pool.query<{ time: string }>(
      `SELECT DISTINCT to_char(appointment_time, 'HH24:MI') AS time
       FROM appointments
       WHERE appointment_date = $1
         AND status IN ('pending', 'confirmed')
       ORDER BY time`,
      [date],
    );

    return result.rows.map((row) => row.time);
  }

  async createAppointment(input: ScheduleClientAppointmentInput): Promise<void> {
    await pool.query(
      `INSERT INTO appointments (
         owner_id, owner_name, pet_id, pet_name, service_id, service_name,
         appointment_date, appointment_time, status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7::date, $8::time, $9)`,
      [
        input.ownerId,
        input.ownerName,
        input.petId,
        input.petName,
        input.serviceId,
        input.serviceName,
        input.date,
        input.time,
        "pending",
      ],
    );
  }

  async listAppointments(clientId: string): Promise<ClientAppointment[]> {
    const result = await pool.query<AppointmentRow>(
      `SELECT a.id, a.pet_id, a.pet_name, a.service_id, a.service_name,
              to_char(a.appointment_date, 'YYYY-MM-DD') AS date,
              to_char(a.appointment_time, 'HH24:MI') AS time,
              a.status, a.veterinarian, COALESCE(s.price, 0) AS price
       FROM appointments a
       LEFT JOIN services s ON s.id = a.service_id
       WHERE a.owner_id = $1
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [clientId],
    );

    return result.rows.map((row) => ({
      id: row.id,
      petId: row.pet_id,
      petName: row.pet_name,
      serviceId: row.service_id,
      serviceName: row.service_name,
      dateIso: row.date,
      time: row.time,
      status: row.status,
      veterinarian: row.veterinarian,
      price: Number(row.price),
    }));
  }

  async cancelAppointment(id: string, clientId: string): Promise<void> {
    const result = await pool.query(
      `UPDATE appointments
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1
         AND owner_id = $2
         AND status IN ('pending', 'confirmed')`,
      [id, clientId],
    );

    if (result.rowCount === 0) {
      throw new Error("APPOINTMENT_NOT_FOUND");
    }
  }
}
