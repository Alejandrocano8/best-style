"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AuthenticatedUser } from "@/domain/entities/auth-user";
import type { UserRole } from "@/domain/entities/user";

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

const PENDING_SCREEN_KEY = "best-style:pending-screen";
const HISTORY_SCREEN_KEY = "__bestStyleScreen";

const PUBLIC_SCREENS = new Set<ScreenId>(["landing", "login", "registro-cliente"]);

const ADMIN_ONLY_SCREENS = new Set<ScreenId>([
  "dashboard-admin",
  "gestion-clientes",
  "gestion-servicios",
  "gestion-usuarios",
]);

const STAFF_SCREENS = new Set<ScreenId>(["gestion-citas"]);

function isScreenId(value: unknown): value is ScreenId {
  return typeof value === "string" && (SCREEN_IDS as readonly string[]).includes(value);
}

function resolveScreen(id: ScreenId, currentUser: AuthenticatedUser | null): ScreenId {
  if ((id === "login" || id === "registro-cliente") && currentUser) {
    return defaultScreenForRole(currentUser.role);
  }
  if (!currentUser && !PUBLIC_SCREENS.has(id)) {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(PENDING_SCREEN_KEY, id);
    }
    return "login";
  }
  if (currentUser && !canAccessScreen(id, currentUser)) {
    return defaultScreenForRole(currentUser.role);
  }
  return id;
}

type NavContextValue = {
  active: ScreenId;
  goTo: (id: ScreenId) => void;
  user: AuthenticatedUser | null;
  signIn: (user: AuthenticatedUser) => void;
  signOut: () => Promise<void>;
};

const NavContext = createContext<NavContextValue>({
  active: "landing",
  goTo: () => {},
  user: null,
  signIn: () => {},
  signOut: async () => {},
});

export function defaultScreenForRole(role: UserRole): ScreenId {
  if (role === "Administrador") return "dashboard-admin";
  if (role === "Veterinario") return "gestion-citas";
  return "dashboard-cliente";
}

export function consumePendingScreen(): ScreenId | null {
  if (typeof window === "undefined") return null;

  const value = window.sessionStorage.getItem(PENDING_SCREEN_KEY);
  window.sessionStorage.removeItem(PENDING_SCREEN_KEY);

  if (!value) return null;

  return (SCREEN_IDS as readonly string[]).includes(value) ? (value as ScreenId) : null;
}

function canAccessScreen(screen: ScreenId, user: AuthenticatedUser): boolean {
  if (ADMIN_ONLY_SCREENS.has(screen)) return user.role === "Administrador";
  if (STAFF_SCREENS.has(screen)) {
    return user.role === "Administrador" || user.role === "Veterinario";
  }
  return true;
}

export function useNav() {
  return useContext(NavContext);
}

export function useAuth() {
  const { user, signIn, signOut } = useContext(NavContext);
  return { user, signIn, signOut };
}

export function NavProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: AuthenticatedUser | null;
}) {
  const [active, setActive] = useState<ScreenId>("landing");
  const [user, setUser] = useState<AuthenticatedUser | null>(initialUser);
  const userRef = useRef<AuthenticatedUser | null>(initialUser);

  useEffect(() => {
    const currentState = window.history.state;
    const initialState =
      currentState && typeof currentState === "object" ? currentState : {};
    window.history.replaceState(
      { ...initialState, [HISTORY_SCREEN_KEY]: "landing" },
      "",
      window.location.href,
    );

    function handlePopState(event: PopStateEvent) {
      const state = event.state;
      if (!state || typeof state !== "object" || !isScreenId(state[HISTORY_SCREEN_KEY])) {
        return;
      }

      const requestedScreen = state[HISTORY_SCREEN_KEY];
      const nextScreen = resolveScreen(requestedScreen, userRef.current);
      if (nextScreen !== requestedScreen) {
        window.history.replaceState(
          { ...state, [HISTORY_SCREEN_KEY]: nextScreen },
          "",
          window.location.href,
        );
      }
      setActive(nextScreen);
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const goTo = useCallback((id: ScreenId) => {
    const nextScreen = resolveScreen(id, userRef.current);

    if (typeof window !== "undefined") {
      const currentState = window.history.state;
      const nextState =
        currentState && typeof currentState === "object" ? currentState : {};
      window.history.pushState(
        { ...nextState, [HISTORY_SCREEN_KEY]: nextScreen },
        "",
        window.location.href,
      );
      setActive(nextScreen);
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    } else {
      setActive(nextScreen);
    }
  }, []);

  const signIn = useCallback((nextUser: AuthenticatedUser) => {
    userRef.current = nextUser;
    setUser(nextUser);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}

    userRef.current = null;
    setUser(null);
    setActive("landing");

    if (typeof window !== "undefined") {
      const currentState = window.history.state;
      const nextState =
        currentState && typeof currentState === "object" ? currentState : {};
      window.history.replaceState(
        { ...nextState, [HISTORY_SCREEN_KEY]: "landing" },
        "",
        window.location.href,
      );
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, []);

  return (
    <NavContext.Provider value={{ active, goTo, user, signIn, signOut }}>
      {children}
    </NavContext.Provider>
  );
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
