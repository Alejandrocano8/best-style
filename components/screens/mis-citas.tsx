import { ClientSidebar } from "@/components/client-sidebar";
import { GotoLink } from "@/components/nav-context";
import type { PrototypeData } from "@/domain/entities/prototype-data";
import { getAppointmentStatusPresentation } from "@/components/screens/appointment-presentation";

export function MisCitas({ data }: { data: PrototypeData }) {
  const appointments = data.appointments.filter(
    (appointment) => appointment.ownerName === "Laura Gómez",
  );

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
                {appointments.map((appointment) => {
                  const status = getAppointmentStatusPresentation(appointment.status);
                  const canCancel =
                    appointment.status === "confirmed" || appointment.status === "pending";

                  return (
                    <tr key={appointment.id}>
                      <td>{appointment.petName}</td>
                      <td>{appointment.serviceName}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>
                        <span className={`chip ${status.className}`}>{status.label}</span>
                      </td>
                      <td>
                        {canCancel ? (
                          <button className="btn btn-ghost btn-sm">Cancelar</button>
                        ) : (
                          <button className="icon-btn">⋯</button>
                        )}
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
