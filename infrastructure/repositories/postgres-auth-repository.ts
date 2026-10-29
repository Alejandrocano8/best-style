import type { AuthenticatedUser } from "@/domain/entities/auth-user";
import type { UserRole } from "@/domain/entities/user";
import type {
  AuthRepository,
  AuthUserRecord,
  CreateClientAccountInput,
} from "@/domain/repositories/auth-repository";
import { pool } from "@/infrastructure/db/pg-pool";

type AuthUserRow = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  password_hash: string | null;
};

export class PostgresAuthRepository implements AuthRepository {
  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    const result = await pool.query<AuthUserRow>(
      `SELECT id, name, initials, email, role, is_active, password_hash
       FROM users
       WHERE lower(email) = lower($1)
       LIMIT 1`,
      [email],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      initials: row.initials,
      email: row.email,
      role: row.role,
      isActive: row.is_active,
      passwordHash: row.password_hash,
    };
  }

  async createClientAccount(input: CreateClientAccountInput): Promise<AuthenticatedUser> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const userResult = await client.query<AuthUserRow>(
        `INSERT INTO users (name, initials, email, role, is_active, password_hash)
         VALUES ($1, $2, $3, 'Cliente', true, $4)
         RETURNING id, name, initials, email, role, is_active, password_hash`,
        [input.name, input.initials, input.email, input.passwordHash],
      );

      const user = userResult.rows[0];

      await client.query(
        `INSERT INTO clients (name, initials, phone, pet_count, user_id)
         VALUES ($1, $2, $3, 0, $4)`,
        [input.name, input.initials, input.phone, user.id],
      );

      await client.query("COMMIT");

      return {
        id: user.id,
        name: user.name,
        initials: user.initials,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
