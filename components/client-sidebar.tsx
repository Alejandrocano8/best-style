"use client";

import type { ReactNode } from "react";
import { GotoLink, useAuth, useNav } from "@/components/nav-context";
import {
  CalendarPlusIcon,
  ClipboardListIcon,
  HomeIcon,
  PawIcon,
} from "@/components/icons";

export function ClientSidebar() {
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
      <div className="side-section-label">Menú</div>
      {link("dashboard-cliente", <HomeIcon size={16} />, "Inicio")}
      {link("mascotas", <PawIcon size={16} />, "Mis mascotas")}
      {link("agendar-cita", <CalendarPlusIcon size={16} />, "Agendar cita")}
      {link("mis-citas", <ClipboardListIcon size={16} />, "Mis citas")}
      <div className="sidebar-foot">
        <div className="avatar">{user?.initials ?? "BS"}</div>
        <div className="side-user-meta">
          <div className="side-user-name">{user?.name ?? "Invitado"}</div>
          <div className="side-user-role">{user?.role ?? "Cliente"}</div>
        </div>
        <button type="button" className="side-logout" onClick={() => void signOut()}>
          Salir
        </button>
      </div>
    </aside>
  );
}
