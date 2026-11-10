"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminModal } from "@/components/admin-modal";
import { AdminSidebar } from "@/components/admin-sidebar";
import type { User, UserRole } from "@/domain/entities/user";
import type { PrototypeData } from "@/domain/entities/prototype-data";

const ROLE_CLASS = {
  Administrador: "role-admin",
  Veterinario: "role-vet",
  Cliente: "role-cliente",
} as const;

const ROLES: UserRole[] = ["Cliente", "Veterinario", "Administrador"];

const FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "Cliente", label: "Clientes" },
  { id: "Veterinario", label: "Veterinarios" },
  { id: "Administrador", label: "Administradores" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

type ModalState = { mode: "create" } | { mode: "edit"; user: User } | null;

async function sendRequest(url: string, method: string, body: unknown) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = (await response.json().catch(() => ({}))) as { error?: string };

  if (!response.ok) {
    throw new Error(result.error ?? "No pudimos completar la operación.");
  }
}

function UserForm({
  user,
  onClose,
  onSaved,
}: {
  user?: User;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(user);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(user?.role ?? "Cliente");
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      if (isEdit && user) {
        await sendRequest(`/api/admin/users/${user.id}`, "PATCH", {
          name,
          email,
          password: password ? password : undefined,
          role,
          isActive,
        });
      } else {
        await sendRequest("/api/admin/users", "POST", { name, email, password, role, isActive });
      }

      onSaved();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ocurrió un error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      title={isEdit ? "Editar usuario" : "Nuevo usuario"}
      subtitle={
        isEdit
          ? "Actualiza nombre, correo, contraseña, rol y estado de acceso de esta cuenta."
          : "Crea una cuenta con acceso al sistema y define su rol."
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="user-name">Nombre completo</label>
          <input
            id="user-name"
            type="text"
            placeholder="Carlos Peña"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="user-email">Correo electrónico</label>
          <input
            id="user-email"
            type="email"
            placeholder="usuario@beststyle.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="user-password">
            Contraseña{isEdit ? " (opcional)" : ""}
          </label>
          <input
            id="user-password"
            type="password"
            placeholder={isEdit ? "Dejar en blanco para no cambiar" : "Mínimo 8 caracteres"}
            minLength={isEdit ? undefined : 8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required={!isEdit}
          />
        </div>

        <div className="field">
          <label htmlFor="user-role">Rol</label>
          <select
            id="user-role"
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
          >
            {ROLES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <label className="check-row" htmlFor="user-active">
          <input
            id="user-active"
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
          />
          Cuenta activa (puede iniciar sesión)
        </label>

        {error ? (
          <div className="auth-error" role="alert">
            {error}
          </div>
        ) : null}

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
            {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear usuario"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}

export function GestionUsuarios({ data }: { data: PrototypeData }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("todos");
  const [modal, setModal] = useState<ModalState>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const users = useMemo(() => {
    const term = query.trim().toLowerCase();

    return data.users.filter((user) => {
      const matchesFilter = filter === "todos" || user.role === filter;
      const matchesQuery =
        !term || `${user.name} ${user.email}`.toLowerCase().includes(term);
      return matchesFilter && matchesQuery;
    });
  }, [data.users, filter, query]);

  async function toggleActive(user: User) {
    setActionError(null);

    try {
      await sendRequest(`/api/admin/users/${user.id}`, "PATCH", {
        isActive: !user.isActive,
      });
      router.refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Ocurrió un error.");
    }
  }

  function handleSaved() {
    setModal(null);
    router.refresh();
  }

  async function deleteUser(user: User) {
    if (!window.confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`)) {
      return;
    }

    setActionError(null);

    try {
      await sendRequest(`/api/admin/users/${user.id}`, "DELETE", {});
      router.refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Ocurrió un error.");
    }
  }

  return (
    <section className="screen active" id="gestion-usuarios">
      <div className="app-shell">
        <AdminSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Usuarios y roles</h1>
              <div className="sub">Gestiona quién puede acceder al sistema y con qué permisos.</div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setModal({ mode: "create" })}
            >
              + Nuevo usuario
            </button>
          </div>
          <div className="panel">
            <div className="table-toolbar">
              <div className="filter-pills">
                {FILTERS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`filter-pill${filter === item.id ? " active" : ""}`}
                    onClick={() => setFilter(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <input
                className="search-input"
                placeholder="Buscar usuario..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            {actionError ? (
              <div className="auth-error" role="alert" style={{ marginBottom: "16px" }}>
                {actionError}
              </div>
            ) : null}

            <table className="data-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="row-name">
                        <div className="row-avatar">{user.initials}</div>
                        {user.name}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-pill ${ROLE_CLASS[user.role]}`}>{user.role}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`toggle${user.isActive ? "" : " off"}`}
                        onClick={() => void toggleActive(user)}
                        aria-label={user.isActive ? "Desactivar usuario" : "Activar usuario"}
                        title={user.isActive ? "Desactivar" : "Activar"}
                      />
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => setModal({ mode: "edit", user })}
                          aria-label={`Editar ${user.name}`}
                          title="Editar"
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="icon-btn danger"
                          onClick={() => void deleteUser(user)}
                          aria-label={`Eliminar ${user.name}`}
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 ? (
              <div className="table-empty">No encontramos usuarios con esos filtros.</div>
            ) : null}
          </div>
        </div>
      </div>

      {modal ? (
        <UserForm
          user={modal.mode === "edit" ? modal.user : undefined}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      ) : null}
    </section>
  );
}
