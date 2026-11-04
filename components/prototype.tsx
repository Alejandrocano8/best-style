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
import type { AuthenticatedUser } from "@/domain/entities/auth-user";
import type { PrototypeData } from "@/domain/entities/prototype-data";

const SCREENS: Record<ScreenId, React.ComponentType<{ data: PrototypeData }>> = {
  landing: () => <Landing />,
  login: () => <Login />,
  "registro-cliente": () => <RegistroCliente />,
  "dashboard-cliente": ({ data }) => <DashboardCliente data={data} />,
  mascotas: ({ data }) => <Mascotas data={data} />,
  "registro-mascota": () => <RegistroMascota />,
  "historial-mascota": ({ data }) => <HistorialMascota data={data} />,
  "agendar-cita": ({ data }) => <AgendarCita data={data} />,
  "mis-citas": ({ data }) => <MisCitas data={data} />,
  "dashboard-admin": ({ data }) => <DashboardAdmin data={data} />,
  "gestion-citas": ({ data }) => <GestionCitas data={data} />,
  "gestion-clientes": ({ data }) => <GestionClientes data={data} />,
  "gestion-servicios": ({ data }) => <GestionServicios data={data} />,
  "gestion-usuarios": ({ data }) => <GestionUsuarios data={data} />,
};

function PrototypeScreens({ data }: { data: PrototypeData }) {
  const { active } = useNav();
  const Screen = SCREENS[active];
  return <Screen data={data} />;
}

export function Prototype({
  data,
  initialUser,
}: {
  data: PrototypeData;
  initialUser: AuthenticatedUser | null;
}) {
  return (
    <NavProvider initialUser={initialUser}>
      <PrototypeScreens data={data} />
    </NavProvider>
  );
}
