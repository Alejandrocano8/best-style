"use client";

import { GotoLink, useNav } from "@/components/nav-context";

export function ClientSidebar() {
  const { active } = useNav();

  const link = (id: Parameters<typeof GotoLink>[0]["to"], icon: string, label: string) => (
    <GotoLink to={id} className={`side-link${active === id ? " active" : ""}`}>
      <span className="ic">{icon}</span>
      {label}
    </GotoLink>
  );

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" style={{ background: "var(--pine-pale)", color: "var(--pine-dark)" }}>
          B
        </div>
        <div className="brand-name">Best Style</div>
      </div>
      <div className="side-section-label">Menú</div>
      {link("dashboard-cliente", "🏠", "Inicio")}
      {link("mascotas", "🐾", "Mis mascotas")}
      {link("agendar-cita", "🗓️", "Agendar cita")}
      {link("mis-citas", "📋", "Mis citas")}
      <div className="sidebar-foot">
        <div className="avatar">LG</div>
        <div>
          <div className="side-user-name">Laura Gómez</div>
          <div className="side-user-role">Cliente</div>
        </div>
      </div>
    </aside>
  );
}
