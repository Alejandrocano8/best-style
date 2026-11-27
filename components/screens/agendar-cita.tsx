"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ClientSidebar } from "@/components/client-sidebar";
import {
  CalendarIcon,
  CalendarPlusIcon,
  CheckIcon,
  ClockIcon,
  PawIcon,
  PetIcon,
  PlusCircleIcon,
  ServiceIcon,
  SparklesIcon,
} from "@/components/icons";
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

  const hasPet = Boolean(petDisplayName);
  const hasService = Boolean(service);
  const hasDateTime = Boolean(date && time);
  const step1State = hasPet ? "done" : "current";
  const step2State = hasService ? "done" : hasPet ? "current" : "";
  const step3State = hasDateTime ? "done" : hasPet && hasService ? "current" : "";
  const step4State = hasPet && hasService && hasDateTime ? "current" : "";

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
            <div className={`step-item ${step1State}`}>
              <div className="step-circle">{hasPet ? <CheckIcon size={14} /> : "1"}</div>
              <div className="step-label">Mascota</div>
            </div>
            <div className="step-line"></div>
            <div className={`step-item ${step2State}`}>
              <div className="step-circle">{hasService ? <CheckIcon size={14} /> : "2"}</div>
              <div className="step-label">Servicio</div>
            </div>
            <div className="step-line"></div>
            <div className={`step-item ${step3State}`}>
              <div className="step-circle">{hasDateTime ? <CheckIcon size={14} /> : "3"}</div>
              <div className="step-label">Fecha y hora</div>
            </div>
            <div className="step-line"></div>
            <div className={`step-item ${step4State}`}>
              <div className="step-circle">4</div>
              <div className="step-label">Confirmar</div>
            </div>
          </div>

          <form className="booking-layout" onSubmit={handleSubmit} noValidate>
            <div className="booking-form-col">
              <div className="panel booking-section">
                <div className="booking-section-head">
                  <div className="booking-section-icon">
                    <PawIcon size={18} />
                  </div>
                  <div>
                    <h3>1. Elige la mascota</h3>
                    <p>Selecciona una mascota registrada o escribe el nombre de otra.</p>
                  </div>
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
                      <div className="ic">
                        <PetIcon icon={item.icon} species={item.species} name={item.name} size={22} />
                      </div>
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
                    <div className="ic">
                      <PlusCircleIcon size={22} />
                    </div>
                    <div className="name">Otra mascota</div>
                    <div className="price">Escribe el nombre</div>
                  </button>
                </div>

                {showManualPet ? (
                  <div className="field" style={{ maxWidth: "340px", marginBottom: 0 }}>
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
              </div>

              <div className="panel booking-section">
                <div className="booking-section-head">
                  <div className="booking-section-icon">
                    <SparklesIcon size={18} />
                  </div>
                  <div>
                    <h3>2. Elige el servicio</h3>
                    <p>Selecciona el tratamiento ideal para el cuidado de tu mascota.</p>
                  </div>
                </div>

                <div className="pick-grid">
                  {services.map((item) => (
                    <button
                      type="button"
                      className={`pick-card${item.id === serviceId ? " selected" : ""}`}
                      key={item.id}
                      onClick={() => setServiceId(item.id)}
                    >
                      <div className="ic">
                        <ServiceIcon icon={item.icon} name={item.name} size={22} />
                      </div>
                      <div className="name">{item.name}</div>
                      <div className="price">${item.price.toLocaleString("es-CO")}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="panel booking-section" style={{ marginBottom: 0 }}>
                <div className="booking-section-head">
                  <div className="booking-section-icon">
                    <CalendarIcon size={18} />
                  </div>
                  <div>
                    <h3>3. Fecha y hora disponible</h3>
                    <p>Escoge el día y un horario libre para tu cita.</p>
                  </div>
                </div>

                <div className="booking-datetime-row">
                  <div className="field" style={{ maxWidth: "240px", marginBottom: 0 }}>
                    <label htmlFor="booking-date">Fecha de la cita</label>
                    <input
                      id="booking-date"
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

                  <div className="booking-slots-wrap">
                    <label className="booking-slots-label">
                      <ClockIcon size={14} />
                      <span>Horarios disponibles</span>
                    </label>
                    <div className="time-grid">
                      {TIME_SLOTS.map((slot) => {
                        const taken = bookedTimes.includes(slot.value);
                        return (
                          <button
                            type="button"
                            key={slot.value}
                            disabled={taken}
                            className={`time-slot${taken ? " taken" : ""}${time === slot.value ? " selected" : ""
                              }`}
                            onClick={() => setTime(slot.value)}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="booking-summary-card">
              <div className="booking-summary-head">
                <div className="booking-summary-icon">
                  <CalendarPlusIcon size={20} />
                </div>
                <div>
                  <h3>Resumen de tu cita</h3>
                  <span>Revisa los detalles antes de confirmar</span>
                </div>
              </div>

              <div className="booking-summary-list">
                <div className="booking-summary-item">
                  <span className="label">Mascota</span>
                  <span className="value">{petDisplayName || "Por definir"}</span>
                </div>
                <div className="booking-summary-item">
                  <span className="label">Servicio</span>
                  <span className="value">{service?.name ?? "Por definir"}</span>
                </div>
                <div className="booking-summary-item">
                  <span className="label">Fecha</span>
                  <span className="value">{dateLabel(date)}</span>
                </div>
                <div className="booking-summary-item">
                  <span className="label">Hora</span>
                  <span className="value">{timeLabel}</span>
                </div>
              </div>

              <div className="booking-summary-total">
                <span>Total estimado</span>
                <b>${(service?.price ?? 0).toLocaleString("es-CO")}</b>
              </div>

              {error ? (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              ) : null}

              <div className="booking-summary-actions">
                <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
                  {saving ? "Agendando..." : "Confirmar cita"}
                </button>
                <GotoLink to="mascotas" className="btn btn-ghost btn-block">
                  Cancelar
                </GotoLink>
              </div>
            </aside>
          </form>
        </div>
      </div>
    </section>
  );
}
