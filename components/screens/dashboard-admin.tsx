import { AdminSidebar } from "@/components/admin-sidebar";
import { GotoLink } from "@/components/nav-context";

export function DashboardAdmin() {
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
              <div className="kpi-value">12</div>
              <div className="kpi-delta">+3 vs. ayer</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Citas pendientes</div>
              <div className="kpi-value">5</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Clientes activos</div>
              <div className="kpi-value">184</div>
              <div className="kpi-delta">+6 este mes</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Cancelaciones (mes)</div>
              <div className="kpi-value">7</div>
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
              <div className="appt-row">
                <div className="appt-time">9:00</div>
                <div className="appt-info">
                  <div className="name">Rocky — Baño</div>
                  <div className="meta">Cliente: Laura Gómez</div>
                </div>
                <span className="chip chip-confirmed">Confirmada</span>
              </div>
              <div className="appt-row">
                <div className="appt-time">10:30</div>
                <div className="appt-info">
                  <div className="name">Toby — Corte de pelo</div>
                  <div className="meta">Cliente: Andrés Ruiz</div>
                </div>
                <span className="chip chip-pending">Pendiente</span>
              </div>
              <div className="appt-row">
                <div className="appt-time">1:00</div>
                <div className="appt-info">
                  <div className="name">Nina — Limpieza de oídos</div>
                  <div className="meta">Cliente: Marcela Ospina</div>
                </div>
                <span className="chip chip-confirmed">Confirmada</span>
              </div>
            </div>
            <div className="panel">
              <div className="panel-head">
                <h3>Servicios más solicitados</h3>
              </div>
              <div className="appt-row">
                <div className="appt-info">
                  <div className="name">Baño</div>
                </div>
                <b>42%</b>
              </div>
              <div className="appt-row">
                <div className="appt-info">
                  <div className="name">Corte de pelo</div>
                </div>
                <b>38%</b>
              </div>
              <div className="appt-row">
                <div className="appt-info">
                  <div className="name">Limpieza de oídos</div>
                </div>
                <b>20%</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
