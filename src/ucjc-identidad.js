const EVENT_NAME = 'ucjc:identidad:sesion-cambiada@1';
const DEMO_USER = {
  id: 'u-123',
  email: 'ana@alumno.ucjc.edu',
  nombre: 'Ana Pérez',
};
const DEMO_PASSWORD = 'ucjc2026';

class UcjcIdentidad extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.usuario = null;
    this.modo = 'login';

    this.shadowRoot.addEventListener('click', (event) => {
      const boton = event.target.closest('[data-modo]');
      if (boton) {
        this.modo = boton.dataset.modo;
        this.render();
      }

      if (event.target.closest('[data-accion="cerrar-sesion"]')) {
        this.usuario = null;
        this.render();
        this.emitirCambioSesion();
      }

      if (event.target.closest('[data-accion="demo-rapida"]')) {
        this.usuario = { ...DEMO_USER };
        this.render();
        this.emitirCambioSesion();
      }
    });

    this.shadowRoot.addEventListener('submit', (event) => {
      event.preventDefault();
      const formulario = event.target;
      const datos = new FormData(formulario);

      if (formulario.dataset.formulario === 'login') {
        const email = String(datos.get('email')).trim().toLowerCase();
        const password = String(datos.get('password'));
        if (email !== DEMO_USER.email || password !== DEMO_PASSWORD) {
          this.mostrarError('login', 'Revisa el correo y la contraseña de prueba.');
          return;
        }

        this.usuario = { ...DEMO_USER };
      } else {
        const nombre = String(datos.get('nombre')).trim();
        const email = String(datos.get('email')).trim().toLowerCase();
        this.usuario = {
          id: `u-demo-${Date.now()}`,
          email,
          nombre,
        };
      }

      this.render();
      this.emitirCambioSesion();
    });
  }

  connectedCallback() {
    this.render();
    this.emitirCambioSesion();
  }

  emitirCambioSesion() {
    this.dispatchEvent(new CustomEvent(EVENT_NAME, {
      bubbles: true,
      composed: true,
      detail: {
        autenticado: this.usuario !== null,
        usuario: this.usuario ? { ...this.usuario } : null,
        momento: new Date().toISOString(),
      },
    }));
  }

  mostrarError(formulario, mensaje) {
    const error = this.shadowRoot.querySelector(`[data-error="${formulario}"]`);
    error.textContent = mensaje;
  }

  render() {
    const styles = `
      :host { display: block; color: #17213a; font: 16px/1.5 system-ui, sans-serif; }
      * { box-sizing: border-box; }
      .card { max-width: 760px; margin: 32px auto; padding: 32px; border: 1px solid #dfe5ef; border-radius: 20px; background: #fff; box-shadow: 0 16px 48px #13254a12; }
      .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
      .mark { display: grid; width: 44px; height: 44px; place-items: center; border-radius: 14px; background: #102b69; color: #fff; font-weight: 800; }
      .eyebrow { margin: 0; color: #63718c; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
      h1, h2, p { margin-top: 0; }
      h1 { margin-bottom: 0; font-size: 22px; }
      h2 { margin-bottom: 8px; font-size: 26px; letter-spacing: -.03em; }
      .intro { margin-bottom: 24px; color: #63718c; }
      .tabs { display: flex; gap: 8px; margin-bottom: 22px; padding: 5px; border-radius: 12px; background: #f0f3f8; }
      button { min-height: 44px; padding: 10px 16px; border: 0; border-radius: 10px; background: transparent; color: inherit; cursor: pointer; font: inherit; font-weight: 700; }
      button:focus-visible, input:focus-visible { outline: 3px solid #779bff; outline-offset: 2px; }
      .tabs button { flex: 1; color: #63718c; }
      .tabs button[aria-selected="true"] { background: white; color: #102b69; box-shadow: 0 2px 8px #13254a12; }
      form { display: grid; gap: 14px; }
      label { display: grid; gap: 6px; font-size: 14px; font-weight: 700; }
      input { width: 100%; min-height: 46px; padding: 10px 12px; border: 1px solid #cbd4e2; border-radius: 10px; color: inherit; font: inherit; }
      .primary { width: 100%; margin-top: 6px; background: #102b69; color: #fff; }
      .primary:hover { background: #193d88; }
      .demo { width: 100%; border: 1px solid #cbd4e2; background: #fff; color: #102b69; }
      .hint { margin: 16px 0 0; padding: 12px 14px; border-radius: 10px; background: #f2f6ff; color: #435474; font-size: 13px; }
      .error { min-height: 20px; margin: 0; color: #b42318; font-size: 14px; }
      [hidden] { display: none !important; }
      .session { display: grid; gap: 8px; padding: 20px; border-radius: 14px; background: #f4f7fc; }
      .session p { margin: 0; color: #63718c; }
      .session strong { color: #17213a; }
      .logout { justify-self: start; margin-top: 12px; border: 1px solid #cbd4e2; background: #fff; }
      @media (max-width: 600px) { .card { margin: 16px; padding: 22px; } }
    `;

    const content = this.usuario
      ? `
        <section class="session" aria-live="polite">
          <p class="eyebrow">Sesión iniciada</p>
          <h2>Hola, ${this.escapeHtml(this.usuario.nombre || this.usuario.email)}</h2>
          <p>${this.escapeHtml(this.usuario.email)}</p>
          <button class="logout" type="button" data-accion="cerrar-sesion">Cerrar sesión</button>
        </section>`
      : `
        <h2>Tu cuenta UCJC</h2>
        <p class="intro">Accede o crea una cuenta. Esta demo funciona sin servidor y no guarda contraseñas.</p>
        <div class="tabs" role="tablist" aria-label="Acceso a Identidad">
          <button type="button" role="tab" data-modo="login" aria-selected="${this.modo === 'login'}">Iniciar sesión</button>
          <button type="button" role="tab" data-modo="registro" aria-selected="${this.modo === 'registro'}">Registrarme</button>
        </div>
        <form data-formulario="login" ${this.modo !== 'login' ? 'hidden' : ''}>
          <label>Correo electrónico
            <input name="email" type="email" autocomplete="username" value="${DEMO_USER.email}" required>
          </label>
          <label>Contraseña
            <input name="password" type="password" autocomplete="current-password" value="${DEMO_PASSWORD}" required>
          </label>
          <p class="error" data-error="login" aria-live="polite"></p>
          <button class="primary" type="submit">Entrar</button>
          <button class="demo" type="button" data-accion="demo-rapida">Demo rápida</button>
        </form>
        <form data-formulario="registro" ${this.modo !== 'registro' ? 'hidden' : ''}>
          <label>Nombre
            <input name="nombre" type="text" autocomplete="name" required>
          </label>
          <label>Correo electrónico
            <input name="email" type="email" autocomplete="email" required>
          </label>
          <label>Contraseña
            <input name="password" type="password" autocomplete="new-password" minlength="6" required>
          </label>
          <p class="error" data-error="registro" aria-live="polite"></p>
          <button class="primary" type="submit">Crear cuenta de prueba</button>
        </form>
        <p class="hint">Acceso de prueba: <strong>${DEMO_USER.email}</strong> · contraseña <strong>${DEMO_PASSWORD}</strong></p>`;

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <main class="card">
        <header class="brand">
          <span class="mark" aria-hidden="true">U</span>
          <div><p class="eyebrow">Tienda UCJC · Demo local</p><h1>Identidad</h1></div>
        </header>
        ${content}
      </main>`;
  }

  escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[character]);
  }
}

if (!customElements.get('ucjc-identidad')) {
  customElements.define('ucjc-identidad', UcjcIdentidad);
}

export default { nombre: 'identidad', version: '0.2.0' };
