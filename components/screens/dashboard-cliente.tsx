"use client";

import { ClientSidebar } from "@/components/client-sidebar";
import { GotoLink, useAuth } from "@/components/nav-context";
import type { PrototypeData } from "@/domain/entities/prototype-data";
import { getAppointmentStatusPresentation } from "@/components/screens/appointment-presentation";
import {
  CalendarIcon,
  CalendarPlusIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  PawIcon,
  PetIcon,
  PlusCircleIcon,
} from "@/components/icons";

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
          <div className="dash-hero-banner">
            <div>
              <span className="dash-eyebrow">Panel del propietario</span>
              <h1>Hola, {firstName}</h1>
              <p className="sub">Esto es lo que tienes programado esta semana para el cuidado de tus mascotas.</p>
            </div>
            <div className="dash-hero-actions">
              <GotoLink to="registro-mascota" className="btn btn-sm dash-btn-outline">
                <PawIcon size={15} />
                <span>Registrar mascota</span>
              </GotoLink>
              <GotoLink to="agendar-cita" className="btn btn-sm dash-btn-light">
                <CalendarPlusIcon size={15} />
                <span>Nueva cita</span>
              </GotoLink>
            </div>
          </div>

          <div className="kpi-grid dash-kpi-grid">
            <div className="kpi-card dash-kpi-card">
              <div className="dash-kpi-top">
                <div className="kpi-label">Mascotas registradas</div>
                <div className="dash-kpi-ic">
                  <PawIcon size={17} />
                </div>
              </div>
              <div className="kpi-value">{myPets.length}</div>
              <div className="dash-kpi-sub">
                {myPets.length === 0 ? "Registra tu primera mascota" : "Activas en tu perfil"}
              </div>
            </div>

            <div className="kpi-card dash-kpi-card dash-kpi-card--highlight">
              <div className="dash-kpi-top">
                <div className="kpi-label">Próxima cita</div>
                <div className="dash-kpi-ic">
                  <CalendarIcon size={17} />
                </div>
              </div>
              <div className="kpi-value">
                {nextAppointment ? nextAppointment.date.split(" ").slice(0, 2).join(" ") : "—"}
              </div>
              <div className="kpi-delta">
                {nextAppointment ? (
                  `${nextAppointment.serviceName} · ${nextAppointment.petName}`
                ) : (
                  <GotoLink to="agendar-cita" className="dash-kpi-link">
                    <span>Agenda tu próxima cita</span>
                    <ChevronRightIcon size={13} />
                  </GotoLink>
                )}
              </div>
            </div>

            <div className="kpi-card dash-kpi-card">
              <div className="dash-kpi-top">
                <div className="kpi-label">Citas realizadas</div>
                <div className="dash-kpi-ic dash-kpi-ic--success">
                  <CheckIcon size={17} />
                </div>
              </div>
              <div className="kpi-value">{completedAppointments}</div>
              <div className="dash-kpi-sub">Atenciones completadas</div>
            </div>

            <div className="kpi-card dash-kpi-card">
              <div className="dash-kpi-top">
                <div className="kpi-label">Citas pendientes</div>
                <div className="dash-kpi-ic dash-kpi-ic--accent">
                  <ClockIcon size={17} />
                </div>
              </div>
              <div className="kpi-value">{pendingAppointments}</div>
              <div className="dash-kpi-sub">Por confirmar o asistir</div>
            </div>
          </div>

          <div className="two-col">
            <div className="panel dash-panel">
              <div className="panel-head">
                <div className="dash-panel-title">
                  <span className="dash-panel-ic">
                    <CalendarIcon size={16} />
                  </span>
                  <h3>Próximas citas</h3>
                </div>
                <GotoLink to="mis-citas" className="see-all dash-see-all">
                  <span>Ver todas</span>
                  <ChevronRightIcon size={14} />
                </GotoLink>
              </div>
              {upcomingAppointments.length === 0 ? (
                <div className="dash-empty">
                  <div className="dash-empty-ic">
                    <CalendarPlusIcon size={24} />
                  </div>
                  <div className="dash-empty-title">No tienes citas programadas</div>
                  <p className="dash-empty-desc">
                    Reserva un turno de baño, corte o cuidado para consentir a tu mascota.
                  </p>
                  <GotoLink to="agendar-cita" className="btn btn-primary btn-sm">
                    Agendar primera cita
                  </GotoLink>
                </div>
              ) : null}
              {upcomingAppointments.map((appointment) => {
                const status = getAppointmentStatusPresentation(appointment.status);
                return (
                  <div className="appt-row dash-row" key={appointment.id}>
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

            <div className="panel dash-panel">
              <div className="panel-head">
                <div className="dash-panel-title">
                  <span className="dash-panel-ic">
                    <PawIcon size={16} />
                  </span>
                  <h3>Mis mascotas</h3>
                </div>
                <GotoLink to="mascotas" className="see-all dash-see-all">
                  <span>Ver todas</span>
                  <ChevronRightIcon size={14} />
                </GotoLink>
              </div>
              {myPets.length === 0 ? (
                <div className="dash-empty">
                  <div className="dash-empty-ic">
                    <PlusCircleIcon size={24} />
                  </div>
                  <div className="dash-empty-title">Aún no tienes mascotas registradas</div>
                  <p className="dash-empty-desc">
                    Agrega a tu mascota para llevar su historial y agendar más rápido.
                  </p>
                  <GotoLink to="registro-mascota" className="btn btn-ghost btn-sm">
                    Registrar mascota
                  </GotoLink>
                </div>
              ) : null}
              {myPets.map((pet) => (
                <div className="appt-row dash-row" key={pet.id}>
                  <div
                    className="row-avatar"
                    style={{ background: "var(--pine-pale)", color: "var(--pine-dark)" }}
                  >
                    <PetIcon species={pet.species} icon={pet.icon} size={16} />
                  </div>
                  <div className="appt-info">
                    <div className="name">{pet.name}</div>
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
