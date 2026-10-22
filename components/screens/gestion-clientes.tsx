import { AdminSidebar } from "@/components/admin-sidebar";

export function GestionClientes() {
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
                <tr>
                  <td>
                    <div className="row-name">
                      <div className="row-avatar">LG</div>
                      Laura Gómez
                    </div>
                  </td>
                  <td>1.234.567</td>
                  <td>300 000 0000</td>
                  <td>2</td>
                  <td>17 sep 2026</td>
                  <td>
                    <button className="icon-btn">→</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="row-name">
                      <div className="row-avatar">AR</div>
                      Andrés Ruiz
                    </div>
                  </td>
                  <td>1.098.765</td>
                  <td>301 111 1111</td>
                  <td>1</td>
                  <td>17 sep 2026</td>
                  <td>
                    <button className="icon-btn">→</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="row-name">
                      <div className="row-avatar">MO</div>
                      Marcela Ospina
                    </div>
                  </td>
                  <td>1.076.543</td>
                  <td>302 222 2222</td>
                  <td>3</td>
                  <td>18 sep 2026</td>
                  <td>
                    <button className="icon-btn">→</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="row-name">
                      <div className="row-avatar">JT</div>
                      Julián Torres
                    </div>
                  </td>
                  <td>1.055.432</td>
                  <td>303 333 3333</td>
                  <td>1</td>
                  <td>16 sep 2026</td>
                  <td>
                    <button className="icon-btn">→</button>
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
