import { ClientSidebar } from "@/components/client-sidebar";
import { GotoLink } from "@/components/nav-context";

export function Mascotas() {
  return (
    <section className="screen active" id="mascotas">
      <div className="app-shell">
        <ClientSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Mis mascotas</h1>
              <div className="sub">Consulta o registra la información de tus mascotas.</div>
            </div>
            <GotoLink to="registro-mascota" className="btn btn-primary btn-sm">
              + Registrar mascota
            </GotoLink>
          </div>
          <div className="pets-grid">
            <div className="pet-card">
              <div className="pet-photo">🐕</div>
              <div className="pet-body">
                <h4>Rocky</h4>
                <div className="meta">Labrador · Macho · 3 años</div>
                <div className="actions">
                  <GotoLink to="historial-mascota" className="btn btn-ghost btn-sm">
                    Ver historial
                  </GotoLink>
                  <GotoLink to="agendar-cita" className="btn btn-primary btn-sm">
                    Agendar
                  </GotoLink>
                </div>
              </div>
            </div>
            <div className="pet-card">
              <div className="pet-photo">🐈</div>
              <div className="pet-body">
                <h4>Mishi</h4>
                <div className="meta">Gato criollo · Hembra · 1 año</div>
                <div className="actions">
                  <GotoLink to="historial-mascota" className="btn btn-ghost btn-sm">
                    Ver historial
                  </GotoLink>
                  <GotoLink to="agendar-cita" className="btn btn-primary btn-sm">
                    Agendar
                  </GotoLink>
                </div>
              </div>
            </div>
            <GotoLink to="registro-mascota" className="add-pet-card">
              <div className="plus">+</div>
              <span>Registrar nueva mascota</span>
            </GotoLink>
          </div>
        </div>
      </div>
    </section>
  );
}
