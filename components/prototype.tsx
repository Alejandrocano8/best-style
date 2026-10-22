"use client";

import { NavProvider, useNav, type ScreenId } from "@/components/nav-context";
import { Landing } from "@/components/screens/landing";
import { Login } from "@/components/screens/login";
import { RegistroCliente } from "@/components/screens/registro-cliente";
import { DashboardCliente } from "@/components/screens/dashboard-cliente";
import { Mascotas } from "@/components/screens/mascotas";
import { RegistroMascota } from "@/components/screens/registro-mascota";
import { HistorialMascota } from "@/components/screens/historial-mascota";
import { AgendarCita } from "@/components/screens/agendar-cita";
import { MisCitas } from "@/components/screens/mis-citas";
import { DashboardAdmin } from "@/components/screens/dashboard-admin";
import { GestionCitas } from "@/components/screens/gestion-citas";
import { GestionClientes } from "@/components/screens/gestion-clientes";
import { GestionServicios } from "@/components/screens/gestion-servicios";
import { GestionUsuarios } from "@/components/screens/gestion-usuarios";

const SCREEN_LIST: { id: ScreenId; label: string }[] = [
  { id: "landing", label: "1. Landing" },
  { id: "login", label: "2. Login" },
  { id: "registro-cliente", label: "3. Registro cliente" },
  { id: "dashboard-cliente", label: "4. Dashboard cliente" },
  { id: "mascotas", label: "5. Mis mascotas" },
  { id: "registro-mascota", label: "6. Registro mascota" },
  { id: "historial-mascota", label: "7. Historial mascota" },
  { id: "agendar-cita", label: "8. Agendar cita" },
  { id: "mis-citas", label: "9. Mis citas" },
  { id: "dashboard-admin", label: "10. Panel admin" },
  { id: "gestion-citas", label: "11. Gestión citas" },
  { id: "gestion-clientes", label: "12. Gestión clientes" },
  { id: "gestion-servicios", label: "13. Gestión servicios" },
  { id: "gestion-usuarios", label: "14. Usuarios y roles" },
];

const SCREENS: Record<ScreenId, () => React.ReactElement> = {
  landing: Landing,
  login: Login,
  "registro-cliente": RegistroCliente,
  "dashboard-cliente": DashboardCliente,
  mascotas: Mascotas,
  "registro-mascota": RegistroMascota,
  "historial-mascota": HistorialMascota,
  "agendar-cita": AgendarCita,
  "mis-citas": MisCitas,
  "dashboard-admin": DashboardAdmin,
  "gestion-citas": GestionCitas,
  "gestion-clientes": GestionClientes,
  "gestion-servicios": GestionServicios,
  "gestion-usuarios": GestionUsuarios,
};

function DemoBar() {
  const { active, goTo } = useNav();
  return (
    <div id="demo-bar">
      <span className="demo-label">Prototipo · ir a pantalla</span>
      {SCREEN_LIST.map((s) => (
        <button
          key={s.id}
          data-target={s.id}
          className={active === s.id ? "active" : ""}
          onClick={() => goTo(s.id)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

function PrototypeScreens() {
  const { active } = useNav();
  const Screen = SCREENS[active];
  return <Screen />;
}

export function Prototype() {
  return (
    <NavProvider>
      <DemoBar />
      <PrototypeScreens />
    </NavProvider>
  );
}
