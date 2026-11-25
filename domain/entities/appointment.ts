export type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled";

export type Appointment = {
  id: string;
  ownerName: string;
  petName: string;
  serviceName: string;
  date: string;
  dateIso: string;
  time: string;
  status: AppointmentStatus;
  veterinarian?: string;
};
