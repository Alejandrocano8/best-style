import { ClientSidebar } from "@/components/client-sidebar";
import { GotoLink } from "@/components/nav-context";

export function AgendarCita() {
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
              <div className="pick-card selected">
                <div className="ic">🐕</div>
                <div className="name">Rocky</div>
                <div className="price">Labrador</div>
              </div>
              <div className="pick-card">
                <div className="ic">🐈</div>
                <div className="name">Mishi</div>
                <div className="price">Gato criollo</div>
              </div>
            </div>
            <div className="panel-head">
              <h3>Elige el servicio</h3>
            </div>
            <div className="pick-grid">
              <div className="pick-card">
                <div className="ic">🛁</div>
                <div className="name">Baño</div>
                <div className="price">$25.000</div>
              </div>
              <div className="pick-card selected">
                <div className="ic">✂️</div>
                <div className="name">Corte de pelo</div>
                <div className="price">$35.000</div>
              </div>
              <div className="pick-card">
                <div className="ic">👂</div>
                <div className="name">Limpieza de oídos</div>
                <div className="price">$15.000</div>
              </div>
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
                <span>Rocky · Corte de pelo</span>
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
