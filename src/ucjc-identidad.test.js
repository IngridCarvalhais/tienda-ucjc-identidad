// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import identidad from './ucjc-identidad.js';

const EVENT_NAME = 'ucjc:identidad:sesion-cambiada@1';

afterEach(() => {
  document.body.replaceChildren();
});

describe('ucjc-identidad', () => {
  it('exports the remote module metadata', () => {
    expect(identidad).toEqual({ nombre: 'identidad', version: '0.2.0' });
  });

  it('registers the custom element and emits session changes for quick demo and logout', () => {
    expect(customElements.get('ucjc-identidad')).toBeDefined();

    const element = document.createElement('ucjc-identidad');
    const events = [];
    element.addEventListener(EVENT_NAME, (event) => events.push(event));
    document.body.append(element);

    expect(events[0].detail).toMatchObject({
      autenticado: false,
      usuario: null,
    });

    element.shadowRoot.querySelector('[data-accion="demo-rapida"]').click();
    expect(events[1].detail).toMatchObject({
      autenticado: true,
      usuario: {
        id: 'u-123',
        email: 'ana@alumno.ucjc.edu',
        nombre: 'Ana Pérez',
      },
    });
    expect(events[1].detail.momento).toEqual(expect.any(String));

    element.shadowRoot.querySelector('[data-accion="cerrar-sesion"]').click();
    expect(events[2].detail).toMatchObject({
      autenticado: false,
      usuario: null,
    });
    expect(events).toHaveLength(3);
  });
});
