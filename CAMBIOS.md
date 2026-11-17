# Cambios de la migración a React

Este documento resume qué cambió al pasar el sitio de HTML, CSS y JavaScript vanilla a React con Vite. Está pensado para repasar la migración con calma.

## Antes (vanilla) → ahora (React)

| Antes | Ahora | Qué hace ahora |
| --- | --- | --- |
| `index.html` | `frontend/index.html` + `src/App.jsx` | El HTML solo tiene el `<div id="root">`. React dibuja dentro el sitio completo. |
| Secciones del HTML | `src/components/Hero.jsx`, `Manifesto.jsx`, `Portfolio.jsx`, `Services.jsx`, `Process.jsx`, `Testimonial.jsx`, `Contact.jsx` | Cada sección es un componente con su propio archivo. |
| `<header>` y script del menú | `src/components/Header.jsx` | El menú móvil usa `useState`: guarda si está abierto y cambia `aria-expanded`. |
| Tarjetas del portafolio escritas a mano | `src/components/Portfolio.jsx` + `ProyectoCard.jsx` | Los proyectos llegan de `GET /api/portafolio` y se pintan con `.map()`, usando `_id` como `key`. |
| `crearProyecto()` con `createElement` e `innerHTML` | `ProyectoCard.jsx` | Ahora es JSX con props (`proyecto`), sin tocar el DOM a mano. |
| `cargarPortafolio()` con `fetch` | `Portfolio.jsx` + `src/api.js` | `useEffect` carga los datos una vez y muestra estados de cargando, error o lista vacía. |
| `#contactForm` y su `submit` | `ContactForm.jsx` | Inputs controlados con `useState`; el envío usa `crearMensaje()` de `api.js`. |
| `mostrarEstado()` y `classList` | `ContactForm.jsx` | El color del mensaje sale de una clase calculada con el estado de React. |
| Enlaces `[data-whatsapp]` modificados con JS | Enlaces directos en JSX | La URL de WhatsApp ya viene escrita en cada enlace; no hace falta recorrer el DOM. |
| Año del footer con `getElementById` | `Footer.jsx` | El año se calcula al cargar el módulo y se muestra con JSX. |
| `js/chatbot.js` con `innerHTML` y `addEventListener` | `ChatWidget.jsx`, `ChatMensaje.jsx`, `utils/chatbot.js`, `data/faq.js` | El widget usa estado para abrir/cerrar, mensajes, sugerencias y el indicador de "escribiendo". |
| `dashboard.html` con su JS interno | `dashboard.html` + `DashboardPage.jsx` y componentes | Login con token, estadísticas, filtros, cambio de estado y eliminación usan `useState` y `useEffect`. |
| Token en `sessionStorage` | Igual, en `DashboardPage.jsx` | Se conserva la misma clave `fibstudio_admin_token` y el header `x-admin-token`. |
| `gracias.html` | `gracias.html` + `Gracias.jsx` | Misma página, ahora como componente de React con estilos en objeto. |
| `css/images/styles.css` | `src/index.css` | Se copió sin cambiar las reglas. |
| `css/chatbot.css` | `src/chatbot.css` | Se importa desde `ChatWidget.jsx`. |
| `css/images/*.jpg` y `.avif` | `frontend/public/img/` | Las rutas ahora empiezan con `/img/`. |
| `server/` | `backend/src/` | La API se movió sin cambiar su lógica. |
| `test/` | `backend/test/` | Las pruebas se movieron y ahora importan desde `../src/`. |
| Servidor que servía el sitio con `express.static` | Solo API | El backend ya no entrega HTML, CSS ni JS; eso lo hace Vite. |
| CORS solo si existía `CORS_ORIGIN` | CORS para el frontend de Vite | Por defecto permite `localhost:5173` y `127.0.0.1:5173`. |

## Funcionalidades que se conservaron

- Los mismos textos, clases CSS, fotografías y diseño.
- El menú móvil, los enlaces de WhatsApp y el año automático del footer.
- El portafolio cargado desde MongoDB.
- El formulario de contacto con honeypot, validación del navegador y mensajes de éxito/error.
- El respaldo de Netlify Forms si la API no está disponible.
- El chatbot de preguntas frecuentes: mismas 28 respuestas, mismas palabras clave y mismas sugerencias.
- El panel privado con token, filtros, estadísticas, cambio de estado y eliminación.
- El correo automático de bienvenida y el límite anti-spam de 5 envíos cada 15 minutos.

## Bugs y dudas encontrados

Estos puntos se encontraron durante la migración. **No se cambiaron en silencio**; se dejan anotados para que los revises:

1. **El README antiguo decía que `gracias.html` no existía**, pero el archivo sí estaba en el proyecto. El nuevo README ya lo incluye.
2. **Las comillas del testimonio no coinciden**: empieza con `“` y termina con `"`. Se conservó el texto tal cual.
3. **Las rutas de las imágenes en MongoDB** siguen siendo `css/images/...`, mientras que el frontend usa `/img/...`. Para no modificar tus datos, `ProyectoCard.jsx` traduce esa ruta al mostrarla. Si algún día cambias los registros, puedes guardar directamente `/img/...`.
4. **El documento de migración pedía Express 5**, pero el proyecto ya funcionaba con Express 4 y `express.json()`. Se dejó Express 4 para no romper nada.
5. **El `README` antiguo mencionaba un archivo `marca` sin extensión** dentro de `css/images/`, pero ya no existe. No se usaba en el HTML.
6. **El respaldo de Netlify Forms** no se puede probar en local igual que en producción. En desarrollo se mantiene el mismo intento de respaldo, pero solo tiene sentido en un despliegue estático real.
7. **El panel mostraba el enlace `/admin`**, que ya no lo sirve el backend. Ahora el panel vive en `frontend/dashboard.html`; los logs del servidor se actualizaron para reflejarlo.
8. **El portafolio aparece vacío si ejecutas el backend sin MongoDB o sin `npm run seed`**. No es un error de React: la base de datos no tiene proyectos activos.
9. **Si el navegador abre el sitio desde otro puerto** (por ejemplo, 5174 porque 5173 está ocupado), CORS puede bloquear las llamadas. Cierra el servidor viejo o agrega ese origen a `CORS_ORIGIN`.

## Cómo está organizado el estado

- **`Header`**: `menuAbierto`.
- **`Portfolio`**: `proyectos`, `cargando`, `error`.
- **`ContactForm`**: `datos`, `enviando`, `estado`, `textoExito`.
- **`ChatWidget`**: `abierto`, `visto`, `iniciado`, `mensajes`, `sugerencias`, `texto`, `escribiendo`.
- **`DashboardPage`**: `token`, `logueado`, `filtroEstado`, `mensajes`, `stats`, `errorLogin`, `toast`, `recarga`.

Los datos compartidos se pasan por **props** (por ejemplo, `ProyectoCard` recibe `proyecto` y `MessageCard` recibe `mensaje`).
