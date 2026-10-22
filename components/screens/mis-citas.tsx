import { ClientSidebar } from "@/components/client-sidebar";
import { GotoLink } from "@/components/nav-context";

export function MisCitas() {
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
            <div className="table-toolbar">
              <div className="filter-pills">
                <span className="filter-pill active">Todas</span>
                <span className="filter-pill">Pendientes</span>
                <span className="filter-pill">Confirmadas</span>
                <span className="filter-pill">Realizadas</span>
                <span className="filter-pill">Canceladas</span>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mascota</th>
                  <th>Servicio</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Rocky</td>
                  <td>Corte de pelo</td>
                  <td>18 sep 2026</td>
                  <td>11:00 am</td>
                  <td>
                    <span className="chip chip-confirmed">Confirmada</span>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm">Cancelar</button>
                  </td>
                </tr>
                <tr>
                  <td>Mishi</td>
                  <td>Baño</td>
                  <td>22 sep 2026</td>
                  <td>3:30 pm</td>
                  <td>
                    <span className="chip chip-pending">Pendiente</span>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm">Cancelar</button>
                  </td>
                </tr>
                <tr>
                  <td>Rocky</td>
                  <td>Baño</td>
                  <td>02 ago 2026</td>
                  <td>10:00 am</td>
                  <td>
                    <span className="chip chip-done">Realizada</span>
                  </td>
                  <td>
                    <button className="icon-btn">⋯</button>
                  </td>
                </tr>
                <tr>
                  <td>Mishi</td>
                  <td>Limpieza de oídos</td>
                  <td>28 jul 2026</td>
                  <td>9:00 am</td>
                  <td>
                    <span className="chip chip-cancelled">Cancelada</span>
                  </td>
                  <td>
                    <button className="icon-btn">⋯</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
