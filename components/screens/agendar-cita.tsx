"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ClientSidebar } from "@/components/client-sidebar";
import { CheckIcon, PetIcon, PlusCircleIcon, ServiceIcon } from "@/components/icons";
import { GotoLink, useAuth, useNav } from "@/components/nav-context";
import type { PrototypeData } from "@/domain/entities/prototype-data";

const TIME_SLOTS = [
  { value: "08:00", label: "8:00 am" },
  { value: "09:00", label: "9:00 am" },
  { value: "10:00", label: "10:00 am" },
  { value: "11:00", label: "11:00 am" },
  { value: "14:00", label: "2:00 pm" },
  { value: "15:00", label: "3:00 pm" },
  { value: "16:00", label: "4:00 pm" },
];

function localIso(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function dateLabel(date: string): string {
  if (!date) return "Sin definir";
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" }).format(
    new Date(`${date}T12:00:00`),
  );
}

type AvailabilityResponse = {
  client?: { id: string; name: string };
  bookedTimes?: string[];
  today?: string;
  error?: string;
};

export function AgendarCita({ data }: { data: PrototypeData }) {
  const router = useRouter();
  const { user } = useAuth();
  const { goTo } = useNav();

  const [clientId, setClientId] = useState<string | null>(null);

  const pets = useMemo(
    () =>
      data.pets.filter((pet) =>
        clientId ? pet.ownerId === clientId : pet.ownerName === user?.name,
      ),
    [data.pets, clientId, user?.name],
  );
  const services = useMemo(() => data.services.filter((service) => service.isActive), [
    data.services,
  ]);

  const [petId, setPetId] = useState(pets[0]?.id ?? "");
  const [manualPet, setManualPet] = useState(false);
  const [petNameManual, setPetNameManual] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [date, setDate] = useState(localIso);
  const [time, setTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [today, setToday] = useState(localIso);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!manualPet && pets.length > 0 && !pets.some((item) => item.id === petId)) {
      setPetId(pets[0].id);
    }
  }, [pets, petId, manualPet]);

  useEffect(() => {
    let active = true;

    async function loadAvailability() {
      try {
        const response = await fetch(`/api/client/appointments?date=${date}`, {
          cache: "no-store",
        });
        const result = (await response.json()) as AvailabilityResponse;

        if (!active) return;
        if (!response.ok) {
          setError(result.error ?? "No pudimos cargar la disponibilidad.");
          return;
        }

        setBookedTimes(result.bookedTimes ?? []);
        setToday(result.today ?? localIso());
        if (result.client) setClientId(result.client.id);
      } catch {
        if (active) setError("No pudimos conectar con el servidor.");
      }
    }

    void loadAvailability();
    return () => {
      active = false;
    };
  }, [date]);

  const pet = pets.find((item) => item.id === petId);
  const service = services.find((item) => item.id === serviceId);
  const showManualPet = manualPet || pets.length === 0;
  const petDisplayName = pet?.name ?? petNameManual.trim();
  const timeLabel = TIME_SLOTS.find((slot) => slot.value === time)?.label ?? "Sin definir";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    if (!petDisplayName || !service || !time) {
      setError("Indica la mascota, el servicio y la hora de la cita.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/client/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petId: pet?.id ?? null,
          petName: petDisplayName,
          serviceId: service.id,
          date,
          time,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "No pudimos agendar la cita.");
      }

      router.refresh();
      goTo("mis-citas");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ocurrió un error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="screen active" id="agendar-cita">
      <div className="app-shell">
        <ClientSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Agendar cita</h1>
              <div className="sub">Sigue los pasos para reservar la atención de tu mascota.</div>
            </div>
          </div>

          <div className="steps-bar">
            <div className="step-item done">
              <div className="step-circle"><CheckIcon size={14} /></div>
              <div className="step-label">Mascota</div>
            </div>
            <div className="step-line"></div>
            <div className="step-item done">
              <div className="step-circle"><CheckIcon size={14} /></div>
              <div className="step-label">Servicio</div>
            </div>
            <div className="step-line"></div>
            <div className="step-item current">
              <div className="step-circle">3</div>
              <div className="step-label">Fecha y hora</div>
            </div>
            <div className="step-line"></div>
            <div className="step-item">
              <div className="step-circle">4</div>
              <div className="step-label">Confirmar</div>
            </div>
          </div>

          <form className="panel" style={{ maxWidth: "640px" }} onSubmit={handleSubmit} noValidate>
            <div className="panel-head">
              <h3>Elige la mascota</h3>
            </div>
            <div className="pick-grid">
              {pets.map((item) => (
                <button
                  type="button"
                  className={`pick-card${!manualPet && item.id === petId ? " selected" : ""}`}
                  key={item.id}
                  onClick={() => {
                    setPetId(item.id);
                    setManualPet(false);
                  }}
                >
                  <div className="ic"><PetIcon icon={item.icon} species={item.species} name={item.name} size={22} /></div>
                  <div className="name">{item.name}</div>
                  <div className="price">{item.breed}</div>
                </button>
              ))}
              <button
                type="button"
                className={`pick-card${showManualPet ? " selected" : ""}`}
                onClick={() => {
                  setManualPet(true);
                  setPetId("");
                }}
              >
                <div className="ic"><PlusCircleIcon size={20} /></div>
                <div className="name">Otra mascota</div>
                <div className="price">Escribe el nombre</div>
              </button>
            </div>
            {showManualPet ? (
              <div className="field" style={{ maxWidth: "320px", marginBottom: "26px" }}>
                <label htmlFor="manual-pet-name">Nombre de la mascota</label>
                <input
                  id="manual-pet-name"
                  type="text"
                  placeholder="Ej. Toby"
                  value={petNameManual}
                  onChange={(event) => setPetNameManual(event.target.value)}
                />
              </div>
            ) : null}

            <div className="panel-head">
              <h3>Elige el servicio</h3>
            </div>
            <div className="pick-grid">
              {services.map((item) => (
                <button
                  type="button"
                  className={`pick-card${item.id === serviceId ? " selected" : ""}`}
                  key={item.id}
                  onClick={() => setServiceId(item.id)}
                >
                  <div className="ic"><ServiceIcon icon={item.icon} name={item.name} size={22} /></div>
                  <div className="name">{item.name}</div>
                  <div className="price">${item.price.toLocaleString("es-CO")}</div>
                </button>
              ))}
            </div>

            <div className="panel-head">
              <h3>Elige fecha</h3>
            </div>
            <div className="field" style={{ maxWidth: "220px" }}>
              <input
                type="date"
                value={date}
                min={today}
                onChange={(event) => {
                  setDate(event.target.value);
                  setTime("");
                }}
                required
              />
            </div>

            <div className="panel-head" style={{ marginTop: "6px" }}>
              <h3>Horas disponibles</h3>
            </div>
            <div className="time-grid">
              {TIME_SLOTS.map((slot) => {
                const taken = bookedTimes.includes(slot.value);
                return (
                  <button
                    type="button"
                    key={slot.value}
                    disabled={taken}
                    className={`time-slot${taken ? " taken" : ""}${
                      time === slot.value ? " selected" : ""
                    }`}
                    onClick={() => setTime(slot.value)}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>

            <div className="summary-box">
              <div className="summary-row">
                <span>
                  {petDisplayName || "Sin mascota"} · {service?.name ?? "Sin servicio"}
                </span>
                <span>
                  {dateLabel(date)}, {timeLabel}
                </span>
              </div>
              <div className="summary-row total">
                <span>Total estimado</span>
                <span>${(service?.price ?? 0).toLocaleString("es-CO")}</span>
              </div>
            </div>

            {error ? (
              <div className="auth-error" role="alert">
                {error}
              </div>
            ) : null}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Agendando..." : "Confirmar cita"}
              </button>
              <GotoLink to="mascotas" className="btn btn-ghost">
                Cancelar
              </GotoLink>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
