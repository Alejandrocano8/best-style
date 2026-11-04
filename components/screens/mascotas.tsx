import { ClientSidebar } from "@/components/client-sidebar";
import { GotoLink } from "@/components/nav-context";
import type { PrototypeData } from "@/domain/entities/prototype-data";

export function Mascotas({ data }: { data: PrototypeData }) {
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
            {data.pets.map((pet) => (
              <div className="pet-card" key={pet.id}>
                <div className="pet-photo">{pet.icon}</div>
                <div className="pet-body">
                  <h4>{pet.name}</h4>
                  <div className="meta">
                    {pet.breed} · {pet.sex} · {pet.ageYears} años
                  </div>
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
            ))}
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
