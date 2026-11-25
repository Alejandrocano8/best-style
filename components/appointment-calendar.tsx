"use client";

import { useMemo } from "react";
import type { AppointmentStatus } from "@/domain/entities/appointment";

export type CalendarAppointment = {
  id: string;
  dateIso: string;
  time: string;
  label: string;
  status: AppointmentStatus;
};

type CalendarCell = {
  iso: string;
  day: number;
  inMonth: boolean;
};

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const STATUS_CLASS: Record<AppointmentStatus, string> = {
  pending: "cal-event-pending",
  confirmed: "cal-event-confirmed",
  completed: "cal-event-done",
  cancelled: "cal-event-cancelled",
};

function shiftMonth(month: string, delta: number): string {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function toIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function todayIso(): string {
  return toIso(new Date());
}

function buildCells(month: string): CalendarCell[] {
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDay = new Date(year, monthNumber - 1, 1);
  const start = new Date(year, monthNumber - 1, 1 - ((firstDay.getDay() + 6) % 7));

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      iso: toIso(date),
      day: date.getDate(),
      inMonth: date.getMonth() === monthNumber - 1,
    };
  });
}

function monthLabel(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(
    new Date(year, monthNumber - 1, 1),
  );
}

export function AppointmentCalendar({
  appointments,
  month,
  onMonthChange,
  selectedDate,
  onSelectDate,
  onSelectAppointment,
}: {
  appointments: CalendarAppointment[];
  month: string;
  onMonthChange: (month: string) => void;
  selectedDate?: string | null;
  onSelectDate?: (date: string | null) => void;
  onSelectAppointment?: (id: string) => void;
}) {
  const cells = useMemo(() => buildCells(month), [month]);
  const byDate = useMemo(() => {
    const grouped = new Map<string, CalendarAppointment[]>();
    for (const appointment of appointments) {
      const list = grouped.get(appointment.dateIso) ?? [];
      list.push(appointment);
      grouped.set(appointment.dateIso, list);
    }
    for (const list of grouped.values()) {
      list.sort((a, b) => a.time.localeCompare(b.time));
    }
    return grouped;
  }, [appointments]);

  const today = todayIso();

  return (
    <div className="calendar-widget">
      <div className="calendar-head">
        <div className="calendar-nav">
          <button
            type="button"
            className="icon-btn"
            aria-label="Mes anterior"
            onClick={() => onMonthChange(shiftMonth(month, -1))}
          >
            ‹
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Mes siguiente"
            onClick={() => onMonthChange(shiftMonth(month, 1))}
          >
            ›
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onMonthChange(today.slice(0, 7))}
          >
            Hoy
          </button>
        </div>
        <strong className="calendar-title">{monthLabel(month)}</strong>
      </div>
      <div className="cal-grid">
        {WEEK_DAYS.map((day) => (
          <div className="cal-day-head" key={day}>
            {day}
          </div>
        ))}
        {cells.map((cell) => {
          const items = byDate.get(cell.iso) ?? [];
          return (
            <button
              type="button"
              key={cell.iso}
              className={`cal-cell${cell.inMonth ? "" : " outside"}${
                cell.iso === today ? " today" : ""
              }${cell.iso === selectedDate ? " selected" : ""}`}
              onClick={() => onSelectDate?.(selectedDate === cell.iso ? null : cell.iso)}
            >
              <span className="cal-day-number">{cell.day}</span>
              {items.slice(0, 2).map((item) => (
                <span
                  key={item.id}
                  className={`cal-event ${STATUS_CLASS[item.status]}`}
                  title={`${item.time} · ${item.label}`}
                  onClick={(event) => {
                    if (!onSelectAppointment) return;
                    event.stopPropagation();
                    onSelectAppointment(item.id);
                  }}
                >
                  {item.time} {item.label}
                </span>
              ))}
              {items.length > 2 ? (
                <span className="cal-more">+{items.length - 2} más</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
