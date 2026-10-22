import { AuthLayout } from "@/components/auth-layout";
import { GotoLink } from "@/components/nav-context";

export function Login() {
  return (
    <AuthLayout id="login" quote="Llevar el historial de cada mascota al día ya no depende de la memoria de nadie.">
      <h1>Inicia sesión</h1>
      <p className="sub">Accede según tu tipo de usuario para continuar.</p>
      <div className="role-tabs">
        <button className="active">Cliente</button>
        <button>Veterinario</button>
        <button>Administrador</button>
      </div>
      <div className="field">
        <label>Correo electrónico</label>
        <input type="email" placeholder="nombre@correo.com" />
      </div>
      <div className="field">
        <label>Contraseña</label>
        <input type="password" placeholder="••••••••" />
      </div>
      <GotoLink to="dashboard-cliente" className="btn btn-primary btn-block">
        Ingresar
      </GotoLink>
      <p className="auth-foot">
        ¿No tienes cuenta?{" "}
        <GotoLink to="registro-cliente">Regístrate aquí</GotoLink>
      </p>
    </AuthLayout>
  );
}
