# FibStudio — React + Express + MongoDB

Sitio web del estudio de fotografía **FibStudio**, ahora organizado en dos carpetas:

- `backend/`: API REST con Node.js, Express y MongoDB (Mongoose).
- `frontend/`: sitio migrado a React 19 con Vite (JavaScript, sin TypeScript).

El sitio público, el panel privado de mensajes y la página de gracias funcionan como tres páginas separadas de Vite, **sin React Router**.

## Requisitos

- [Node.js](https://nodejs.org/) **20 o superior**.
- **MongoDB local** (o una URI de MongoDB accesible desde tu equipo).
- npm, que viene con Node.js.

## Estructura

```
fib-studio/
├── backend/
│   ├── src/
│   │   ├── server.js        # Arranque del servidor
│   │   ├── app.js           # Express: CORS, API y errores
│   │   ├── db.js            # Conexión de Mongoose
│   │   ├── models/          # Mensaje y Proyecto
│   │   ├── routes/          # contacto, mensajes, portafolio
│   │   ├── email/           # Correo de bienvenida
│   │   ├── middleware/      # Token del panel
│   │   └── utils/
│   ├── test/                # Pruebas con node:test
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/img/          # Fotografías del portafolio
│   ├── src/
│   │   ├── main.jsx         # Entrada del sitio público
│   │   ├── App.jsx
│   │   ├── api.js           # Todas las llamadas a la API
│   │   ├── index.css
│   │   ├── chatbot.css
│   │   ├── components/
│   │   ├── dashboard/       # Entrada del panel
│   │   ├── gracias/         # Entrada de la página de gracias
│   │   ├── data/            # Preguntas frecuentes del chatbot
│   │   └── utils/           # Motor del chatbot
│   ├── dashboard.html
│   ├── gracias.html
│   ├── index.html
│   ├── .env.example
│   └── package.json
├── BASE-DE-DATOS.md         # Guía de MongoDB y despliegue
└── README.md
```

## Cómo correr el proyecto

Necesitas **dos terminales** abiertas al mismo tiempo.

**Terminal 1 — backend:**

```powershell
cd backend
npm run dev
```

La API queda en `http://localhost:3000/api`.

**Terminal 2 — frontend:**

```powershell
cd frontend
npm run dev
```

Vite abre el sitio en `http://localhost:5173`:

- Sitio público: <http://localhost:5173>
- Panel privado: <http://localhost:5173/dashboard.html>
- Página de gracias: <http://localhost:5173/gracias.html>

Para detener cualquiera de los dos, pulsa `Ctrl + C` en su terminal.


## Variables de entorno

### `backend/.env`

| Variable | Uso | Ejemplo |
| --- | --- | --- |
| `MONGODB_URI` | Cadena de conexión de MongoDB | `mongodb://127.0.0.1:27017/fibstudio` |
| `PORT` | Puerto del servidor Express | `3000` |
| `ADMIN_TOKEN` | Token para entrar al panel y usar las rutas privadas | `una-clave-larga-y-secreta` |
| `CORS_ORIGIN` | Orígenes permitidos para el frontend, separados por comas | `http://localhost:5173,http://127.0.0.1:5173` |
| `RESEND_API_KEY` | Opción A para enviar correos (Resend) | vacío |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | Opción B para enviar correos (SMTP) | vacío |
| `EMAIL_FROM`, `EMAIL_REPLY_TO`, `STUDIO_EMAIL` | Remitente, respuestas y correo visible del estudio | `fibstudio.of@gmail.com` |
| `WHATSAPP_NUMBER`, `WHATSAPP_MENSAJE` | Enlaces de WhatsApp del correo | `593962377437` |
| `SITE_URL`, `INSTAGRAM_URL` | Enlaces del correo | vacío / URL de Instagram |

### `frontend/.env`

| Variable | Uso | Ejemplo |
| --- | --- | --- |
| `VITE_API_URL` | URL base de la API | `http://localhost:3000` |


## Scripts

Backend:

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Arranca con `node --watch` |
| `npm start` | Arranca sin reinicio automático |
| `npm run seed` | Carga el portafolio inicial |
| `npm run email:test -- tu@correo.com` | Prueba el correo de bienvenida |
| `npm test` | Ejecuta las pruebas del backend |

Frontend:

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo de Vite |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve la versión compilada |
| `npm run lint` | Revisa el código con oxlint |

## Más información

- Endpoints, MongoDB, despliegue y solución de problemas: **[BASE-DE-DATOS.md](BASE-DE-DATOS.md)**.
