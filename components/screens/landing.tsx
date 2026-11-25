"use client";

import { useState } from "react";
import { GotoLink } from "@/components/nav-context";

interface ServiceItem {
  id: string;
  name: string;
  tagline: string;
  category: string;
  icon: string;
  price: string;
  priceRaw: number;
  priceNote: string;
  duration: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  popular?: boolean;
}

const SERVICES: ServiceItem[] = [
  {
    id: "bano",
    name: "Baño Completo & Spa",
    tagline: "Higiene profunda y bienestar relajante",
    category: "Higiene & Cuidado",
    icon: "🛁",
    price: "$25.000",
    priceRaw: 25000,
    priceNote: "Desde",
    duration: "45 min aprox.",
    description: "Baño con agua a temperatura controlada, productos hipoalergénicos, secado suave y cepillado según el tipo de manto.",
    features: [
      "Champú hipoalergénico dermatológico y bálsamo hidratante",
      "Secado profesional con temperatura regulada y cepillado anti-nudos",
      "Limpieza y desinfección suave de almohadillas plantares",
      "Perfume relajante y revisión preventiva básica de piel y pelaje",
    ],
    // =========================================================================
    // ESPACIO PARA TU IMAGEN:
    // Puedes reemplazar esta URL por tu propia imagen local o web
    // Ejemplo: "/images/bano-perro.jpg" o tu enlace personalizado
    // =========================================================================
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Mascota disfrutando de un baño relajante en Best Style",
    popular: true,
  },
  {
    id: "corte",
    name: "Corte de Pelo & Estilismo",
    tagline: "Técnica profesional adaptada a cada raza",
    category: "Estética Canina",
    icon: "✂️",
    price: "$35.000",
    priceRaw: 35000,
    priceNote: "Desde",
    duration: "60 min aprox.",
    description: "Corte especializado a máquina y tijera adaptado a la morfología, raza y preferencia del propietario con máxima delicadeza.",
    features: [
      "Corte higiénico o de raza personalizado según tu indicación",
      "Deslanado técnico y retiro cuidadoso de nudos sin maltratar la piel",
      "Perfilado estético a tijera en patitas, orejas y contorno facial",
      "Despeje higiénico de lagrimales y acabado suave y uniforme",
    ],
    // =========================================================================
    // ESPACIO PARA TU IMAGEN:
    // Puedes reemplazar esta URL por tu propia imagen local o web
    // Ejemplo: "/images/corte-pelo.jpg" o tu enlace personalizado
    // =========================================================================
    image: "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Corte y peinado canino profesional en Best Style",
  },
  {
    id: "oidos",
    name: "Limpieza de Oídos & Cuidados",
    tagline: "Salud auditiva y prevención de infecciones",
    category: "Salud Preventiva",
    icon: "👂",
    price: "$15.000",
    priceRaw: 15000,
    priceNote: "Desde",
    duration: "20 min aprox.",
    description: "Limpieza preventiva e indolora con solución antiséptica para retirar cerumen, humedad y prevenir otitis o molestias.",
    features: [
      "Aplicación de solución ótica antiséptica y calmante veterinaria",
      "Extracción delicada de cerumen acumulado y polvo del canal exterior",
      "Retiro preventivo de exceso de vellosidad sin dolor ni irritación",
      "Secado cuidadoso para evitar proliferación de bacterias u hongos",
    ],
    // =========================================================================
    // ESPACIO PARA TU IMAGEN:
    // Puedes reemplazar esta URL por tu propia imagen local o web
    // Ejemplo: "/images/limpieza-oidos.jpg" o tu enlace personalizado
    // =========================================================================
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Cuidado y limpieza de oídos para mascota en Best Style",
  },
];

export function Landing() {
  // Servicio abierto inicialmente para que el usuario vea el espacio de imagen y características
  const [activeId, setActiveId] = useState<string>("bano");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // El servicio desplegado es el que tiene el mouse encima (o el seleccionado si no hay hover)
  const isExpanded = (id: string) => (hoveredId ? hoveredId === id : activeId === id);

  return (
    <section className="screen active lp-screen" id="landing">
      {/* ---------- NAVBAR ---------- */}
      <nav className="lp-nav">
        <div className="brand">
          <div className="brand-mark">B</div>
          <div className="brand-text">
            <span className="brand-name">Best Style</span>
            <span className="brand-subtitle">Estética Veterinaria</span>
          </div>
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

      {/* ---------- HERO SECTION ---------- */}
      <div className="lp-hero">
        <div>
          <div className="lp-pill">
            <span>✨</span>
            <span>Estética veterinaria de alta gama en Pradera</span>
          </div>
          <h1>
            Estética y bienestar <span className="highlight">de primer nivel</span> para tu mascota.
          </h1>
          <p className="lead">
            Best Style organiza en un solo lugar el registro de tu mascota, sus citas y su historial
            completo de atención — sin filas, sin llamadas y con horarios puntuales.
          </p>
          <div className="lp-hero-actions">
            <GotoLink to="agendar-cita" className="btn btn-primary">
              Agendar una cita →
            </GotoLink>
            <GotoLink to="registro-cliente" className="btn btn-ghost">
              Crear cuenta
            </GotoLink>
          </div>
          <div className="lp-trust">
            <div>
              <b>3</b>
              <span>Servicios especializados</span>
            </div>
            <div>
              <b>+500</b>
              <span>Mascotas atendidas</span>
            </div>
            <div>
              <b>4.9 ★</b>
              <span>Calificación de clientes</span>
            </div>
            <div>
              <b>Pradera</b>
              <span>Valle del Cauca</span>
            </div>
          </div>
        </div>

        {/* Hero visual con imagen destacada y tarjetas flotantes */}
        <div className="lp-hero-showcase">
          <div className="lp-floating-badge">
            <span>⭐</span>
            <span>4.9 / 5 · Máxima satisfacción</span>
          </div>

          <div className="lp-hero-photo-wrap">
            {/* Foto de mascota consentida en el Hero */}
            <img
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80"
              alt="Mascota feliz y consentida en Best Style"
              loading="eager"
            />
          </div>

          <div className="lp-floating-card">
            <div className="status-row">
              <span className="lp-status-dot"></span>
              <span>Cita confirmada</span>
            </div>
            <div className="name">Rocky · Golden Retriever</div>
            <div className="meta">Corte de pelo & Spa · Vie 18, 11:00 am</div>
          </div>
        </div>
      </div>

      {/* ---------- SECCIÓN DE SERVICIOS INTERACTIVA ---------- */}
      <div className="lp-section" id="servicios">
        <div className="lp-section-head">
          <div>
            <div className="lp-pill">
              <span>🐾</span>
              <span>Nuestros Servicios Especializados</span>
            </div>
            <h2>El cuidado que tu mascota merece</h2>
          </div>
          <p>
            Pasa el mouse sobre cualquier servicio para desplegar sus <b>características</b>,{" "}
            <b>precio</b> y el <b>espacio de imagen</b> en tiempo real.
          </p>
        </div>

        {/* Grid de servicios interactivo con despliegue al posar el mouse */}
        <div
          className="lp-services-grid"
          onMouseLeave={() => setHoveredId(null)}
        >
          {SERVICES.map((service) => {
            const expanded = isExpanded(service.id);

            return (
              <div
                key={service.id}
                className={`lp-service-card ${expanded ? "is-active" : ""}`}
                onMouseEnter={() => setHoveredId(service.id)}
                onClick={() => setActiveId(service.id)}
              >
                {/* Cabecera del servicio (siempre visible) */}
                <div className="lp-service-header">
                  <div className="lp-service-icon-box">{service.icon}</div>
                  <span className={`lp-service-badge ${service.popular ? "popular" : ""}`}>
                    {service.popular ? "★ Más solicitado" : service.category}
                  </span>
                </div>

                <h3>{service.name}</h3>
                <p className="lp-service-summary">{service.description}</p>

                {/* Previsualización rápida de precio */}
                <div className="lp-service-quick-preview">
                  <span>
                    {service.priceNote} <b>{service.price}</b>
                  </span>
                  <span>{service.duration}</span>
                </div>

                {/* Indicador interactivo */}
                <div className="lp-expand-prompt">
                  <span>{expanded ? "Detalles desplegados" : "Pasa el mouse para ver detalles e imagen"}</span>
                  <span className="chevron">▾</span>
                </div>

                {/* ================================================================= */}
                {/* DESPLEGABLE AL PONER EL MOUSE ENCIMA:                              */}
                {/* Contiene: Espacio de Imagen, Precio destacado y Características     */}
                {/* ================================================================= */}
                <div className="lp-service-drawer">
                  {/* 1. ESPACIO PARA PONER UNA IMAGEN */}
                  <div className="lp-service-image-slot">
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      className="lp-service-img"
                      loading="lazy"
                    />
                    <div className="lp-service-image-tag">
                      <span>📷</span>
                      <span>Espacio de imagen · {service.name}</span>
                    </div>
                  </div>

                  {/* 2. PRECIO DESTACADO Y DURACIÓN */}
                  <div className="lp-service-price-banner">
                    <div className="lp-price-info">
                      <span className="label">Precio estimado</span>
                      <div>
                        <span className="amount">{service.price}</span>
                        <span className="currency">COP</span>
                      </div>
                    </div>
                    <div className="lp-duration-pill">
                      <span>⏱️ {service.duration}</span>
                    </div>
                  </div>

                  {/* 3. CARACTERÍSTICAS DEL SERVICIO DESPLEGADAS */}
                  <div className="lp-service-features">
                    <div className="lp-features-title">
                      <span>✨</span>
                      <span>Características incluidas:</span>
                    </div>
                    <ul className="lp-features-list">
                      {service.features.map((feature, idx) => (
                        <li key={idx}>
                          <span className="lp-check-icon">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Botón directo para agendar este servicio */}
                  <GotoLink
                    to="agendar-cita"
                    className="btn btn-primary lp-service-btn"
                  >
                    Agendar {service.name} →
                  </GotoLink>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- CÓMO FUNCIONA ---------- */}
      <div className="lp-section" id="como-funciona" style={{ paddingTop: 20 }}>
        <div className="lp-section-head">
          <div>
            <div className="lp-pill">
              <span>🚀</span>
              <span>Proceso Simple y Rápido</span>
            </div>
            <h2>Cómo funciona Best Style</h2>
          </div>
          <p>
            Diseñamos cada paso para que agendar el servicio de tu mascota sea fácil, rápido y seguro.
          </p>
        </div>

        <div className="lp-steps">
          <div className="lp-step-card">
            <div className="lp-step-num">1</div>
            <h4>Crea tu cuenta</h4>
            <p>
              Regístrate en menos de un minuto como propietario para acceder a tu historial y citas.
            </p>
          </div>
          <div className="lp-step-card">
            <div className="lp-step-num">2</div>
            <h4>Registra tu mascota</h4>
            <p>
              Guarda su nombre, raza, edad y detalles de salud o temperamento para personalizar su atención.
            </p>
          </div>
          <div className="lp-step-card">
            <div className="lp-step-num">3</div>
            <h4>Agenda su cita</h4>
            <p>
              Elige el servicio, selecciona la fecha y el horario disponible en segundos con confirmación inmediata.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- TESTIMONIAL Y CONFIANZA ---------- */}
      <div className="lp-quote">
        <div className="lp-quote-stars">★★★★★</div>
        <p>
          &quot;Antes perdíamos el hilo del historial y citas de cada mascota. Ahora todo queda registrado en un mismo lugar y podemos consultarlo en segundos para brindar la mejor atención.&quot;
        </p>
        <span className="author">— Equipo Profesional de Best Style</span>
        <div className="lp-quote-chips">
          <span>🌿 Productos hipoalergénicos certificados</span>
          <span>🧼 Instrumental esterilizado y seguro</span>
          <span>🩺 Trato cariñoso y sin estrés</span>
        </div>
      </div>

      {/* ---------- UBICACIÓN Y HORARIOS ---------- */}
      <div className="lp-section" id="ubicacion" style={{ paddingTop: 10 }}>
        <div className="lp-section-head">
          <div>
            <div className="lp-pill">
              <span>📍</span>
              <span>Visítanos en Pradera</span>
            </div>
            <h2>Ubicación y Atención</h2>
          </div>
          <p>
            Estamos ubicados en una zona accesible de Pradera para mayor tranquilidad tuya y de tu mascota.
          </p>
        </div>

        <div className="lp-location-grid">
          <div className="lp-location-card">
            <div className="lp-location-icon">📍</div>
            <div>
              <h4>Dirección</h4>
              <p>Pradera, Valle del Cauca · Instalaciones diseñadas para la comodidad animal.</p>
            </div>
          </div>
          <div className="lp-location-card">
            <div className="lp-location-icon">🕒</div>
            <div>
              <h4>Horarios de atención</h4>
              <p>Lunes a Sábado: 8:00 AM – 6:00 PM (Servicio con cita previa confirmada).</p>
            </div>
          </div>
          <div className="lp-location-card">
            <div className="lp-location-icon">📱</div>
            <div>
              <h4>Agendamiento Digital</h4>
              <p>Plataforma disponible 24/7 para reservar tu turno sin llamadas ni esperas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- CTA FINAL ---------- */}
      <div className="lp-cta">
        <div>
          <h2>Tu mascota merece un cuidado sin contratiempos</h2>
          <p>
            Únete a más de 500 familias que confían en Best Style para el bienestar, higiene y estética de sus consentidos.
          </p>
        </div>
        <GotoLink to="agendar-cita" className="btn">
          Agendar una cita ahora →
        </GotoLink>
      </div>

      {/* ---------- FOOTER ---------- */}
      <div className="site-footer">
        <span>© 2026 Best Style — Pradera, Valle del Cauca</span>
        <div className="site-footer-links">
          <a href="#servicios">Servicios</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#ubicacion">Ubicación</a>
          <GotoLink to="login">Iniciar sesión</GotoLink>
        </div>
        <span>Baño · Corte de pelo · Limpieza de oídos</span>
      </div>
    </section>
  );
}
