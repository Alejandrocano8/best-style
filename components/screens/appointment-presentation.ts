import type { AppointmentStatus } from "@/domain/entities/appointment";

const STATUS_PRESENTATION: Record<AppointmentStatus, { label: string; className: string }> = {
  confirmed: { label: "Confirmada", className: "chip-confirmed" },
  pending: { label: "Pendiente", className: "chip-pending" },
  completed: { label: "Realizada", className: "chip-done" },
  cancelled: { label: "Cancelada", className: "chip-cancelled" },
};

export function getAppointmentStatusPresentation(status: AppointmentStatus) {
  return STATUS_PRESENTATION[status];
}
