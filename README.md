# FibStudio — Fotografía que crea sentimientos

Sitio web de una sola página (one-page) para **FibStudio**, un estudio de fotografía de eventos y sesiones personalizadas. La identidad visual gira alrededor de la **espiral de Fibonacci**: la idea es que toda buena fotografía sigue una proporción invisible, igual que toda buena historia sigue una emoción.

> Este README está generado a partir del contenido actual del proyecto.

---

## Vista general

- **Tipo de proyecto:** sitio estático (HTML + CSS + JavaScript vanilla).
- **Idioma:** español (`<html lang="es">`).
- **Sin dependencias ni build:** se abre directamente en el navegador.
- **Formulario de contacto:** preparado para **Netlify Forms**.
- **Diseño:** responsive, tema oscuro con acentos en dorado, tipografía editorial.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| HTML5 semántico | Estructura del sitio |
| CSS3 | Estilos, grid, animaciones, media queries |
| JavaScript vanilla | Menú móvil, año del footer, envío del formulario |
| Google Fonts | `Fraunces` (títulos), `Public Sans` (texto), `JetBrains Mono` (etiquetas) |
| SVG inline | Logo y espiral animada del hero |
| Netlify Forms | Recepción de mensajes del formulario |

## Estructura del proyecto

```
pagina-claude/
├── index.html                 # Todo el sitio en un solo archivo
├── README.md
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

2. Abre `index.html` en tu navegador (doble clic) o sirve la carpeta con cualquier servidor estático:

   ```bash
   # Opción con Python
   python -m http.server 8000

   # Opción con Node
   npx serve .
   ```

3. Visita `http://localhost:8000`.

> El menú móvil, el año del footer y las animaciones funcionan sin servidor. El **envío del formulario solo funciona desplegado en Netlify** (ver abajo).

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

El formulario (`#contactForm`) está configurado para **Netlify Forms**:

- `data-netlify="true"` y el campo oculto `form-name=contacto`.
- **Honeypot anti-spam:** un campo invisible llamado `empresa`; si un bot lo rellena, el envío se descarta silenciosamente.
- **Envío con `fetch`**: el JavaScript intercepta el `submit`, envía los datos como `application/x-www-form-urlencoded` a `/` y muestra un mensaje de estado sin recargar la página.
- Estados del mensaje: `.is-success` e `.is-error` (la clase base es `.form-status`).
- Si el envío falla, se sugiere escribir por correo.

### Pasos para activarlo

1. Desplegar el sitio en Netlify (arrastrar la carpeta o conectar el repositorio).
2. En el panel de Netlify, ir a **Forms** y comprobar que aparece el formulario `contacto`.
3. Configurar las notificaciones por correo en **Forms → Notifications**.
4. Opcional: definir la página de agradecimiento. El atributo `action="/gracias.html"` apunta a una página que **todavía no existe**; si no la creas, el envío por `fetch` seguirá funcionando, pero conviene añadirla o cambiar la ruta.

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
- Sin frameworks ni librerías externas más allá de las fuentes.

Ideas de mejora: convertir todas las imágenes al mismo formato (WebP/AVIF), usar `srcset`, comprimir los archivos y precargar la imagen principal del hero si se añade una.

## Despliegue

### Netlify (recomendado)

Es la opción para la que está preparado el formulario.

- **Drag & drop:** arrastra la carpeta del proyecto a Netlify Drop.
- **Git:** conecta el repositorio `dodiexsss/pagina-claude`; no requiere comando de build ni carpeta de publicación distinta de la raíz.

### GitHub Pages

También sirve como sitio estático, pero **el formulario no enviará mensajes** (Netlify Forms no está disponible allí).

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

---

© FibStudio. Todos los derechos reservados.
