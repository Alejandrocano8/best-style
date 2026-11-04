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

type RegisterResponse = {
  user?: AuthenticatedUser;
  error?: string;
};

export function RegistroCliente() {
  const { goTo, signIn } = useNav();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone, email, password }),
      });

      const result = (await response.json()) as RegisterResponse;

      if (!response.ok || !result.user) {
        setError(result.error ?? "No pudimos crear tu cuenta. Intenta de nuevo.");
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
      id="registro-cliente"
      quote="Un solo registro y toda la información de tus mascotas queda en un mismo lugar."
      cardStyle={{ maxWidth: "420px" }}
    >
      <h1>Crea tu cuenta</h1>
      <p className="sub">Regístrate como propietario para gestionar tus mascotas y citas.</p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field-row">
          <div className="field">
            <label htmlFor="register-first-name">Nombres</label>
            <input
              id="register-first-name"
              type="text"
              placeholder="Laura"
              autoComplete="given-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="register-last-name">Apellidos</label>
            <input
              id="register-last-name"
              type="text"
              placeholder="Gómez"
              autoComplete="family-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="register-phone">Teléfono</label>
          <input
            id="register-phone"
            type="tel"
            placeholder="300 000 0000"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="register-email">Correo electrónico</label>
          <input
            id="register-email"
            type="email"
            placeholder="nombre@correo.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="register-password">Contraseña</label>
          <input
            id="register-password"
            type="password"
            placeholder="Crea una contraseña (mín. 8 caracteres)"
            autoComplete="new-password"
            minLength={8}
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
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
      <p className="auth-foot">
        ¿Ya tienes cuenta? <GotoLink to="login">Inicia sesión</GotoLink>
      </p>
    </AuthLayout>
  );
}
