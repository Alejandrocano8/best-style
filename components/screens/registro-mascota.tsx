import { ClientSidebar } from "@/components/client-sidebar";
import { GotoLink } from "@/components/nav-context";

export function RegistroMascota() {
  return (
    <section className="screen active" id="registro-mascota">
      <div className="app-shell">
        <ClientSidebar />
        <div className="main-area">
          <div className="topbar">
            <div>
              <h1>Registrar mascota</h1>
              <div className="sub">Asocia una nueva mascota a tu perfil.</div>
            </div>
          </div>
          <div className="form-card">
            <h3>Datos de la mascota</h3>
            <p className="sub">Esta información se usará en su historial y para las citas.</p>
            <div className="field">
              <label>Nombre de la mascota</label>
              <input type="text" placeholder="Ej: Rocky" />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Especie</label>
                <select defaultValue="Perro">
                  <option>Perro</option>
                  <option>Gato</option>
                  <option>Otro</option>
                </select>
              </div>
              <div className="field">
                <label>Raza</label>
                <input type="text" placeholder="Ej: Labrador" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Sexo</label>
                <select defaultValue="Macho">
                  <option>Macho</option>
                  <option>Hembra</option>
                </select>
              </div>
              <div className="field">
                <label>Fecha de nacimiento</label>
                <input type="date" />
              </div>
            </div>
            <div className="field">
              <label>Observaciones (alergias, condiciones especiales)</label>
              <textarea rows={3} placeholder="Opcional"></textarea>
            </div>
            <div className="form-actions">
              <GotoLink to="mascotas" className="btn btn-primary">
                Guardar mascota
              </GotoLink>
              <GotoLink to="mascotas" className="btn btn-ghost">
                Cancelar
              </GotoLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
