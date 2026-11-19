# Base de datos MongoDB — guía del proyecto actual

Esta guía describe cómo está construido FibStudio hoy: frontend React y backend
Express desplegados por separado en Render, con MongoDB como base de datos.

> Documentación anterior mencionaba una carpeta `server/` y un panel en `/admin`
> servido por Express. Eso **ya no existe**. El backend actual solo expone la API
> bajo `/api/*`.

---

## 1. Arquitectura

```
Navegador
   │
   ├── Frontend React (Vite, estático en Render)
   │      ├── /                 → sitio público
   │      ├── /dashboard.html   → panel privado de mensajes
   │      └── /gracias.html     → confirmación
   │
   └── Backend Express (Web Service en Render)
          ├── GET    /api/salud
          ├── POST   /api/contacto
          ├── GET    /api/portafolio
          └── rutas privadas de mensajes y portafolio
                 │
                 ▼
            MongoDB (Atlas o local)
```

Son **dos servicios independientes**:

- El frontend se compila con Vite y se publica como sitio estático.
- El backend solo responde JSON; no sirve HTML, CSS ni imágenes.
- El navegador habla con la API por HTTP gracias a CORS.

### Estructura del repositorio

```
fib-studio/
├── backend/                  API REST con Express, Mongoose y correo
│   ├── src/
│   │   ├── server.js         Arranque: conecta a Mongo y levanta Express
│   │   ├── app.js            Configuración de Express, CORS, rutas y errores
│   │   ├── db.js             Conexión y desconexión de Mongoose
│   │   ├── seed.js           Carga idempotente del portafolio inicial
│   │   ├── routes/
│   │   │   ├── contacto.js   POST /api/contacto + rate limit
│   │   │   ├── mensajes.js   Listado, estados y borrado (privado)
│   │   │   └── portafolio.js Lectura pública y CRUD privado
│   │   ├── models/
│   │   │   ├── Mensaje.js
│   │   │   └── Proyecto.js
│   │   ├── middleware/
│   │   │   └── adminAuth.js  Protección con ADMIN_TOKEN
│   │   ├── email/
│   │   │   ├── index.js      Envío del correo de bienvenida
│   │   │   ├── transporte.js Resend o SMTP (nodemailer)
│   │   │   ├── plantillas.js HTML y texto del correo
│   │   │   └── prueba.js     Prueba manual del correo
│   │   ├── utils/
│   │   │   ├── asyncHandler.js
│   │   │   └── html.js
│   │   └── data/
│   │       └── proyectos.js  Contenido inicial del portafolio
│   └── test/
│       ├── api.test.js       Pruebas de integración con Mongo en memoria
│       └── email.test.js     Pruebas de plantillas y transporte
│
├── frontend/                 React + Vite
│   ├── index.html            Sitio público
│   ├── dashboard.html        Panel privado
│   ├── gracias.html          Página de confirmación
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.jsx          Entrada del sitio
│   │   ├── App.jsx
│   │   ├── api.js            Llamadas a la API
│   │   ├── components/       Secciones, formulario, chat y panel
│   │   ├── dashboard/        Entrada y estilos del panel
│   │   ├── gracias/          Entrada de la página de gracias
│   │   ├── data/faq.js       Preguntas frecuentes del asistente
│   │   └── utils/chatbot.js  Lógica del asistente
│   └── public/img/           Fotografías del portafolio
│
├── _vanilla-original/        Versión anterior del sitio, solo como referencia
├── README.md
└── BASE-DE-DATOS.md
```

`frontend/dist/` no se guarda en el repositorio (está en `.gitignore`). Render lo
genera en cada despliegue con `npm run build`. `_vanilla-original/` tampoco se
publica.

---

## 2. Modelo de datos

### Mensaje — colección `mensajes`

```json
{
  "_id": "66f1c2…",
  "nombre": "Ana Pérez",
  "email": "ana@example.com",
  "servicio": "evento",
  "mensaje": "Quiero cotizar una boda para diciembre.",
  "estado": "nuevo",
  "origen": "web",
  "createdAt": "2026-10-28T15:04:05.000Z",
  "updatedAt": "2026-10-28T15:04:05.000Z"
}
```

| Campo | Detalle |
| --- | --- |
| `nombre` | Obligatorio, máximo 120 caracteres |
| `email` | Obligatorio, formato validado, se guarda en minúsculas |
| `servicio` | `evento` \| `sesion` \| `otro` |
| `mensaje` | Obligatorio, entre 10 y 4000 caracteres |
| `estado` | `nuevo` \| `leido` \| `respondido` (por defecto `nuevo`) |
| `origen` | `web` \| `manual` \| `importado` (por defecto `web`) |
| `ip` / `userAgent` | Se guardan pero no se devuelven por la API (`select: false`) |
| `createdAt` / `updatedAt` | Automáticos (`timestamps: true`) |

Índices: `estado` y `createdAt`.

### Proyecto — colección `proyectos`

```json
{
  "_id": "66f1c2…",
  "titulo": "Boda al atardecer",
  "categoria": "eventos",
  "imagen": "css/images/pareja%20atardecer.jpg",
  "alt": "Boda al atardecer",
  "historia": "Se casaron justo cuando el sol tocaba el mar…",
  "span2": true,
  "orden": 1,
  "activo": true
}
```

| Campo | Detalle |
| --- | --- |
| `titulo` | Obligatorio, máximo 120 caracteres |
| `categoria` | `eventos` \| `sesiones` |
| `imagen` | Obligatoria |
| `alt` | Obligatorio, máximo 200 caracteres |
| `historia` | Opcional, máximo 1200 caracteres |
| `span2` | Ocupa dos columnas en la galería |
| `orden` | Orden de aparición (menor primero) |
| `activo` | Solo los activos se muestran en el sitio |

Índices: `categoria`, `activo` y `{ activo, orden }`.

> Las rutas antiguas tipo `css/images/…` se guardan tal cual en MongoDB.
> `frontend/src/components/ProyectoCard.jsx` las traduce a `/img/…`, que es
> donde viven realmente las fotos en `frontend/public/img/`.

---

## 3. Endpoints

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/salud` | público | Estado del servidor y de la conexión a Mongo |
| `POST` | `/api/contacto` | público (5 cada 15 min/IP) | Valida, guarda un mensaje y envía el correo de bienvenida |
| `GET` | `/api/portafolio` | público | Proyectos activos ordenados |
| `POST` | `/api/portafolio` | token | Crea un proyecto |
| `PATCH` | `/api/portafolio/:id` | token | Edita un proyecto |
| `DELETE` | `/api/portafolio/:id` | token | Borra un proyecto |
| `GET` | `/api/mensajes` | token | Lista mensajes (`?estado=nuevo`, máximo 200) |
| `GET` | `/api/mensajes/stats` | token | Totales por estado |
| `PATCH` | `/api/mensajes/:id` | token | Cambia el estado |
| `DELETE` | `/api/mensajes/:id` | token | Borra un mensaje |

Las rutas privadas esperan el header:

```
x-admin-token: <ADMIN_TOKEN>
```

Cualquier otra ruta devuelve `404`. El backend no sirve el frontend. El panel se
abre en el dominio del frontend, no en el de la API:

```
https://tu-frontend.onrender.com/dashboard.html
```

### Flujo del formulario

1. `ContactForm.jsx` llama a `crearMensaje()` en `src/api.js`.
2. Se hace `POST {VITE_API_URL}/api/contacto` con JSON.
3. `routes/contacto.js` aplica rate limit y honeypot (`empresa`).
4. `Mensaje.create()` valida y guarda en MongoDB.
5. Se intenta enviar el correo de bienvenida (Resend o SMTP). Si falla, el
   mensaje ya quedó guardado y la API responde igualmente `201`.
6. El panel lee los mensajes con `GET /api/mensajes` enviando el token.

> `src/api.js` conserva un respaldo antiguo de Netlify Forms. Solo tendría
> sentido si el frontend se alojara en Netlify; en Render ese camino no funciona.

---

## 4. Variables de entorno

### Backend (`backend/.env`)

Copia `backend/.env.example` y completa:

| Variable | Obligatoria | Para qué |
| --- | --- | --- |
| `MONGODB_URI` | Sí | Cadena de conexión de MongoDB |
| `PORT` | No | Puerto de Express (Render lo define) |
| `ADMIN_TOKEN` | Sí | Acceso al panel y rutas privadas |
| `CORS_ORIGIN` | En producción | Dominios autorizados, separados por comas |
| `RESEND_API_KEY` | No | Envío de correo por Resend (recomendado en Render) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | No | Alternativa SMTP |
| `SMTP_USER` / `SMTP_PASS` | No | Credenciales SMTP |
| `EMAIL_FROM` | No | Remitente visible |
| `EMAIL_REPLY_TO` | No | Buzón de respuestas |
| `STUDIO_EMAIL` | No | Correo del pie del mensaje |
| `WHATSAPP_NUMBER` | No | Número para el botón de WhatsApp |
| `WHATSAPP_MENSAJE` | No | Texto del mensaje de WhatsApp |
| `SITE_URL` / `INSTAGRAM_URL` | No | Enlaces del correo |

Si no configuras correo, el formulario sigue funcionando: guarda el mensaje y
responde `201` con `correo: "omitido"`.

Genera un token seguro con:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend (`frontend/.env`)

| Variable | Para qué |
| --- | --- |
| `VITE_API_URL` | URL base del backend, sin `/api` al final |

Ejemplo local:

```
VITE_API_URL=http://localhost:3000
```

Vite inyecta esta variable **en tiempo de build**. En Render hay que definirla
antes de compilar y volver a desplegar si cambia.

---

## 5. Ponerlo a funcionar en local

Requisitos: Node.js 20 o superior y una base MongoDB (Atlas, Docker o local).

```bash
# Backend
cd backend
npm install
Copy-Item .env.example .env      # macOS/Linux: cp .env.example .env
# Edita .env y completa MONGODB_URI y ADMIN_TOKEN
npm run seed
npm run dev                      # http://localhost:3000

# Frontend (en otra terminal)
cd frontend
npm install
Copy-Item .env.example .env
npm run dev                      # http://localhost:5173
```

Páginas locales:

- Sitio: <http://localhost:5173>
- Panel: <http://localhost:5173/dashboard.html>
- API: <http://localhost:3000/api/salud>

Para MongoDB local con Docker:

```bash
docker run -d --name fibstudio-mongo -p 27017:27017 -v fibstudio_mongo:/data/db mongo:7
```

y en `backend/.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/fibstudio
```

### Scripts del backend

| Comando | Qué hace |
| --- | --- |
| `npm start` | Arranca la API |
| `npm run dev` | Arranca con recarga automática |
| `npm run seed` | Carga el portafolio inicial (upsert por título) |
| `npm run email:test` | Prueba manual del envío de correo |
| `npm test` | Pruebas de API y correo con Mongo en memoria |

`npm test` descarga un binario de MongoDB la primera vez (unos 100 MB).

### Scripts del frontend

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en el puerto 5173 |
| `npm run build` | Genera `dist/` para producción |
| `npm run preview` | Sirve `dist/` localmente |
| `npm run lint` | Ejecuta Oxlint |

---

## 6. Crear la base en MongoDB Atlas

1. Crea una cuenta en <https://www.mongodb.com/cloud/atlas/register>.
2. **Create** → plan **M0 Free** → región cercana.
3. En **Database Access** crea un usuario con contraseña.
4. En **Network Access** permite las IP de Render. Si el plan no ofrece IP fija,
   se suele usar `0.0.0.0/0` y se compensa con una contraseña larga y un
   `ADMIN_TOKEN` robusto.
5. En **Database** → **Connect** → **Drivers** copia la cadena.
6. Añade el nombre de la base antes del `?`:

   ```
   MONGODB_URI=mongodb+srv://fibstudio:TU_PASSWORD@cluster0.xxxxx.mongodb.net/fibstudio?retryWrites=true&w=majority
   ```

7. Ejecuta `npm run seed` una vez con esa URI para cargar el portafolio.

Mongoose crea la base y las colecciones en el primer insert.

---

## 7. Despliegue actual en Render

Hay dos servicios separados en el mismo repositorio.

### Servicio A — Backend (Web Service)

| Ajuste | Valor |
| --- | --- |
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Variables en Render:

```
MONGODB_URI=...
ADMIN_TOKEN=...
CORS_ORIGIN=https://tu-frontend.onrender.com
# y las de correo si se usan (RESEND_API_KEY o SMTP_*)
```

`PORT` lo define Render automáticamente.

### Servicio B — Frontend (Static Site)

| Ajuste | Valor |
| --- | --- |
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Variable en Render:

```
VITE_API_URL=https://tu-backend.onrender.com
```

Puntos clave:

- `dist` lo genera Render en cada build; el `dist` local no se sube ni se usa.
- Si cambias `VITE_API_URL`, hay que **volver a desplegar** (idealmente con
  *Clear build cache*) porque el valor queda incrustado en el JavaScript.
- `CORS_ORIGIN` del backend debe incluir exactamente el dominio del frontend.
- Si `VITE_API_URL` falta o apunta a `localhost`, el formulario falla en
  producción y el respaldo de Netlify no ayuda en Render.

### Comprobar que todo está conectado

1. Abre `https://tu-backend.onrender.com/api/salud` → debe responder
   `{ "ok": true, "db": "conectada" }`.
2. Abre el sitio y envía el formulario.
3. En DevTools → Network, confirma que el `POST` va a
   `https://tu-backend.onrender.com/api/contacto`.
4. Entra a `https://tu-frontend.onrender.com/dashboard.html` con el
   `ADMIN_TOKEN` y verifica que el mensaje aparece.

---

## 8. Seguridad incluida

- Validación en el servidor con esquemas de Mongoose.
- Honeypot (`empresa`) y rate limit de 5 envíos cada 15 minutos por IP.
- Token de administración comparado con `timingSafeEqual`.
- CORS cerrado: solo los orígenes definidos en `CORS_ORIGIN`.
- El backend no sirve archivos estáticos ni el `.env`.
- `ip` y `userAgent` no se exponen en las respuestas de la API.
- `.env` está en `.gitignore`; nunca se sube al repositorio.
