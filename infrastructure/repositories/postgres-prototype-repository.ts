import type { Appointment, AppointmentStatus } from "@/domain/entities/appointment";
import type { Client } from "@/domain/entities/client";
import type { Pet } from "@/domain/entities/pet";
import type { PrototypeData } from "@/domain/entities/prototype-data";
import type { Service } from "@/domain/entities/service";
import type { User, UserRole } from "@/domain/entities/user";
import type { PrototypeRepository } from "@/domain/repositories/prototype-repository";
import { pool } from "@/infrastructure/db/pg-pool";

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatDate(isoDate: string | null): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function formatTime(time: string | null): string {
  if (!time) return "";
  const [hourText, minute] = time.split(":");
  const hour24 = Number(hourText);
  const suffix = hour24 >= 12 ? "pm" : "am";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute} ${suffix}`;
}

type UserRow = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  is_active: boolean;
};

type ClientRow = {
  id: string;
  name: string;
  initials: string;
  national_id: string | null;
  phone: string | null;
  pet_count: number;
  last_appointment: string | null;
};

type PetRow = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string | null;
  age_years: number | null;
  owner_name: string | null;
  icon: string | null;
};

type ServiceRow = {
  id: string;
  name: string;
  icon: string | null;
  duration_minutes: number;
  price: string;
  is_active: boolean;
  request_percentage: string | null;
};

type AppointmentRow = {
  id: string;
  owner_name: string;
  pet_name: string;
  service_name: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  veterinarian: string | null;
};

type DashboardRow = {
  today_appointments: string;
  yesterday_appointments: string;
  pending_appointments: string;
  active_clients: string;
  new_clients_this_month: string;
  cancellations_this_month: string;
  completed_appointments: string;
  client_pending_appointments: string;
};

export class PostgresPrototypeRepository implements PrototypeRepository {
  async getData(): Promise<PrototypeData> {
    const [usersResult, clientsResult, petsResult, servicesResult, appointmentsResult, dashboardResult] =
      await Promise.all([
        pool.query<UserRow>(
          "SELECT id, name, initials, email, role, is_active FROM users ORDER BY created_at",
        ),
        pool.query<ClientRow>(
          `SELECT id, name, initials, national_id, phone, pet_count,
                  to_char(last_appointment, 'YYYY-MM-DD') AS last_appointment
           FROM clients ORDER BY created_at`,
        ),
        pool.query<PetRow>(
          "SELECT id, name, species, breed, sex, age_years, owner_name, icon FROM pets ORDER BY created_at",
        ),
        pool.query<ServiceRow>(
          "SELECT id, name, icon, duration_minutes, price, is_active, request_percentage FROM services ORDER BY created_at",
        ),
        pool.query<AppointmentRow>(
          `SELECT id, owner_name, pet_name, service_name,
                  to_char(appointment_date, 'YYYY-MM-DD') AS date,
                  to_char(appointment_time, 'HH24:MI') AS time,
                  status, veterinarian
           FROM appointments ORDER BY appointment_date, appointment_time`,
        ),
        pool.query<DashboardRow>(
          `SELECT
             (SELECT count(*) FROM appointments WHERE appointment_date = CURRENT_DATE) AS today_appointments,
             (SELECT count(*) FROM appointments WHERE appointment_date = CURRENT_DATE - 1) AS yesterday_appointments,
             (SELECT count(*) FROM appointments WHERE status = 'pending') AS pending_appointments,
             (SELECT count(*) FROM clients) AS active_clients,
             (SELECT count(*) FROM clients WHERE created_at >= date_trunc('month', CURRENT_DATE)) AS new_clients_this_month,
             (SELECT count(*) FROM appointments
               WHERE status = 'cancelled' AND appointment_date >= date_trunc('month', CURRENT_DATE)) AS cancellations_this_month,
             (SELECT count(*) FROM appointments WHERE status = 'completed') AS completed_appointments,
             (SELECT count(*) FROM appointments WHERE status = 'pending') AS client_pending_appointments`,
        ),
      ]);

    const users: User[] = usersResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      initials: row.initials,
      email: row.email,
      role: row.role,
      isActive: row.is_active,
    }));

    const clients: Client[] = clientsResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      initials: row.initials,
      nationalId: row.national_id ?? "",
      phone: row.phone ?? "",
      petCount: row.pet_count,
      lastAppointment: formatDate(row.last_appointment),
    }));

    const pets: Pet[] = petsResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      species: row.species,
      breed: row.breed ?? "",
      sex: row.sex ?? "",
      ageYears: row.age_years ?? 0,
      ownerName: row.owner_name ?? "",
      icon: row.icon ?? "",
    }));

    const services: Service[] = servicesResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      icon: row.icon ?? "",
      durationMinutes: row.duration_minutes,
      price: Number(row.price),
      isActive: row.is_active,
      requestPercentage: Number(row.request_percentage ?? 0),
    }));

    const appointments: Appointment[] = appointmentsResult.rows.map((row) => ({
      id: row.id,
      ownerName: row.owner_name,
      petName: row.pet_name,
      serviceName: row.service_name,
      date: formatDate(row.date),
      time: formatTime(row.time),
      status: row.status,
      veterinarian: row.veterinarian ?? undefined,
    }));

    const dashboard = dashboardResult.rows[0];

    return {
      appointments,
      clients,
      pets,
      services,
      users,
      clientDashboard: {
        completedAppointments: Number(dashboard.completed_appointments),
        pendingAppointments: Number(dashboard.client_pending_appointments),
      },
      adminDashboard: {
        todayAppointments: Number(dashboard.today_appointments),
        appointmentsComparedToYesterday:
          Number(dashboard.today_appointments) - Number(dashboard.yesterday_appointments),
        pendingAppointments: Number(dashboard.pending_appointments),
        activeClients: Number(dashboard.active_clients),
        newClientsThisMonth: Number(dashboard.new_clients_this_month),
        cancellationsThisMonth: Number(dashboard.cancellations_this_month),
      },
    };
  }
}
