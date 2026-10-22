import { AdminSidebar } from "@/components/admin-sidebar";

export function GestionServicios() {
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
                <tr>
                  <td>
                    <div className="row-name">
                      <div className="row-avatar">🛁</div>
                      Baño
                    </div>
                  </td>
                  <td>45 min</td>
                  <td>$25.000</td>
                  <td>
                    <div className="toggle"></div>
                  </td>
                  <td>
                    <button className="icon-btn">✎</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="row-name">
                      <div className="row-avatar">✂️</div>
                      Corte de pelo
                    </div>
                  </td>
                  <td>60 min</td>
                  <td>$35.000</td>
                  <td>
                    <div className="toggle"></div>
                  </td>
                  <td>
                    <button className="icon-btn">✎</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="row-name">
                      <div className="row-avatar">👂</div>
                      Limpieza de oídos
                    </div>
                  </td>
                  <td>20 min</td>
                  <td>$15.000</td>
                  <td>
                    <div className="toggle off"></div>
                  </td>
                  <td>
                    <button className="icon-btn">✎</button>
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
