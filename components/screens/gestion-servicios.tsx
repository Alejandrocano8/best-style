import { AdminSidebar } from "@/components/admin-sidebar";
import type { PrototypeData } from "@/domain/entities/prototype-data";

export function GestionServicios({ data }: { data: PrototypeData }) {
  return (
    <section className="screen active" id="gestion-servicios">
      <div className="app-shell">
        <AdminSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Gestión de servicios</h1>
              <div className="sub">Administra los servicios que ofrece Best Style.</div>
            </div>
            <button className="btn btn-primary btn-sm">+ Nuevo servicio</button>
          </div>
          <div className="panel">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Duración estimada</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="row-name">
                        <div className="row-avatar">{service.icon}</div>
                        {service.name}
                      </div>
                    </td>
                    <td>{service.durationMinutes} min</td>
                    <td>${service.price.toLocaleString("es-CO")}</td>
                    <td>
                      <div className={`toggle${service.isActive ? "" : " off"}`}></div>
                    </td>
                    <td>
                      <button className="icon-btn">✎</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
