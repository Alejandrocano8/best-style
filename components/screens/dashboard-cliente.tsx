"use client";

import { ClientSidebar } from "@/components/client-sidebar";
import { GotoLink, useAuth } from "@/components/nav-context";
import type { PrototypeData } from "@/domain/entities/prototype-data";
import { getAppointmentStatusPresentation } from "@/components/screens/appointment-presentation";

function todayIso(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function DashboardCliente({ data }: { data: PrototypeData }) {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "Cliente";

  const myAppointments = data.appointments.filter(
    (appointment) => appointment.ownerName === user?.name,
  );
  const upcomingAppointments = myAppointments
    .filter(
      (appointment) =>
        ["pending", "confirmed"].includes(appointment.status) &&
        appointment.dateIso >= todayIso(),
    )
    .sort((a, b) => a.dateIso.localeCompare(b.dateIso));
  const nextAppointment = upcomingAppointments[0];
  const myPets = data.pets.filter((pet) => pet.ownerName === user?.name);

  const completedAppointments = myAppointments.filter(
    (appointment) => appointment.status === "completed",
  ).length;
  const pendingAppointments = upcomingAppointments.length;

  return (
    <section className="screen active" id="dashboard-cliente">
      <div className="app-shell">
        <ClientSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Hola, {firstName} 👋</h1>
              <div className="sub">Esto es lo que tienes programado esta semana.</div>
            </div>
            <GotoLink to="agendar-cita" className="btn btn-primary btn-sm">
              + Nueva cita
            </GotoLink>
          </div>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">Mascotas registradas</div>
              <div className="kpi-value">{myPets.length}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Próxima cita</div>
              <div className="kpi-value">
                {nextAppointment ? nextAppointment.date.split(" ").slice(0, 2).join(" ") : "—"}
              </div>
              <div className="kpi-delta">
                {nextAppointment
                  ? `${nextAppointment.serviceName} · ${nextAppointment.petName}`
                  : "Agenda tu próxima cita"}
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Citas realizadas</div>
              <div className="kpi-value">{completedAppointments}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Citas pendientes</div>
              <div className="kpi-value">{pendingAppointments}</div>
            </div>
          </div>
          <div className="two-col">
            <div className="panel">
              <div className="panel-head">
                <h3>Próximas citas</h3>
                <GotoLink to="mis-citas" className="see-all">
                  Ver todas
                </GotoLink>
              </div>
              {upcomingAppointments.length === 0 ? (
                <div className="table-empty">No tienes citas programadas.</div>
              ) : null}
              {upcomingAppointments.map((appointment) => {
                const status = getAppointmentStatusPresentation(appointment.status);
                return (
                  <div className="appt-row" key={appointment.id}>
                    <div className="appt-time">
                      {appointment.date.split(" ")[0]} {appointment.date.split(" ")[1]}
                      <br />
                      {appointment.time}
                    </div>
                    <div className="appt-info">
                      <div className="name">
                        {appointment.petName} — {appointment.serviceName}
                      </div>
                      <div className="meta">
                        Con: Vet. {appointment.veterinarian}
                      </div>
                    </div>
                    <span className={`chip ${status.className}`}>{status.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="panel">
              <div className="panel-head">
                <h3>Mis mascotas</h3>
                <GotoLink to="mascotas" className="see-all">
                  Ver todas
                </GotoLink>
              </div>
              {myPets.length === 0 ? (
                <div className="table-empty">Aún no tienes mascotas registradas.</div>
              ) : null}
              {myPets.map((pet) => (
                <div className="appt-row" key={pet.id}>
                  <div className="appt-info">
                    <div className="name">
                      {pet.icon} {pet.name}
                    </div>
                    <div className="meta">
                      {pet.breed} · {pet.ageYears} {pet.ageYears === 1 ? "año" : "años"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
