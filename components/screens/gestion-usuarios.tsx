import { AdminSidebar } from "@/components/admin-sidebar";
import type { PrototypeData } from "@/domain/entities/prototype-data";

const ROLE_CLASS = {
  Administrador: "role-admin",
  Veterinario: "role-vet",
  Cliente: "role-cliente",
} as const;

export function GestionUsuarios({ data }: { data: PrototypeData }) {
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
                {data.users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="row-name">
                        <div className="row-avatar">{user.initials}</div>
                        {user.name}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-pill ${ROLE_CLASS[user.role]}`}>{user.role}</span>
                    </td>
                    <td>
                      <div className={`toggle${user.isActive ? "" : " off"}`}></div>
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
