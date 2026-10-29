# FibStudio — Fotografía que crea sentimientos

Sitio web de una sola página (one-page) para **FibStudio**, un estudio de fotografía de eventos y sesiones personalizadas. La identidad visual gira alrededor de la **espiral de Fibonacci**: la idea es que toda buena fotografía sigue una proporción invisible, igual que toda buena historia sigue una emoción.

> Este README está generado a partir del contenido actual del proyecto.

---

## Vista general

- **Tipo de proyecto:** sitio web + API REST (Node.js + Express) con **MongoDB**.
- **Idioma:** español (`<html lang="es">`).
- **Frontend:** HTML + CSS + JavaScript vanilla (sin build).
- **Formulario de contacto:** guarda los mensajes en MongoDB; Netlify Forms queda como respaldo si la API no está disponible.
- **Panel privado:** `/admin`, protegido con un token, para leer y gestionar los mensajes.
- **Diseño:** responsive, tema oscuro con acentos en dorado, tipografía editorial.

> 📚 Guía paso a paso de la base de datos, Atlas, despliegue y endpoints: **[BASE-DE-DATOS.md](BASE-DE-DATOS.md)**.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| HTML5 semántico | Estructura del sitio |
| CSS3 | Estilos, grid, animaciones, media queries |
| JavaScript vanilla | Menú móvil, año del footer, galería, envío del formulario |
| Node.js + Express | Servidor HTTP y API REST |
| MongoDB + Mongoose | Base de datos y modelado (`mensajes`, `proyectos`) |
| express-rate-limit | Límite anti-spam del formulario |
| Google Fonts | `Fraunces` (títulos), `Public Sans` (texto), `JetBrains Mono` (etiquetas) |
| SVG inline | Logo y espiral animada del hero |
| Netlify Forms | Respaldo opcional del formulario si no hay API |

## Estructura del proyecto

```
pagina-claude/
├── index.html                 # Sitio (una página)
├── dashboard.html             # Panel privado de mensajes (/admin)
├── package.json               # Dependencias y scripts
├── .env.example               # Plantilla de variables de entorno
├── BASE-DE-DATOS.md           # Guía de MongoDB, despliegue y API
├── README.md
├── server/
│   ├── index.js               # Arranque (conecta a Mongo y escucha)
│   ├── app.js                 # Express: API, estáticos y errores
│   ├── db.js                  # Conexión de Mongoose
│   ├── seed.js                # Carga el portafolio inicial
│   ├── data/proyectos.js      # Contenido semilla
│   ├── middleware/            # Autenticación del panel
│   ├── models/                # Mensaje y Proyecto
│   ├── routes/                # contacto, mensajes, portafolio
│   └── utils/
├── test/
│   └── api.test.js            # Pruebas de integración (Mongo en memoria)
└── css/
    └── images/
        ├── styles.css         # Hoja de estilos principal
        ├── playa.avif         # Portafolio: "Pareja, amanecer"
        ├── pareja atardecer.jpg # Portafolio: "Boda al atardecer"
        ├── marca1.jpg         # Portafolio: "Lanzamiento de marca"
        ├── images.jpg         # Portafolio: "Retrato natural"
        ├── familia.jpg        # Portafolio: "Reunión familiar"
        └── marca              # Archivo de imagen sin extensión (no usado en el HTML)
```

> **Nota:** la hoja de estilos y las imágenes viven dentro de `css/images/`. Si reorganizas las carpetas, recuerda actualizar las rutas en `index.html` (`<link rel="stylesheet">`, `src` de las imágenes) y dentro de `styles.css` si añades recursos.

## Secciones del sitio

| Sección | ID | Descripción |
| --- | --- | --- |
| Hero | `#inicio` | Titular, subtítulo, botones de acción y espiral SVG animada |
| Estudio / Manifiesto | `#estudio` | Explica el nombre FibStudio y la filosofía del estudio |
| Portafolio | `#portafolio` | Galería de 5 imágenes; al pasar el cursor aparece la historia de cada foto |
| Servicios | `#servicios` | Dos tarjetas: cobertura de eventos y sesiones personalizadas |
| Proceso | `#proceso` | Cuatro pasos: conversamos, planeamos, disparamos, entregamos |
| Testimonio | — | Cita de un cliente |
| Contacto | `#contacto` | Datos de contacto y formulario de reserva |
| Footer | — | Logo, nota y año dinámico |

## Cómo usarlo

1. Clona el repositorio:

   ```bash
   git clone https://github.com/dodiexsss/pagina-claude.git
   cd pagina-claude
   ```

2. Instala dependencias y configura la base de datos:

   ```bash
   npm install
   Copy-Item .env.example .env    # Windows (macOS/Linux: cp .env.example .env)
   ```

   Edita `.env` con tu `MONGODB_URI` (Atlas o MongoDB local) y un `ADMIN_TOKEN`.
   El detalle completo está en **[BASE-DE-DATOS.md](BASE-DE-DATOS.md)**.

3. Carga el portafolio inicial y arranca:

   ```bash
   npm run seed
   npm run dev
   ```

4. Visita:

   - Sitio: <http://localhost:3000>
   - Panel de mensajes: <http://localhost:3000/admin>

> El sitio también se puede abrir como archivo estático (`index.html`) o servir con
> `python -m http.server`. En ese caso el menú, las animaciones y la galería
> estática funcionan, pero el formulario no guarda mensajes: necesitas el servidor
> Express y MongoDB.

## Personalización

### Textos e imágenes del portafolio

En `index.html`, cada foto es un `<figure class="gallery-item">` con:

```html
<figure class="gallery-item" role="listitem">
  <img src="css\images\images.jpg" alt="Retrato natural" loading="lazy" />
  <figcaption><span class="mono">sesiones /</span> Retrato natural</figcaption>
  <div class="gallery-overlay">
    <p class="gallery-overlay-eyebrow mono">la historia</p>
    <p class="gallery-overlay-text">Escribe aquí la historia real de esta sesión.</p>
  </div>
</figure>
```

- La clase `span-2` hace que la imagen ocupe dos columnas en el grid.
- Para añadir más fotos, copia un bloque y ajusta `src`, `alt`, `figcaption` y la historia del overlay.
- Varios textos del portafolio siguen siendo marcadores de posición ("Escribe aquí la historia...").

**Con la API funcionando**, la galería se carga desde MongoDB
(`GET /api/portafolio`) y reemplaza ese HTML. Los proyectos viven en la colección
`proyectos` y se cargan con `npm run seed` desde `server/data/proyectos.js`.
Para cambiar una foto o su historia, edita ese archivo y vuelve a ejecutar
`npm run seed`, o usa las rutas privadas `POST/PATCH/DELETE /api/portafolio`.
Si la API no responde, se conserva el HTML estático como respaldo.

### Mensajes recibidos

- Panel: <http://localhost:3000/admin> (o la URL de la API + `/admin`).
- Se entra con el valor de `ADMIN_TOKEN` definido en `.env`; se guarda solo en
  `sessionStorage` de esa pestaña.
- Desde el panel puedes marcar mensajes como nuevos, leídos o respondidos,
  escribir al cliente y eliminar mensajes.
- Los datos también se pueden consultar con `GET /api/mensajes` usando el header
  `x-admin-token`.

### Datos de contacto

Se editan en la sección `#contacto` de `index.html`:

- Correo: `hola@fibstudio.com`
- WhatsApp/teléfono: `+593 96 237 7437`
- Instagram: `@fibstudio` (enlace genérico a `https://instagram.com`)

### Colores y tipografías

Todo está centralizado en variables CSS al inicio de `css/images/styles.css`:

```css
--bg: #15130f;
--bg-alt: #1d1a15;
--surface: #221e18;
--text: #f3ede2;
--text-dim: #b7ac9a;
--gold: #c9a24b;
--rust: #b8654f;
--line: rgba(243, 237, 226, 0.12);

--font-display: "Fraunces", serif;
--font-body: "Public Sans", system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, monospace;
```

Cambiar estos valores actualiza el tema completo.

## Formulario de contacto

El formulario (`#contactForm`) envía los datos a `POST /api/contacto` y el
servidor los guarda en MongoDB:

- **Validación doble:** HTML en el navegador y esquema de Mongoose en el servidor.
- **Honeypot anti-spam:** campo invisible `empresa`; si un bot lo rellena, el
  servidor responde con éxito pero no guarda nada.
- **Rate limit:** máximo 5 envíos cada 15 minutos por IP.
- **Envío con `fetch`:** sin recargar la página; estados `.is-success` e
  `.is-error` sobre `.form-status`.
- **Respaldo Netlify Forms:** si la API no está disponible (por ejemplo, un
  despliegue solo estático en Netlify), el JavaScript reintenta el envío clásico
  a `/` con `application/x-www-form-urlencoded`. Los atributos
  `data-netlify="true"` y `form-name=contacto` se mantienen para eso.
- **API en otro dominio:** si el frontend está en Netlify y la API en Render,
  configura `<meta name="fibstudio-api" content="https://tu-api...">` en el
  `<head>` de `index.html` y define `CORS_ORIGIN` en el servidor.

### Pasos para activarlo

1. Configura `MONGODB_URI` y `ADMIN_TOKEN` (ver [BASE-DE-DATOS.md](BASE-DE-DATOS.md)).
2. Arranca con `npm run dev` y envía una prueba desde el sitio.
3. Entra a `/admin` y comprueba que el mensaje aparece como **Nuevo**.
4. Opcional: para Netlify Forms, despliega también en Netlify y activa las
   notificaciones en **Forms → Notifications**. El atributo `action="/gracias.html"`
   apunta a una página que **todavía no existe**; si no la creas, el envío por
   `fetch` sigue funcionando, pero conviene añadirla o cambiar la ruta.

## Accesibilidad

El proyecto ya incluye varias buenas prácticas:

- Enlace "Saltar al contenido" (`.skip-link`) y landmark `<main id="contenido">`.
- `aria-label`, `aria-expanded` y `aria-controls` en la navegación móvil.
- `<section>` con `aria-labelledby` apuntando a sus títulos.
- Texto alternativo en todas las imágenes.
- Estados de foco visibles (`:focus-visible`) en enlaces, botones y campos.
- Región `role="status"` con `aria-live="polite"` para el resultado del formulario.
- Soporte de `prefers-reduced-motion` para reducir animaciones.
- Clase `.sr-only` para texto solo para lectores de pantalla.

## Responsive

Los puntos de quiebre están en `styles.css`:

- **≤ 900 px:** grids de dos columnas (manifiesto, servicios, contacto, proceso y galería); espiral más tenue.
- **≤ 640 px:** menú hamburguesa desplegable, una sola columna en galería y proceso, hero sin altura mínima fija.

## Rendimiento

- Imágenes con `loading="lazy"`.
- Formatos mixtos (`.jpg`, `.avif`).
- Sin frameworks ni librerías externas en el frontend más allá de las fuentes.
- Índices de MongoDB en `createdAt`, `estado` y `activo/orden`.
- La API limita el listado a los 200 mensajes más recientes.

Ideas de mejora: convertir todas las imágenes al mismo formato (WebP/AVIF), usar `srcset`, comprimir los archivos y precargar la imagen principal del hero si se añade una.

## Despliegue

La guía completa (Atlas, variables, Render, Netlify) está en
**[BASE-DE-DATOS.md](BASE-DE-DATOS.md)**. Resumen:

### Todo en un servicio (recomendado)

Render, Railway o Fly.io ejecutan el repositorio completo:

- **Build:** `npm install`
- **Start:** `npm start`
- **Variables:** `MONGODB_URI`, `ADMIN_TOKEN` (y `CORS_ORIGIN` si hace falta)
- Sitio en la URL del servicio, panel en `/admin`.

### Netlify (solo frontend)

Netlify sirve muy bien el sitio, pero no ejecuta Node ni MongoDB:

- Conecta el repositorio `dodiexsss/pagina-claude` sin comando de build.
- Configura la meta etiqueta `fibstudio-api` con la URL de la API y añade esa
  URL a `CORS_ORIGIN` en el servidor.
- Si no hay API, el formulario cae en Netlify Forms y los mensajes no se guardan
  en MongoDB.

### GitHub Pages

Sirve como sitio estático, pero no hay API ni base de datos: el formulario no
guarda mensajes.

## Ramas del repositorio

- `main` — rama principal publicada en remoto.
- `develop` — rama de trabajo actual.

## Historial reciente

```
c918840 modifique mensaje
91ed65e agregue el script
bd9c76a agregue el formulario
0f82615 agregue imagenes con historia
3034948 agregue las fotos al portafolio
2c1d53a modifique informacion
d5696a0 agregue css y HTML
```

## Pendientes / notas conocidas

- Sustituir las imágenes de ejemplo por fotografías reales del estudio.
- Completar las historias del portafolio que aún son texto de relleno.
- Crear `gracias.html` o ajustar el `action` del formulario.
- Revisar el correo, teléfono e Instagram definitivos.
- Actualizar el enlace de Instagram (actualmente apunta a la home de Instagram).
- Unificar la ubicación de `styles.css` e imágenes dentro de `css/images/`.
- El archivo `css/images/marca` no tiene extensión y no se usa en el HTML; puede eliminarse o renombrarse.
- Hay reglas CSS duplicadas (`.gallery-item figcaption` y `.gallery-item figcaption .mono`) y bloques de placeholders (`.ph-*`) sin uso que se pueden limpiar.
- Añadir notificaciones por correo al recibir un mensaje (hoy solo se ven en `/admin`).
- Sustituir el token compartido por autenticación con usuarios si el equipo crece.
- Subir las imágenes del portafolio a un CDN (Cloudinary/S3) en lugar de servir archivos locales.

---

© FibStudio. Todos los derechos reservados.
