import { GotoLink } from "@/components/nav-context";
import {
  BathIcon,
  EarCareIcon,
  HeroPetIllustration,
  ScissorsIcon,
  PawIcon,
  SparklesIcon,
  CheckIcon,
} from "@/components/icons";

export function Landing() {
  return (
    <section className="screen active" id="landing">
      <nav className="lp-nav">
        <div className="brand">
          <div className="brand-mark">B</div>
          <div className="brand-name">Best Style</div>
        </div>
        <div className="pub-links">
          <a href="#servicios">Servicios</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#ubicacion">Ubicación</a>
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
          <HeroPetIllustration />
          <div className="lp-photo-card">
            <div className="name">Cita confirmada</div>
            <div className="meta">Rocky · Corte de pelo · Vie 18, 11:00 am</div>
          </div>
        </div>
      </div>

      {/* ── ABOUT / PRESENTACIÓN ─────────────────────────── */}
      <div className="lp-about">
        <div className="lp-about-badge">
          <PawIcon size={14} />
          <span>Estética Veterinaria · Pradera, Valle del Cauca</span>
        </div>
        <h2>Cuidado profesional para tu mejor amigo</h2>
        <p>
          En <strong>Best Style</strong> creemos que cada mascota merece atención personalizada, higiénica y sin
          estrés. Nuestro equipo combina técnica, amor y los mejores productos del mercado para que tu peludo luzca
          y se sienta increíble.
        </p>
        <div className="lp-about-pillars">
          <div className="lp-pillar">
            <div className="lp-pillar-icon">
              <SparklesIcon size={22} />
            </div>
            <h4>Productos premium</h4>
            <p>Shampoos hipoalergénicos, acondicionadores y lociones de alta gama seleccionados para cada tipo de pelaje.</p>
          </div>
          <div className="lp-pillar">
            <div className="lp-pillar-icon">
              <CheckIcon size={22} />
            </div>
            <h4>Atención personalizada</h4>
            <p>Cada mascota recibe un trato individual: evaluamos su historial, temperamento y necesidades antes de comenzar.</p>
          </div>
          <div className="lp-pillar">
            <div className="lp-pillar-icon">
              <PawIcon size={22} />
            </div>
            <h4>Espacio sin estrés</h4>
            <p>Instalaciones limpias, tranquilas y diseñadas para que tu mascota se sienta segura durante todo el proceso.</p>
          </div>
        </div>
      </div>

      {/* ── SERVICIOS ─────────────────────────────────────── */}
      <div className="lp-section" id="servicios">
        <div className="lp-section-head">
          <h2>Nuestros servicios</h2>
          <p>Tratamientos pensados para la higiene, salud y bienestar de tu mascota.</p>
        </div>

        {/* Cards de servicios */}
        <div className="lp-service-cards">
          <div className="lp-svc-card">
            <div className="lp-svc-card-icon">
              <BathIcon size={30} />
            </div>
            <div className="lp-svc-card-badge">Popular</div>
            <h3>Baño completo</h3>
            <p>Baño con shampoo y acondicionador hipoalergénico, secado profesional, cepillado y perfume. Incluye limpieza de patas y zona facial.</p>
            <ul className="lp-svc-includes">
              <li><CheckIcon size={13} /> Shampoo hipoalergénico</li>
              <li><CheckIcon size={13} /> Secado y cepillado</li>
              <li><CheckIcon size={13} /> Perfume para mascotas</li>
              <li><CheckIcon size={13} /> Limpieza de patas</li>
            </ul>
            <div className="lp-svc-card-footer">
              <span className="lp-svc-price">Desde <b>$25.000</b></span>
              <GotoLink to="agendar-cita" className="btn btn-sm btn-primary">Agendar</GotoLink>
            </div>
          </div>

          <div className="lp-svc-card lp-svc-card--featured">
            <div className="lp-svc-card-icon">
              <ScissorsIcon size={30} />
            </div>
            <div className="lp-svc-card-badge lp-svc-card-badge--gold">Recomendado</div>
            <h3>Baño + Corte de pelo</h3>
            <p>El paquete completo: baño higiénico más corte a tijera o máquina adaptado a la raza y la preferencia del propietario. Tu mascota queda lista para brillar.</p>
            <ul className="lp-svc-includes">
              <li><CheckIcon size={13} /> Todo lo del baño</li>
              <li><CheckIcon size={13} /> Corte a tijera o máquina</li>
              <li><CheckIcon size={13} /> Modelado según raza</li>
              <li><CheckIcon size={13} /> Acabado profesional</li>
            </ul>
            <div className="lp-svc-card-footer">
              <span className="lp-svc-price">Desde <b>$55.000</b></span>
              <GotoLink to="agendar-cita" className="btn btn-sm btn-primary">Agendar</GotoLink>
            </div>
          </div>

          <div className="lp-svc-card">
            <div className="lp-svc-card-icon">
              <EarCareIcon size={30} />
            </div>
            <h3>Limpieza de oídos</h3>
            <p>Limpieza preventiva con productos especializados para evitar acumulación de suciedad, infecciones y molestias auditivas. Ideal como mantenimiento mensual.</p>
            <ul className="lp-svc-includes">
              <li><CheckIcon size={13} /> Limpieza profunda</li>
              <li><CheckIcon size={13} /> Productos especializados</li>
              <li><CheckIcon size={13} /> Revisión de conducto</li>
              <li><CheckIcon size={13} /> Sin dolor ni estrés</li>
            </ul>
            <div className="lp-svc-card-footer">
              <span className="lp-svc-price">Desde <b>$15.000</b></span>
              <GotoLink to="agendar-cita" className="btn btn-sm btn-primary">Agendar</GotoLink>
            </div>
          </div>
        </div>

        {/* Nota adicional */}
        <div className="lp-svc-note">
          Los precios varían según el tamaño y la raza de tu mascota.
          <GotoLink to="agendar-cita" className="lp-svc-note-link">Consulta sin compromiso</GotoLink>
        </div>
      </div>

      <div className="lp-steps" id="como-funciona">
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
