import { ClientSidebar } from "@/components/client-sidebar";
import { GotoLink } from "@/components/nav-context";
import type { PrototypeData } from "@/domain/entities/prototype-data";

export function HistorialMascota({ data }: { data: PrototypeData }) {
  const pet = data.pets[0];

  return (
    <section className="screen active" id="historial-mascota">
      <div className="app-shell">
        <ClientSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Perfil de mascota</h1>
              <div className="sub">Información y servicios de {pet.name}.</div>
            </div>
            <GotoLink to="agendar-cita" className="btn btn-primary btn-sm">
              Agendar cita para {pet.name}
            </GotoLink>
          </div>
          <div className="pet-header">
            <div className="photo-lg">{pet.icon}</div>
            <div>
              <h2>{pet.name}</h2>
              <div className="tags">
                <span className="tag">{pet.breed}</span>
                <span className="tag">{pet.sex}</span>
                <span className="tag">{pet.ageYears} años</span>
                <span className="tag">Propietario: {pet.ownerName}</span>
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-head">
              <h3>Historial de servicios y citas</h3>
            </div>
            <div className="timeline">
              <div className="tl-item">
                <div className="tl-date">18 sep 2026 · Pendiente</div>
                <div className="tl-title">Corte de pelo</div>
                <div className="tl-desc">Agendado con Vet. Ana Ríos.</div>
              </div>
              <div className="tl-item">
                <div className="tl-date">02 ago 2026 · Realizada</div>
                <div className="tl-title">Baño</div>
                <div className="tl-desc">Atendido sin novedades. Piel sensible detectada.</div>
              </div>
              <div className="tl-item">
                <div className="tl-date">14 jun 2026 · Realizada</div>
                <div className="tl-title">Limpieza de oídos</div>
                <div className="tl-desc">Se recomendó limpieza mensual preventiva.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
