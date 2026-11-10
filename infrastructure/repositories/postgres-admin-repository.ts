import type { User, UserRole } from "@/domain/entities/user";
import type {
  AdminRepository,
  CreateAppointmentInput,
  CreateClientInput,
  CreateServiceInput,
  CreateUserInput,
  UpdateAppointmentInput,
  UpdateServiceInput,
  UpdateUserInput,
} from "@/domain/repositories/admin-repository";
import { pool } from "@/infrastructure/db/pg-pool";

type UserRow = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  is_active: boolean;
};

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    email: row.email,
    role: row.role,
    isActive: row.is_active,
  };
}

export class PostgresAdminRepository implements AdminRepository {
  async createUser(input: CreateUserInput): Promise<User> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query<UserRow>(
        `INSERT INTO users (name, initials, email, role, is_active, password_hash)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, name, initials, email, role, is_active`,
        [
          input.name,
          input.initials,
          input.email,
          input.role,
          input.isActive,
          input.passwordHash,
        ],
      );

      const user = mapUser(result.rows[0]);

      if (input.role === "Cliente") {
        await client.query(
          `INSERT INTO clients (name, initials, phone, pet_count, user_id)
           VALUES ($1, $2, NULL, 0, $3)`,
          [user.name, user.initials, user.id],
        );
      }

      await client.query("COMMIT");
      return user;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query<UserRow>(
        `UPDATE users
         SET name = COALESCE($2, name),
             initials = COALESCE($3, initials),
             email = COALESCE($4, email),
             password_hash = COALESCE($5, password_hash),
             role = COALESCE($6, role),
             is_active = COALESCE($7, is_active),
             updated_at = NOW()
         WHERE id = $1
         RETURNING id, name, initials, email, role, is_active`,
        [
          id,
          input.name ?? null,
          input.initials ?? null,
          input.email ?? null,
          input.passwordHash ?? null,
          input.role ?? null,
          input.isActive ?? null,
        ],
      );

      if (!result.rows[0]) {
        throw new Error("USER_NOT_FOUND");
      }

      if (input.name !== undefined || input.initials !== undefined) {
        await client.query(
          `UPDATE clients
           SET name = COALESCE($2, name),
               initials = COALESCE($3, initials),
               updated_at = NOW()
           WHERE user_id = $1`,
          [id, input.name ?? null, input.initials ?? null],
        );
      }

      await client.query("COMMIT");
      return mapUser(result.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteUser(id: string): Promise<void> {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      throw new Error("USER_NOT_FOUND");
    }
  }

  async createAppointment(input: CreateAppointmentInput): Promise<void> {
    await pool.query(
      `INSERT INTO appointments (
         owner_id, owner_name, pet_id, pet_name, service_id, service_name,
         appointment_date, appointment_time, status, veterinarian_id, veterinarian
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        input.ownerId,
        input.ownerName,
        input.petId,
        input.petName,
        input.serviceId,
        input.serviceName,
        input.date,
        input.time,
        input.status,
        input.veterinarianId,
        input.veterinarian,
      ],
    );
  }

  async updateAppointment(id: string, input: UpdateAppointmentInput): Promise<void> {
    const result = await pool.query(
      `UPDATE appointments
       SET status = COALESCE($2, status),
           appointment_date = COALESCE($3::date, appointment_date),
           appointment_time = COALESCE($4::time, appointment_time),
           veterinarian_id = COALESCE($5, veterinarian_id),
           veterinarian = COALESCE($6, veterinarian),
           updated_at = NOW()
       WHERE id = $1`,
      [
        id,
        input.status ?? null,
        input.date ?? null,
        input.time ?? null,
        input.veterinarianId ?? null,
        input.veterinarian ?? null,
      ],
    );

    if (result.rowCount === 0) {
      throw new Error("APPOINTMENT_NOT_FOUND");
    }
  }

  async createService(input: CreateServiceInput): Promise<void> {
    await pool.query(
      `INSERT INTO services (name, icon, duration_minutes, price, is_active)
       VALUES ($1, $2, $3, $4, $5)`,
      [input.name, input.icon, input.durationMinutes, input.price, input.isActive],
    );
  }

  async updateService(id: string, input: UpdateServiceInput): Promise<void> {
    const result = await pool.query(
      `UPDATE services
       SET name = COALESCE($2, name),
           icon = COALESCE($3, icon),
           duration_minutes = COALESCE($4, duration_minutes),
           price = COALESCE($5, price),
           is_active = COALESCE($6, is_active),
           updated_at = NOW()
       WHERE id = $1`,
      [
        id,
        input.name ?? null,
        input.icon ?? null,
        input.durationMinutes ?? null,
        input.price ?? null,
        input.isActive ?? null,
      ],
    );

    if (result.rowCount === 0) {
      throw new Error("SERVICE_NOT_FOUND");
    }
  }

  async createClient(input: CreateClientInput): Promise<void> {
    await pool.query(
      `INSERT INTO clients (name, initials, national_id, phone, pet_count)
       VALUES ($1, $2, $3, $4, 0)`,
      [input.name, input.initials, input.nationalId, input.phone],
    );
  }
}
