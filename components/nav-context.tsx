"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export const SCREEN_IDS = [
  "landing",
  "login",
  "registro-cliente",
  "dashboard-cliente",
  "mascotas",
  "registro-mascota",
  "historial-mascota",
  "agendar-cita",
  "mis-citas",
  "dashboard-admin",
  "gestion-citas",
  "gestion-clientes",
  "gestion-servicios",
  "gestion-usuarios",
] as const;

export type ScreenId = (typeof SCREEN_IDS)[number];

const NavContext = createContext<{ active: ScreenId; goTo: (id: ScreenId) => void }>({
  active: "landing",
  goTo: () => {},
});

export function useNav() {
  return useContext(NavContext);
}

export function NavProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ScreenId>("landing");

  const goTo = useCallback((id: ScreenId) => {
    setActive(id);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return <NavContext.Provider value={{ active, goTo }}>{children}</NavContext.Provider>;
}

export function GotoLink({
  to,
  className,
  children,
}: {
  to: ScreenId;
  className?: string;
  children: ReactNode;
}) {
  const { goTo } = useNav();
  return (
    <a
      href="#"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        goTo(to);
      }}
    >
      {children}
    </a>
  );
}
