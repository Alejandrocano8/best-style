import { AuthLayout } from "@/components/auth-layout";
import { GotoLink } from "@/components/nav-context";

export function RegistroCliente() {
  return (
    <AuthLayout
      id="registro-cliente"
      quote="Un solo registro y toda la información de tus mascotas queda en un mismo lugar."
      cardStyle={{ maxWidth: "420px" }}
    >
      <h1>Crea tu cuenta</h1>
      <p className="sub">Regístrate como propietario para gestionar tus mascotas y citas.</p>
      <div className="field-row">
        <div className="field">
          <label>Nombres</label>
          <input type="text" placeholder="Laura" />
        </div>
        <div className="field">
          <label>Apellidos</label>
          <input type="text" placeholder="Gómez" />
        </div>
      </div>
      <div className="field">
        <label>Cédula</label>
        <input type="text" placeholder="1 234 567 890" />
      </div>
      <div className="field">
        <label>Teléfono</label>
        <input type="text" placeholder="300 000 0000" />
      </div>
      <div className="field">
        <label>Correo electrónico</label>
        <input type="email" placeholder="nombre@correo.com" />
      </div>
      <div className="field">
        <label>Contraseña</label>
        <input type="password" placeholder="Crea una contraseña" />
      </div>
      <GotoLink to="dashboard-cliente" className="btn btn-primary btn-block">
        Crear cuenta
      </GotoLink>
      <p className="auth-foot">
        ¿Ya tienes cuenta? <GotoLink to="login">Inicia sesión</GotoLink>
      </p>
    </AuthLayout>
  );
}
