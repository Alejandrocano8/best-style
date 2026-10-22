import { AdminSidebar } from "@/components/admin-sidebar";

export function GestionUsuarios() {
  return (
    <section className="screen active" id="gestion-usuarios">
      <div className="app-shell">
        <AdminSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Usuarios y roles</h1>
              <div className="sub">Gestiona quién puede acceder al sistema y con qué permisos.</div>
            </div>
            <button className="btn btn-primary btn-sm">+ Nuevo usuario</button>
          </div>
          <div className="panel">
            <div className="table-toolbar">
              <div className="filter-pills">
                <span className="filter-pill active">Todos</span>
                <span className="filter-pill">Clientes</span>
                <span className="filter-pill">Veterinarios</span>
                <span className="filter-pill">Administradores</span>
              </div>
              <input className="search-input" placeholder="Buscar usuario..." />
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="row-name">
                      <div className="row-avatar">CP</div>
                      Carlos Peña
                    </div>
                  </td>
                  <td>carlos@beststyle.com</td>
                  <td>
                    <span className="role-pill role-admin">Administrador</span>
                  </td>
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
                      <div className="row-avatar">AR</div>
                      Ana Ríos
                    </div>
                  </td>
                  <td>ana@beststyle.com</td>
                  <td>
                    <span className="role-pill role-vet">Veterinario</span>
                  </td>
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
                      <div className="row-avatar">LG</div>
                      Laura Gómez
                    </div>
                  </td>
                  <td>laura@correo.com</td>
                  <td>
                    <span className="role-pill role-cliente">Cliente</span>
                  </td>
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
                      <div className="row-avatar">JT</div>
                      Julián Torres
                    </div>
                  </td>
                  <td>julian@correo.com</td>
                  <td>
                    <span className="role-pill role-cliente">Cliente</span>
                  </td>
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
