"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminModal } from "@/components/admin-modal";
import { AdminSidebar } from "@/components/admin-sidebar";
import type { PrototypeData } from "@/domain/entities/prototype-data";
import type { Service } from "@/domain/entities/service";

type ModalState = { mode: "create" } | { mode: "edit"; service: Service } | null;

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

function ServiceForm({
  service,
  onClose,
  onSaved,
}: {
  service?: Service;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(service);
  const [name, setName] = useState(service?.name ?? "");
  const [icon, setIcon] = useState(service?.icon ?? "🛁");
  const [durationMinutes, setDurationMinutes] = useState(String(service?.durationMinutes ?? 30));
  const [price, setPrice] = useState(String(service?.price ?? 0));
  const [isActive, setIsActive] = useState(service?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    const payload = {
      name,
      icon,
      durationMinutes: Number(durationMinutes),
      price: Number(price),
      isActive,
    };

    try {
      if (isEdit && service) {
        await sendRequest(`/api/admin/services/${service.id}`, "PATCH", payload);
      } else {
        await sendRequest("/api/admin/services", "POST", payload);
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
      title={isEdit ? "Editar servicio" : "Nuevo servicio"}
      subtitle={
        isEdit
          ? "Actualiza la información del servicio."
          : "Agrega un nuevo servicio al catálogo de Best Style."
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="field-row">
          <div className="field">
            <label htmlFor="service-name">Nombre</label>
            <input
              id="service-name"
              type="text"
              placeholder="Baño"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="service-icon">Icono</label>
            <input
              id="service-icon"
              type="text"
              placeholder="🛁"
              maxLength={4}
              value={icon}
              onChange={(event) => setIcon(event.target.value)}
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="service-duration">Duración (min)</label>
            <input
              id="service-duration"
              type="number"
              min={1}
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="service-price">Precio</label>
            <input
              id="service-price"
              type="number"
              min={0}
              step={1000}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
            />
          </div>
        </div>

        <label className="check-row" htmlFor="service-active">
          <input
            id="service-active"
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
          />
          Servicio activo (disponible para agendar)
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
            {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear servicio"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}

export function GestionServicios({ data }: { data: PrototypeData }) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function toggleActive(service: Service) {
    setActionError(null);

    try {
      await sendRequest(`/api/admin/services/${service.id}`, "PATCH", {
        isActive: !service.isActive,
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

  return (
    <section className="screen active" id="gestion-servicios">
      <div className="app-shell">
        <AdminSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Gestión de servicios</h1>
              <div className="sub">Administra los servicios que ofrece Best Style.</div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setModal({ mode: "create" })}
            >
              + Nuevo servicio
            </button>
          </div>
          <div className="panel">
            {actionError ? (
              <div className="auth-error" role="alert" style={{ marginBottom: "16px" }}>
                {actionError}
              </div>
            ) : null}
            <table className="data-table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Duración estimada</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="row-name">
                        <div className="row-avatar">{service.icon}</div>
                        {service.name}
                      </div>
                    </td>
                    <td>{service.durationMinutes} min</td>
                    <td>${service.price.toLocaleString("es-CO")}</td>
                    <td>
                      <button
                        type="button"
                        className={`toggle${service.isActive ? "" : " off"}`}
                        onClick={() => void toggleActive(service)}
                        aria-label={service.isActive ? "Desactivar servicio" : "Activar servicio"}
                        title={service.isActive ? "Desactivar" : "Activar"}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => setModal({ mode: "edit", service })}
                        aria-label={`Editar ${service.name}`}
                      >
                        ✎
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal ? (
        <ServiceForm
          service={modal.mode === "edit" ? modal.service : undefined}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      ) : null}
    </section>
  );
}
