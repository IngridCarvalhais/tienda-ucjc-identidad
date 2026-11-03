# tienda-ucjc-identidad

Pieza de Identidad de la Tienda UCJC (proyecto de micro-frontends). Se encarga del login simulado, la sesión y el perfil del usuario.

Custom element: `<ucjc-identidad>`

## Equipo

| Nombre | Correo | GitHub |
|---|---|---|
| Sebastián Blanco (responsable) | | [@sebasxblanco](https://github.com/sebasxblanco) |
| Olivia Troitiño Frydrych | olivia.troitinofrydrych@alumno.ucjc.edu | [@oliviatroitino](https://github.com/oliviatroitino) |
| Ingrid Carvalhais Silva | ingrid.carvalhaissilva@alumno.ucjc.edu | |
| Fernando Melero Muñoz | fmeleromunoz@gmail.com | [@FerMelero](https://github.com/FerMelero) |
| Giordano Fabio Castilla García | giordano.fcg@gmail.com | [@Giordano-jpg](https://github.com/Giordano-jpg) |

## Cómo arrancarlo

```bash
npm install
npm run dev
```

## Evento de sesión (`@1`)

Identidad emite `ucjc:identidad:sesion-cambiada@1` al cargar, iniciar y cerrar sesión. Se despacha desde el custom element como `CustomEvent`, con `bubbles` y `composed` a `true`.

El contrato `@1` requiere `autenticado` y `usuario` (`null` si no hay sesión; si existe, debe incluir `id` y `email`). `momento` y `usuario.nombre` son opcionales. La versión está en el nombre del evento, no en `detail`.

```json
{
  "autenticado": true,
  "usuario": { "id": "u-123", "email": "ana@alumno.ucjc.edu", "nombre": "Ana Pérez" },
  "momento": "2026-10-26T10:00:00Z"
}
```

Al cerrar sesión se emite `autenticado: false` y `usuario: null`. Permisos y roles permanecen dentro de Identidad y no se incluyen en el evento.

## Demo

La pieza funciona de forma independiente, sin backend. El registro es simulado y el login usa estos datos fijos:

- Correo: `ana@alumno.ucjc.edu`
- Contraseña: `ucjc2026`

```js
window.addEventListener('ucjc:identidad:sesion-cambiada@1', (event) => {
  console.log(event.detail);
});
```

Al cargar como módulo remoto, se registra `<ucjc-identidad>` y se exporta por defecto `{ nombre: 'identidad', version: '0.2.0' }`.

## Publicación

El build genera `dist/remote.js` para cargar como módulo ES. En GitHub Pages la URL prevista es `https://ucjc-ecommerce-identidad.github.io/tienda-ucjc-identidad/remote.js`. Los eventos `sesion-solicitada` y `sesion-consultada` no forman parte del contrato `@1`; si se necesitan, se propondrán en otro PR.
