import { GotoLink } from "@/components/nav-context";

export function Landing() {
  return (
    <section className="screen active" id="landing">
      <nav className="lp-nav">
        <div className="brand">
          <div className="brand-mark">B</div>
          <div className="brand-name">Best Style</div>
        </div>
        <div className="pub-links">
          <a href="#">Servicios</a>
          <a href="#">Cómo funciona</a>
          <a href="#">Ubicación</a>
          <GotoLink to="login">Iniciar sesión</GotoLink>
          <GotoLink to="agendar-cita" className="btn btn-primary btn-sm">
            Agendar cita
          </GotoLink>
        </div>
      </nav>

      <div className="lp-hero">
        <div>
          <h1>Estética veterinaria para el bienestar de tu mascota.</h1>
          <p className="lead">
            Best Style organiza en un mismo lugar el registro de tu mascota, sus citas y su historial de
            servicios — sin llamadas, sin papeles ni horarios encimados.
          </p>
          <div className="lp-hero-actions">
            <GotoLink to="agendar-cita" className="btn btn-primary">
              Agendar una cita
            </GotoLink>
            <GotoLink to="registro-cliente" className="btn btn-ghost">
              Crear cuenta
            </GotoLink>
          </div>
          <div className="lp-trust">
            <div>
              <b>3</b>servicios especializados
            </div>
            <div>
              <b>+500</b>mascotas atendidas
            </div>
            <div>
              <b>Pradera</b>Valle del Cauca
            </div>
          </div>
        </div>
        <div className="lp-photo">
          🐾
          <div className="lp-photo-card">
            <div className="name">Cita confirmada</div>
            <div className="meta">Rocky · Corte de pelo · Vie 18, 11:00 am</div>
          </div>
        </div>
      </div>

      <div className="lp-section">
        <div className="lp-section-head">
          <h2>Nuestros servicios</h2>
          <p>Tratamientos pensados para la higiene, salud y bienestar de tu mascota.</p>
        </div>
        <div className="lp-service-row">
          <div className="lp-service-icon">🛁</div>
          <div>
            <h3>Baño</h3>
            <p>Baño con productos hipoalergénicos, secado y cepillado según el tipo de pelaje.</p>
          </div>
          <div className="lp-service-price">
            Desde <b>$25.000</b>
          </div>
        </div>
        <div className="lp-service-row">
          <div className="lp-service-icon">✂️</div>
          <div>
            <h3>Corte de pelo</h3>
            <p>Corte a tijera o máquina, adaptado a la raza y preferencia del propietario.</p>
          </div>
          <div className="lp-service-price">
            Desde <b>$35.000</b>
          </div>
        </div>
        <div className="lp-service-row">
          <div className="lp-service-icon">👂</div>
          <div>
            <h3>Limpieza de oídos</h3>
            <p>Limpieza preventiva para evitar infecciones y molestias auditivas.</p>
          </div>
          <div className="lp-service-price">
            Desde <b>$15.000</b>
          </div>
        </div>
      </div>

      <div className="lp-steps">
        <div className="lp-step">
          <div className="lp-step-num">1</div>
          <h4>Crea tu cuenta</h4>
          <p>Regístrate como propietario en menos de un minuto.</p>
        </div>
        <div className="lp-step">
          <div className="lp-step-num">2</div>
          <h4>Registra tu mascota</h4>
          <p>Guarda su información y quedará lista para agendar.</p>
        </div>
        <div className="lp-step">
          <div className="lp-step-num">3</div>
          <h4>Agenda su cita</h4>
          <p>Elige servicio, fecha y hora disponible en segundos.</p>
        </div>
      </div>

      <div className="lp-quote">
        <p>
          &quot;Antes perdíamos el hilo del historial de cada mascota. Ahora queda todo registrado y podemos
          consultarlo en segundos.&quot;
        </p>
        <span>— Equipo Best Style</span>
      </div>

      <div className="lp-cta">
        <div>
          <h2>Tu mascota merece un cuidado sin contratiempos</h2>
          <p>Agenda su próxima cita en un par de minutos.</p>
        </div>
        <GotoLink to="agendar-cita" className="btn btn-primary">
          Agendar una cita
        </GotoLink>
      </div>

      <div className="site-footer">
        <span>© 2026 Best Style — Pradera, Valle del Cauca</span>
        <span>Baño · Corte de pelo · Limpieza de oídos</span>
      </div>
    </section>
  );
}
