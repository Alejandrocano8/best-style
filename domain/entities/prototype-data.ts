import type { Appointment } from "@/domain/entities/appointment";
import type { Client } from "@/domain/entities/client";
import type { Pet } from "@/domain/entities/pet";
import type { Service } from "@/domain/entities/service";
import type { User } from "@/domain/entities/user";

export type PrototypeData = {
  appointments: Appointment[];
  clients: Client[];
  pets: Pet[];
  services: Service[];
  users: User[];
  clientDashboard: {
    completedAppointments: number;
    pendingAppointments: number;
  };
  adminDashboard: {
    todayAppointments: number;
    appointmentsComparedToYesterday: number;
    pendingAppointments: number;
    activeClients: number;
    newClientsThisMonth: number;
    cancellationsThisMonth: number;
  };
};
