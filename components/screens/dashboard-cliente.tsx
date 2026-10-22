import { ClientSidebar } from "@/components/client-sidebar";
import { GotoLink } from "@/components/nav-context";

export function DashboardCliente() {
  return (
    <section className="screen active" id="dashboard-cliente">
      <div className="app-shell">
        <ClientSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Hola, Laura 👋</h1>
              <div className="sub">Esto es lo que tienes programado esta semana.</div>
            </div>
            <GotoLink to="agendar-cita" className="btn btn-primary btn-sm">
              + Nueva cita
            </GotoLink>
          </div>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">Mascotas registradas</div>
              <div className="kpi-value">2</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Próxima cita</div>
              <div className="kpi-value">Vie 18</div>
              <div className="kpi-delta">Corte de pelo · Rocky</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Citas realizadas</div>
              <div className="kpi-value">7</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Citas pendientes</div>
              <div className="kpi-value">1</div>
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
              <div className="appt-row">
                <div className="appt-time">
                  Vie 18
                  <br />
                  10:00
                </div>
                <div className="appt-info">
                  <div className="name">Rocky — Corte de pelo</div>
                  <div className="meta">Con: Vet. Ana Ríos</div>
                </div>
                <span className="chip chip-confirmed">Confirmada</span>
              </div>
              <div className="appt-row">
                <div className="appt-time">
                  Mar 22
                  <br />
                  15:30
                </div>
                <div className="appt-info">
                  <div className="name">Mishi — Baño</div>
                  <div className="meta">Con: Vet. Carlos Peña</div>
                </div>
                <span className="chip chip-pending">Pendiente</span>
              </div>
            </div>
            <div className="panel">
              <div className="panel-head">
                <h3>Mis mascotas</h3>
                <GotoLink to="mascotas" className="see-all">
                  Ver todas
                </GotoLink>
              </div>
              <div className="appt-row">
                <div className="appt-info">
                  <div className="name">🐕 Rocky</div>
                  <div className="meta">Labrador · 3 años</div>
                </div>
              </div>
              <div className="appt-row">
                <div className="appt-info">
                  <div className="name">🐈 Mishi</div>
                  <div className="meta">Gato criollo · 1 año</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
