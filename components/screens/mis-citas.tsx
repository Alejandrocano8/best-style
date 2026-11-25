"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppointmentCalendar } from "@/components/appointment-calendar";
import { getAppointmentStatusPresentation } from "@/components/screens/appointment-presentation";
import { ClientSidebar } from "@/components/client-sidebar";
import { GotoLink } from "@/components/nav-context";
import type { ClientAppointment } from "@/domain/repositories/client-repository";
import type { PrototypeData } from "@/domain/entities/prototype-data";

const FILTERS = [
  { id: "todas", label: "Todas" },
  { id: "pending", label: "Pendientes" },
  { id: "confirmed", label: "Confirmadas" },
  { id: "completed", label: "Realizadas" },
  { id: "cancelled", label: "Canceladas" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

type AppointmentsResponse = {
  appointments?: ClientAppointment[];
  today?: string;
  error?: string;
};

function formatTime(time: string): string {
  const [hourText, minute] = time.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "pm" : "am";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute} ${suffix}`;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(`${date}T12:00:00`),
  );
}

export function MisCitas({ data }: { data: PrototypeData }) {
  const router = useRouter();
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterId>("todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);

    async function load() {
      try {
        const response = await fetch("/api/client/appointments", { cache: "no-store" });
        const result = (await response.json()) as AppointmentsResponse;

        if (!active) return;
        if (!response.ok) {
          setError(result.error ?? "No pudimos cargar tus citas.");
          return;
        }

        setAppointments(result.appointments ?? []);
        setError(null);
      } catch {
        if (active) setError("No pudimos conectar con el servidor.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [reloadToken]);

  const calendarAppointments = useMemo(
    () =>
      appointments.map((appointment) => ({
        id: appointment.id,
        dateIso: appointment.dateIso,
        time: appointment.time,
        label: `${appointment.petName} · ${appointment.serviceName}`,
        status: appointment.status,
      })),
    [appointments],
  );

  const filtered = useMemo(
    () =>
      appointments.filter((appointment) => {
        const matchesStatus = filter === "todas" || appointment.status === filter;
        const matchesDate = !selectedDate || appointment.dateIso === selectedDate;
        return matchesStatus && matchesDate;
      }),
    [appointments, filter, selectedDate],
  );

  async function handleCancel(appointment: ClientAppointment) {
    if (!window.confirm(`¿Cancelar la cita de ${appointment.petName} del ${formatDate(appointment.dateIso)}?`)) {
      return;
    }

    setError(null);

    try {
      const response = await fetch(`/api/client/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "No pudimos cancelar la cita.");
      }

      setReloadToken((value) => value + 1);
      router.refresh();
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : "Ocurrió un error.");
    }
  }

  return (
    <section className="screen active" id="mis-citas">
      <div className="app-shell">
        <ClientSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Mis citas</h1>
              <div className="sub">Consulta el estado de tus citas o cancélalas si es necesario.</div>
            </div>
            <GotoLink to="agendar-cita" className="btn btn-primary btn-sm">
              + Nueva cita
            </GotoLink>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Calendario de mis citas</h3>
              {selectedDate ? (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSelectedDate(null)}
                >
                  Limpiar fecha
                </button>
              ) : null}
            </div>
            <AppointmentCalendar
              appointments={calendarAppointments}
              month={month}
              onMonthChange={setMonth}
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date);
                if (date) setMonth(date.slice(0, 7));
              }}
            />
          </div>

          {error ? (
            <div className="auth-error" role="alert">
              {error}
            </div>
          ) : null}

          <div className="panel">
            <div className="table-toolbar">
              <div className="filter-pills">
                {FILTERS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`filter-pill${filter === item.id ? " active" : ""}`}
                    onClick={() => setFilter(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <span className="muted-text">{appointments.length} citas registradas</span>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mascota</th>
                  <th>Servicio</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Valor</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((appointment) => {
                  const status = getAppointmentStatusPresentation(appointment.status);
                  const canCancel =
                    appointment.status === "confirmed" || appointment.status === "pending";

                  return (
                    <tr key={appointment.id}>
                      <td>{appointment.petName}</td>
                      <td>{appointment.serviceName}</td>
                      <td>{formatDate(appointment.dateIso)}</td>
                      <td>{formatTime(appointment.time)}</td>
                      <td>${appointment.price.toLocaleString("es-CO")}</td>
                      <td>
                        <span className={`chip ${status.className}`}>{status.label}</span>
                      </td>
                      <td>
                        {canCancel ? (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => void handleCancel(appointment)}
                          >
                            Cancelar
                          </button>
                        ) : (
                          <span className="muted-text">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!loading && filtered.length === 0 ? (
              <div className="table-empty">No tienes citas con esos filtros.</div>
            ) : null}
            {loading ? <div className="table-empty">Cargando tus citas...</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
