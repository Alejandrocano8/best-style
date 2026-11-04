import { ClientSidebar } from "@/components/client-sidebar";
import { GotoLink } from "@/components/nav-context";
import type { PrototypeData } from "@/domain/entities/prototype-data";

export function AgendarCita({ data }: { data: PrototypeData }) {
  return (
    <section className="screen active" id="agendar-cita">
      <div className="app-shell">
        <ClientSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Agendar cita</h1>
              <div className="sub">Sigue los pasos para reservar la atención de tu mascota.</div>
            </div>
          </div>

          <div className="steps-bar">
            <div className="step-item done">
              <div className="step-circle">✓</div>
              <div className="step-label">Mascota</div>
            </div>
            <div className="step-line"></div>
            <div className="step-item done">
              <div className="step-circle">✓</div>
              <div className="step-label">Servicio</div>
            </div>
            <div className="step-line"></div>
            <div className="step-item current">
              <div className="step-circle">3</div>
              <div className="step-label">Fecha y hora</div>
            </div>
            <div className="step-line"></div>
            <div className="step-item">
              <div className="step-circle">4</div>
              <div className="step-label">Confirmar</div>
            </div>
          </div>

          <div className="panel" style={{ maxWidth: "640px" }}>
            <div className="panel-head">
              <h3>Elige la mascota</h3>
            </div>
            <div className="pick-grid">
              {data.pets.map((pet, index) => (
                <div className={`pick-card${index === 0 ? " selected" : ""}`} key={pet.id}>
                  <div className="ic">{pet.icon}</div>
                  <div className="name">{pet.name}</div>
                  <div className="price">{pet.breed}</div>
                </div>
              ))}
            </div>
            <div className="panel-head">
              <h3>Elige el servicio</h3>
            </div>
            <div className="pick-grid">
              {data.services.map((service) => (
                <div
                  className={`pick-card${service.id === "service-2" ? " selected" : ""}`}
                  key={service.id}
                >
                  <div className="ic">{service.icon}</div>
                  <div className="name">{service.name}</div>
                  <div className="price">${service.price.toLocaleString("es-CO")}</div>
                </div>
              ))}
            </div>
            <div className="panel-head">
              <h3>Elige fecha</h3>
            </div>
            <div className="field" style={{ maxWidth: "220px" }}>
              <input type="date" defaultValue="2026-09-18" />
            </div>
            <div className="panel-head" style={{ marginTop: "6px" }}>
              <h3>Horas disponibles</h3>
            </div>
            <div className="time-grid">
              <div className="time-slot taken">9:00 am</div>
              <div className="time-slot">10:00 am</div>
              <div className="time-slot selected">11:00 am</div>
              <div className="time-slot">2:00 pm</div>
              <div className="time-slot">3:00 pm</div>
              <div className="time-slot taken">4:00 pm</div>
            </div>
            <div className="summary-box">
              <div className="summary-row">
                <span>
                  {data.pets[0].name} · Corte de pelo
                </span>
                <span>18 sep, 11:00 am</span>
              </div>
              <div className="summary-row total">
                <span>Total estimado</span>
                <span>$35.000</span>
              </div>
            </div>
            <div className="form-actions">
              <GotoLink to="mis-citas" className="btn btn-primary">
                Confirmar cita
              </GotoLink>
              <GotoLink to="mascotas" className="btn btn-ghost">
                Cancelar
              </GotoLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
