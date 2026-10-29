import { AdminSidebar } from "@/components/admin-sidebar";
import { GotoLink } from "@/components/nav-context";
import type { PrototypeData } from "@/domain/entities/prototype-data";
import { getAppointmentStatusPresentation } from "@/components/screens/appointment-presentation";

export function DashboardAdmin({ data }: { data: PrototypeData }) {
  const todayAppointments = data.appointments.slice(0, 3);

  return (
    <section className="screen active" id="dashboard-admin">
      <div className="app-shell">
        <AdminSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Panel administrativo</h1>
              <div className="sub">Visión general de la operación de hoy.</div>
            </div>
            <input className="search-input" placeholder="Buscar cliente, mascota o cita..." />
          </div>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">Citas de hoy</div>
              <div className="kpi-value">{data.adminDashboard.todayAppointments}</div>
              <div className="kpi-delta">
                +{data.adminDashboard.appointmentsComparedToYesterday} vs. ayer
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Citas pendientes</div>
              <div className="kpi-value">{data.adminDashboard.pendingAppointments}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Clientes activos</div>
              <div className="kpi-value">{data.adminDashboard.activeClients}</div>
              <div className="kpi-delta">
                +{data.adminDashboard.newClientsThisMonth} este mes
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Cancelaciones (mes)</div>
              <div className="kpi-value">{data.adminDashboard.cancellationsThisMonth}</div>
              <div className="kpi-delta down">↑ vs. mes anterior</div>
            </div>
          </div>
          <div className="two-col">
            <div className="panel">
              <div className="panel-head">
                <h3>Agenda de hoy</h3>
                <GotoLink to="gestion-citas" className="see-all">
                  Ver todas
                </GotoLink>
              </div>
              {todayAppointments.map((appointment) => {
                const status = getAppointmentStatusPresentation(appointment.status);
                return (
                  <div className="appt-row" key={appointment.id}>
                    <div className="appt-time">{appointment.time}</div>
                    <div className="appt-info">
                      <div className="name">
                        {appointment.petName} — {appointment.serviceName}
                      </div>
                      <div className="meta">Cliente: {appointment.ownerName}</div>
                    </div>
                    <span className={`chip ${status.className}`}>{status.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="panel">
              <div className="panel-head">
                <h3>Servicios más solicitados</h3>
              </div>
              {data.services.map((service) => (
                <div className="appt-row" key={service.id}>
                  <div className="appt-info">
                    <div className="name">{service.name}</div>
                  </div>
                  <b>{service.requestPercentage}%</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
