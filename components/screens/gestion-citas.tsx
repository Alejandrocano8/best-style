"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminModal } from "@/components/admin-modal";
import { AdminSidebar } from "@/components/admin-sidebar";
import { getAppointmentStatusPresentation } from "@/components/screens/appointment-presentation";
import type { Appointment, AppointmentStatus } from "@/domain/entities/appointment";
import type { PrototypeData } from "@/domain/entities/prototype-data";

const STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmada" },
  { value: "completed", label: "Realizada" },
  { value: "cancelled", label: "Cancelada" },
];

const FILTERS = [
  { id: "todas", label: "Todas" },
  { id: "pending", label: "Pendientes" },
  { id: "confirmed", label: "Confirmadas" },
  { id: "completed", label: "Realizadas" },
  { id: "cancelled", label: "Canceladas" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

async function sendRequest(url: string, method: string, body: unknown) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = (await response.json().catch(() => ({}))) as { error?: string };

  if (!response.ok) {
    throw new Error(result.error ?? "No pudimos completar la operación.");
  }
}

function todayIso() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function dateToIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function appointmentDateToIso(value: string) {
  const isoDate = value.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoDate) return isoDate[1];

  const localizedDate = value.toLowerCase().match(/^(\d{1,2})\s+([a-záéíóú]+)\s+(\d{4})$/);
  if (!localizedDate) return null;

  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const month = months.indexOf(localizedDate[2].slice(0, 3));
  if (month < 0) return null;

  return `${localizedDate[3]}-${String(month + 1).padStart(2, "0")}-${localizedDate[1].padStart(2, "0")}`;
}

function NewAppointmentForm({
  data,
  onClose,
  onSaved,
}: {
  data: PrototypeData;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [ownerId, setOwnerId] = useState(data.clients[0]?.id ?? "");
  const [petId, setPetId] = useState("");
  const [petNameManual, setPetNameManual] = useState("");
  const [serviceId, setServiceId] = useState(
    data.services.find((service) => service.isActive)?.id ?? data.services[0]?.id ?? "",
  );
  const [date, setDate] = useState(todayIso());
  const [time, setTime] = useState("09:00");
  const [status, setStatus] = useState<AppointmentStatus>("pending");
  const [veterinarianId, setVeterinarianId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const owner = data.clients.find((client) => client.id === ownerId);
  const ownerPets = data.pets.filter((pet) => pet.ownerId === ownerId);
  const service = data.services.find((item) => item.id === serviceId);
  const veterinarians = data.users.filter(
    (user) => user.role === "Veterinario" || user.role === "Administrador",
  );
  const veterinarian = veterinarians.find((user) => user.id === veterinarianId);

  const selectedPet = ownerPets.find((pet) => pet.id === petId);
  const petName = selectedPet?.name ?? petNameManual.trim();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      if (!owner || !service) {
        throw new Error("Selecciona un cliente y un servicio.");
      }

      if (!petName) {
        throw new Error("Indica la mascota de la cita.");
      }

      await sendRequest("/api/admin/appointments", "POST", {
        ownerId: owner.id,
        ownerName: owner.name,
        petId: selectedPet?.id ?? null,
        petName,
        serviceId: service.id,
        serviceName: service.name,
        date,
        time,
        status,
        veterinarianId: veterinarian?.id ?? null,
        veterinarian: veterinarian?.name ?? null,
      });

      onSaved();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ocurrió un error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      title="Nueva cita"
      subtitle="Agenda una cita para un cliente registrado."
      onClose={onClose}
      width={520}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="appointment-client">Cliente</label>
          <select
            id="appointment-client"
            value={ownerId}
            onChange={(event) => {
              setOwnerId(event.target.value);
              setPetId("");
              setPetNameManual("");
            }}
          >
            {data.clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="appointment-pet">Mascota</label>
          {ownerPets.length > 0 ? (
            <select
              id="appointment-pet"
              value={petId}
              onChange={(event) => setPetId(event.target.value)}
            >
              <option value="">Selecciona una mascota</option>
              {ownerPets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.icon} {pet.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="appointment-pet"
              type="text"
              placeholder="Nombre de la mascota"
              value={petNameManual}
              onChange={(event) => setPetNameManual(event.target.value)}
            />
          )}
        </div>

        <div className="field">
          <label htmlFor="appointment-service">Servicio</label>
          <select
            id="appointment-service"
            value={serviceId}
            onChange={(event) => setServiceId(event.target.value)}
          >
            {data.services.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · ${item.price.toLocaleString("es-CO")}
              </option>
            ))}
          </select>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="appointment-date">Fecha</label>
            <input
              id="appointment-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="appointment-time">Hora</label>
            <input
              id="appointment-time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="appointment-status">Estado</label>
            <select
              id="appointment-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as AppointmentStatus)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="appointment-vet">Veterinario</label>
            <select
              id="appointment-vet"
              value={veterinarianId}
              onChange={(event) => setVeterinarianId(event.target.value)}
            >
              <option value="">Sin asignar</option>
              {veterinarians.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <div className="auth-error" role="alert">
            {error}
          </div>
        ) : null}

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
            {saving ? "Guardando..." : "Agendar cita"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}

function EditAppointmentForm({
  appointment,
  data,
  onClose,
  onSaved,
}: {
  appointment: Appointment;
  data: PrototypeData;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [status, setStatus] = useState<AppointmentStatus>(appointment.status);
  const [veterinarianId, setVeterinarianId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const veterinarians = data.users.filter(
    (user) => user.role === "Veterinario" || user.role === "Administrador",
  );
  const veterinarian = veterinarians.find((user) => user.id === veterinarianId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      await sendRequest(`/api/admin/appointments/${appointment.id}`, "PATCH", {
        status,
        ...(veterinarian
          ? { veterinarianId: veterinarian.id, veterinarian: veterinarian.name }
          : {}),
      });

      onSaved();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ocurrió un error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      title="Editar cita"
      subtitle={`${appointment.petName} · ${appointment.ownerName}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="edit-appointment-status">Estado</label>
          <select
            id="edit-appointment-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as AppointmentStatus)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="edit-appointment-vet">Veterinario</label>
          <select
            id="edit-appointment-vet"
            value={veterinarianId}
            onChange={(event) => setVeterinarianId(event.target.value)}
          >
            <option value="">Mantener actual{appointment.veterinarian ? ` (${appointment.veterinarian})` : ""}</option>
            {veterinarians.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <div className="auth-error" role="alert">
            {error}
          </div>
        ) : null}

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}

export function GestionCitas({ data }: { data: PrototypeData }) {
  const router = useRouter();
  const [today, setToday] = useState(todayIso);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("todas");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => setToday(todayIso()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const weekDays = useMemo(() => {
    const [year, month, day] = today.split("-").map(Number);
    const currentDate = new Date(year, month - 1, day);
    const monday = new Date(year, month - 1, day - ((currentDate.getDay() + 6) % 7));

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      const isoDate = dateToIso(date);
      const count = data.appointments.filter(
        (appointment) => appointmentDateToIso(appointment.date) === isoDate,
      ).length;

      return { date, isoDate, count };
    });
  }, [data.appointments, today]);

  const weekRange = `${new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(weekDays[0].date)} al ${new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(weekDays[6].date)}`;

  const appointments = useMemo(() => {
    const term = query.trim().toLowerCase();

    return data.appointments.filter((appointment) => {
      const matchesFilter = filter === "todas" || appointment.status === filter;
      const matchesQuery =
        !term ||
        `${appointment.ownerName} ${appointment.petName} ${appointment.serviceName}`
          .toLowerCase()
          .includes(term);
      return matchesFilter && matchesQuery;
    });
  }, [data.appointments, filter, query]);

  function handleSaved() {
    setCreating(false);
    setEditing(null);
    router.refresh();
  }

  return (
    <section className="screen active" id="gestion-citas">
      <div className="app-shell">
        <AdminSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Gestión de citas</h1>
              <div className="sub">Consulta y organiza la agenda de la clínica.</div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn btn-ghost btn-sm">📅 Vista calendario</button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setCreating(true)}
              >
                + Nueva cita
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Semana del {weekRange}</h3>
            </div>
            <div className="cal-grid">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                <div className="cal-day-head" key={day}>
                  {day}
                </div>
              ))}
              {weekDays.map(({ date, isoDate, count }) => (
                <div className={`cal-cell${isoDate === today ? " today" : ""}`} key={isoDate}>
                  {date.getDate()}
                  {count > 0 ? (
                    <>
                      <br />
                      <span className="cal-dot">
                        {count} {count === 1 ? "cita" : "citas"}
                      </span>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

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
              <input
                className="search-input"
                placeholder="Buscar por cliente o mascota..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Mascota</th>
                  <th>Servicio</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => {
                  const status = getAppointmentStatusPresentation(appointment.status);
                  return (
                    <tr key={appointment.id}>
                      <td>{appointment.ownerName}</td>
                      <td>{appointment.petName}</td>
                      <td>{appointment.serviceName}</td>
                      <td>{appointment.date.split(" ").slice(0, 2).join(" ")}</td>
                      <td>{appointment.time}</td>
                      <td>
                        <span className={`chip ${status.className}`}>{status.label}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => setEditing(appointment)}
                          aria-label="Editar cita"
                        >
                          ✎
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {appointments.length === 0 ? (
              <div className="table-empty">No encontramos citas con esos filtros.</div>
            ) : null}
          </div>
        </div>
      </div>

      {creating ? (
        <NewAppointmentForm
          data={data}
          onClose={() => setCreating(false)}
          onSaved={handleSaved}
        />
      ) : null}

      {editing ? (
        <EditAppointmentForm
          appointment={editing}
          data={data}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      ) : null}
    </section>
  );
}
