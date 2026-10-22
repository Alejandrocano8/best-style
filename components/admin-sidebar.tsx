"use client";

import { GotoLink, useNav } from "@/components/nav-context";

export function AdminSidebar() {
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
      <div className="side-section-label">Panel</div>
      {link("dashboard-admin", "🏠", "Resumen")}
      {link("gestion-citas", "🗓️", "Citas")}
      {link("gestion-clientes", "👥", "Clientes")}
      {link("gestion-servicios", "🛁", "Servicios")}
      <div className="side-section-label">Sistema</div>
      {link("gestion-usuarios", "🔐", "Usuarios y roles")}
      <div className="sidebar-foot">
        <div className="avatar">CP</div>
        <div>
          <div className="side-user-name">Carlos Peña</div>
          <div className="side-user-role">Administrador</div>
        </div>
      </div>
    </aside>
  );
}
