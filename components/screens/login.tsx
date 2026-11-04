"use client";

import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/auth-layout";
import {
  GotoLink,
  consumePendingScreen,
  defaultScreenForRole,
  useNav,
} from "@/components/nav-context";
import type { AuthenticatedUser } from "@/domain/entities/auth-user";
import type { UserRole } from "@/domain/entities/user";

const ROLES: UserRole[] = ["Cliente", "Veterinario", "Administrador"];

type LoginResponse = {
  user?: AuthenticatedUser;
  error?: string;
};

export function Login() {
  const { goTo, signIn } = useNav();
  const [role, setRole] = useState<UserRole>("Cliente");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = (await response.json()) as LoginResponse;

      if (!response.ok || !result.user) {
        setError(result.error ?? "No pudimos iniciar sesión. Intenta de nuevo.");
        return;
      }

      signIn(result.user);
      goTo(consumePendingScreen() ?? defaultScreenForRole(result.user.role));
    } catch {
      setError("No pudimos conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      id="login"
      quote="Llevar el historial de cada mascota al día ya no depende de la memoria de nadie."
    >
      <h1>Inicia sesión</h1>
      <p className="sub">Accede según tu tipo de usuario para continuar.</p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="role-tabs">
          {ROLES.map((item) => (
            <button
              key={item}
              type="button"
              className={role === item ? "active" : ""}
              onClick={() => {
                setRole(item);
                setError(null);
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="field">
          <label htmlFor="login-email">Correo electrónico</label>
          <input
            id="login-email"
            type="email"
            placeholder="nombre@correo.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {error ? (
          <div className="auth-error" role="alert">
            {error}
          </div>
        ) : null}
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <p className="auth-foot">
        ¿No tienes cuenta? <GotoLink to="registro-cliente">Regístrate aquí</GotoLink>
      </p>
    </AuthLayout>
  );
}
