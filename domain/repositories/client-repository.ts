import type { AppointmentStatus } from "@/domain/entities/appointment";

export type ClientProfile = {
  id: string;
  name: string;
};

export type ClientAppointment = {
  id: string;
  petId: string | null;
  petName: string;
  serviceId: string | null;
  serviceName: string;
  dateIso: string;
  time: string;
  status: AppointmentStatus;
  veterinarian: string | null;
  price: number;
};

export type ClientPetOption = {
  id: string;
  name: string;
  icon: string;
};

export type ClientServiceOption = {
  id: string;
  name: string;
  price: number;
};

export type ScheduleClientAppointmentInput = {
  ownerId: string;
  ownerName: string;
  petId: string | null;
  petName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
};

export interface ClientRepository {
  findProfileByUserId(userId: string): Promise<ClientProfile | null>;
  findPetForClient(petId: string, clientId: string): Promise<ClientPetOption | null>;
  findActiveService(serviceId: string): Promise<ClientServiceOption | null>;
  isSlotTaken(date: string, time: string): Promise<boolean>;
  bookedTimes(date: string): Promise<string[]>;
  createAppointment(input: ScheduleClientAppointmentInput): Promise<void>;
  listAppointments(clientId: string): Promise<ClientAppointment[]>;
  cancelAppointment(id: string, clientId: string): Promise<void>;
}
