"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminModal } from "@/components/admin-modal";
import { AdminSidebar } from "@/components/admin-sidebar";
import type { PrototypeData } from "@/domain/entities/prototype-data";

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

function ClientForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      await sendRequest("/api/admin/clients", "POST", { name, nationalId, phone });
      onSaved();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ocurrió un error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      title="Registrar cliente"
      subtitle="Agrega un nuevo propietario al directorio de Best Style."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="client-name">Nombre completo</label>
          <input
            id="client-name"
            type="text"
            placeholder="Laura Gómez"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="client-national-id">Cédula</label>
            <input
              id="client-national-id"
              type="text"
              placeholder="1.234.567"
              value={nationalId}
              onChange={(event) => setNationalId(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="client-phone">Teléfono</label>
            <input
              id="client-phone"
              type="tel"
              placeholder="300 000 0000"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
        </div>

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
            {saving ? "Guardando..." : "Registrar cliente"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}

export function GestionClientes({ data }: { data: PrototypeData }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  const clients = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return data.clients;

    return data.clients.filter((client) =>
      `${client.name} ${client.nationalId} ${client.phone}`.toLowerCase().includes(term),
    );
  }, [data.clients, query]);

  function handleSaved() {
    setCreating(false);
    router.refresh();
  }

  return (
    <section className="screen active" id="gestion-clientes">
      <div className="app-shell">
        <AdminSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Gestión de clientes</h1>
              <div className="sub">Consulta la información de los propietarios registrados.</div>
            </div>
          </div>
          <div className="panel">
            <div className="table-toolbar">
              <input
                className="search-input"
                placeholder="Buscar por nombre, cédula o teléfono..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setCreating(true)}
              >
                + Registrar cliente
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Cédula</th>
                  <th>Teléfono</th>
                  <th>Mascotas</th>
                  <th>Última cita</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div className="row-name">
                        <div className="row-avatar">{client.initials}</div>
                        {client.name}
                      </div>
                    </td>
                    <td>{client.nationalId || "—"}</td>
                    <td>{client.phone || "—"}</td>
                    <td>{client.petCount}</td>
                    <td>{client.lastAppointment || "—"}</td>
                    <td>
                      <button className="icon-btn" type="button">
                        →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {clients.length === 0 ? (
              <div className="table-empty">No encontramos clientes con esos datos.</div>
            ) : null}
          </div>
        </div>
      </div>

      {creating ? <ClientForm onClose={() => setCreating(false)} onSaved={handleSaved} /> : null}
    </section>
  );
}
