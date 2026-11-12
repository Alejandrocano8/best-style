"use client";

import type { ReactNode } from "react";
import { GotoLink, useAuth, useNav } from "@/components/nav-context";
import {
  CalendarIcon,
  HomeIcon,
  ScissorsIcon,
  ShieldLockIcon,
  UsersIcon,
} from "@/components/icons";

export function AdminSidebar() {
  const { active } = useNav();
  const { user, signOut } = useAuth();

  const link = (id: Parameters<typeof GotoLink>[0]["to"], icon: ReactNode, label: string) => (
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
      {link("dashboard-admin", <HomeIcon size={16} />, "Resumen")}
      {link("gestion-citas", <CalendarIcon size={16} />, "Citas")}
      {link("gestion-clientes", <UsersIcon size={16} />, "Clientes")}
      {link("gestion-servicios", <ScissorsIcon size={16} />, "Servicios")}
      <div className="side-section-label">Sistema</div>
      {link("gestion-usuarios", <ShieldLockIcon size={16} />, "Usuarios y roles")}
      <div className="sidebar-foot">
        <div className="avatar">{user?.initials ?? "BS"}</div>
        <div className="side-user-meta">
          <div className="side-user-name">{user?.name ?? "Invitado"}</div>
          <div className="side-user-role">{user?.role ?? "Administrador"}</div>
        </div>
        <button type="button" className="side-logout" onClick={() => void signOut()}>
          Salir
        </button>
      </div>
    </aside>
  );
}
