import { AdminSidebar } from "@/components/admin-sidebar";
import type { PrototypeData } from "@/domain/entities/prototype-data";
import { getAppointmentStatusPresentation } from "@/components/screens/appointment-presentation";

export function GestionCitas({ data }: { data: PrototypeData }) {
  const appointments = data.appointments.slice(0, 4);

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
              <button className="btn btn-primary btn-sm">+ Nueva cita</button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Semana del 15 al 21 de septiembre</h3>
            </div>
            <div className="cal-grid">
              <div className="cal-day-head">Lun</div>
              <div className="cal-day-head">Mar</div>
              <div className="cal-day-head">Mié</div>
              <div className="cal-day-head">Jue</div>
              <div className="cal-day-head">Vie</div>
              <div className="cal-day-head">Sáb</div>
              <div className="cal-day-head">Dom</div>
              <div className="cal-cell">
                15
                <br />
                <span className="cal-dot">3 citas</span>
              </div>
              <div className="cal-cell">
                16
                <br />
                <span className="cal-dot">5 citas</span>
              </div>
              <div className="cal-cell today">
                17
                <br />
                <span className="cal-dot">4 citas</span>
              </div>
              <div className="cal-cell">
                18
                <br />
                <span className="cal-dot honey">2 citas</span>
              </div>
              <div className="cal-cell">
                19
                <br />
                <span className="cal-dot">6 citas</span>
              </div>
              <div className="cal-cell">
                20
                <br />
                <span className="cal-dot honey">1 cita</span>
              </div>
              <div className="cal-cell">21</div>
            </div>
          </div>

          <div className="panel">
            <div className="table-toolbar">
              <div className="filter-pills">
                <span className="filter-pill active">Todas</span>
                <span className="filter-pill">Pendientes</span>
                <span className="filter-pill">Confirmadas</span>
                <span className="filter-pill">Realizadas</span>
                <span className="filter-pill">Canceladas</span>
              </div>
              <input className="search-input" placeholder="Buscar por cliente o mascota..." />
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
                        <button className="icon-btn">✎</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
