import { AdminSidebar } from "@/components/admin-sidebar";
import type { PrototypeData } from "@/domain/entities/prototype-data";

export function GestionClientes({ data }: { data: PrototypeData }) {
  return (
    <section className="screen active" id="gestion-clientes">
      <div className="app-shell">
        <AdminSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Gestión de clientes</h1>
              <div className="sub">Consulta la información de los propietarios registrados.</div>
            </div>
          </div>
          <div className="panel">
            <div className="table-toolbar">
              <input className="search-input" placeholder="Buscar por nombre, cédula o teléfono..." />
              <button className="btn btn-primary btn-sm">+ Registrar cliente</button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Cédula</th>
                  <th>Teléfono</th>
                  <th>Mascotas</th>
                  <th>Última cita</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.clients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div className="row-name">
                        <div className="row-avatar">{client.initials}</div>
                        {client.name}
                      </div>
                    </td>
                    <td>{client.nationalId}</td>
                    <td>{client.phone}</td>
                    <td>{client.petCount}</td>
                    <td>{client.lastAppointment}</td>
                    <td>
                      <button className="icon-btn">→</button>
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
