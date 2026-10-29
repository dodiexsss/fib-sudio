# Base de datos MongoDB — guía de implementación

Esta guía explica cómo el sitio de FibStudio pasó de ser una página estática a una
aplicación real: el formulario de contacto guarda mensajes en **MongoDB** y el
portafolio se puede administrar sin tocar el HTML.

---

## 1. Cómo quedó la arquitectura

```
Navegador
   │
   ├── GET  /                  → index.html (el sitio)
   ├── GET  /admin             → dashboard.html (panel privado)
   ├── POST /api/contacto      → guarda un mensaje
   └── GET  /api/portafolio    → lee los proyectos de la galería
          │
          ▼
   Express (Node.js)
          │  Mongoose
          ▼
      MongoDB (Atlas o local)
```

Todo lo sirve el mismo servidor Express, así que no hay problemas de CORS en
local ni en un despliegue único. Si separas el frontend (Netlify) de la API
(Render), se explica más abajo cómo conectarlos.

### Archivos nuevos

| Archivo | Para qué sirve |
| --- | --- |
| `package.json` | Dependencias y scripts (`start`, `dev`, `seed`, `test`) |
| `.env.example` | Plantilla de variables de entorno (copia a `.env`) |
| `server/index.js` | Arranque: conecta a Mongo y levanta Express |
| `server/app.js` | Configuración de Express, estáticos, API y errores |
| `server/db.js` | Conexión y desconexión de Mongoose |
| `server/models/Mensaje.js` | Esquema de los mensajes del formulario |
| `server/models/Proyecto.js` | Esquema de los proyectos del portafolio |
| `server/routes/contacto.js` | `POST /api/contacto` + límite anti-spam |
| `server/routes/mensajes.js` | Listado, estados y borrado (privado) |
| `server/routes/portafolio.js` | Lectura pública y CRUD privado |
| `server/middleware/adminAuth.js` | Protección con `ADMIN_TOKEN` |
| `server/data/proyectos.js` | Contenido inicial del portafolio |
| `server/seed.js` | Carga idempotente de ese contenido |
| `dashboard.html` | Panel privado para leer y gestionar mensajes |
| `test/api.test.js` | Pruebas de integración con MongoDB en memoria |

### Modelo de datos

**Mensaje** (colección `mensajes`):

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

- `servicio`: `evento` | `sesion` | `otro`
- `estado`: `nuevo` | `leido` | `respondido`
- `ip` y `userAgent` se guardan pero no se devuelven por la API (`select: false`).

**Proyecto** (colección `proyectos`):

```json
{
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

### Endpoints

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/salud` | público | Estado del servidor y de la conexión a Mongo |
| `POST` | `/api/contacto` | público (5 cada 15 min/IP) | Guarda un mensaje |
| `GET` | `/api/portafolio` | público | Proyectos activos ordenados |
| `POST` | `/api/portafolio` | token | Crea un proyecto |
| `PATCH` | `/api/portafolio/:id` | token | Edita un proyecto |
| `DELETE` | `/api/portafolio/:id` | token | Borra un proyecto |
| `GET` | `/api/mensajes` | token | Lista mensajes (`?estado=nuevo`) |
| `GET` | `/api/mensajes/stats` | token | Totales por estado |
| `PATCH` | `/api/mensajes/:id` | token | Cambia el estado |
| `DELETE` | `/api/mensajes/:id` | token | Borra un mensaje |

Las rutas privadas esperan el header `x-admin-token: <ADMIN_TOKEN>`.

---

## 2. Ponerlo a funcionar en local

### Requisitos

- Node.js 20 o superior.
- Una base MongoDB. Elige **una** de estas opciones:
  - **MongoDB Atlas** (nube, gratis, no instalas nada).
  - **Docker**: `docker run -d --name fibstudio-mongo -p 27017:27017 -v fibstudio_mongo:/data/db mongo:7`
  - **MongoDB Community Server** instalado en tu equipo.

### Pasos

```bash
# 1. Dependencias
npm install

# 2. Variables de entorno
#    Windows (PowerShell):
Copy-Item .env.example .env
#    macOS / Linux:
# cp .env.example .env

# 3. Edita .env y completa MONGODB_URI y ADMIN_TOKEN

# 4. Carga el portafolio inicial en la base
npm run seed

# 5. Arranca
npm run dev        # reinicia solo al guardar
# o
npm start
```

Abre:

- Sitio: <http://localhost:3000>
- Panel privado: <http://localhost:3000/admin>

> `npm test` levanta un MongoDB temporal en memoria y prueba la API completa.
> La primera ejecución descarga el binario de MongoDB (unos 100 MB).

---

## 3. Crear la base en MongoDB Atlas (recomendado para producción)

1. Crea una cuenta en <https://www.mongodb.com/cloud/atlas/register>.
2. **Create** → elige el plan **M0 Free** → proveedor y región cercanos
   (por ejemplo AWS `us-east-1` o `sa-east-1`).
3. En **Database Access** crea un usuario con contraseña (no uses tu usuario
   personal). Guarda la contraseña en un gestor de contraseñas.
4. En **Network Access** agrega `0.0.0.0/0` si vas a desplegar en un servicio
   sin IP fija (Render, Railway, Vercel). Es lo habitual en el plan gratuito;
   compensa con una contraseña larga y el token de administración.
   Si tu proveedor ofrece IP fija, permite solo esa IP.
5. En **Database** → **Connect** → **Drivers** copia la cadena:

   ```
   mongodb+srv://fibstudio:<PASSWORD>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. Añade el nombre de la base antes del `?` y pega todo en `.env`:

   ```
   MONGODB_URI=mongodb+srv://fibstudio:TU_PASSWORD@cluster0.xxxxx.mongodb.net/fibstudio?retryWrites=true&w=majority
   ```

   Mongoose crea la base y las colecciones automáticamente al primer insert.

7. Ejecuta `npm run seed` para cargar el portafolio.

### Generar un ADMIN_TOKEN seguro

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado en `.env` (`ADMIN_TOKEN=...`). No lo subas al repositorio:
`.env` ya está en `.gitignore`.

---

## 4. Desplegar

### Opción A — todo en un solo servicio (más simple)

Render, Railway o Fly.io pueden ejecutar el repositorio completo:

| Ajuste | Valor |
| --- | --- |
| Build command | `npm install` |
| Start command | `npm start` |
| Variables | `MONGODB_URI`, `ADMIN_TOKEN`, `PORT` (lo define el proveedor) |

El sitio queda en `https://tu-servicio.onrender.com` y el panel en `/admin`.

> En el plan gratuito de Render el servicio se duerme tras un rato de inactividad
> y el primer acceso tarda unos segundos.

### Opción B — frontend en Netlify + API en Render

1. Despliega la API como en la opción A.
2. En `index.html`, cambia la meta etiqueta:

   ```html
   <meta name="fibstudio-api" content="https://tu-api.onrender.com" />
   ```

3. En el servicio de la API define:

   ```
   CORS_ORIGIN=https://tu-sitio.netlify.app
   ```

4. Despliega el sitio en Netlify. El formulario usará la API; si algún día la API
   no responde, el JavaScript intenta el envío clásico de Netlify Forms como
   respaldo.

> El panel `/admin` se sirve desde la API, no desde Netlify. Entra a
> `https://tu-api.onrender.com/admin`.

---

## 5. Seguridad y buenas prácticas ya incluidas

- **Validación en el servidor** con esquemas de Mongoose (no se confía en el navegador).
- **Honeypot** (`empresa`) + **rate limit** de 5 envíos/15 min por IP.
- **Token de administración** comparado con `timingSafeEqual` (evita ataques de tiempo).
- **CORS cerrado** por defecto: solo se abre si defines `CORS_ORIGIN`.
- **Solo se sirven** `/css`, `index.html` y `dashboard.html`; el código del servidor
  y el `.env` nunca son accesibles por HTTP.
- **Índices** en `createdAt`, `estado` y `activo/orden` para consultas rápidas.

### Recomendaciones para una app más grande

- Notificaciones por correo al recibir un mensaje (Resend, Postmark o Nodemailer).
- Autenticación real con usuarios y sesiones (better-auth, Auth.js o JWT) en lugar
  de un token compartido.
- Subida de imágenes a Cloudinary/S3 en lugar de rutas locales.
- Backups de Atlas y alertas de uso.
- Migrar a Next.js si el sitio crece a varias páginas o necesitas SSR.

---

## 6. Problemas frecuentes

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `Falta la variable MONGODB_URI` | No existe `.env` | `Copy-Item .env.example .env` y complétalo |
| `Could not connect to any servers` | Atlas bloquea tu IP o la contraseña tiene caracteres sin codificar | Revisa Network Access y codifica `@ : / ?` en la contraseña |
| `/admin` dice «No se pudo conectar» | El servidor no está corriendo o faltó `ADMIN_TOKEN` | `npm run dev` y revisa la consola |
| El formulario dice «problema al enviar» | La API no responde y Netlify tampoco está disponible | Abre `/api/salud` y revisa la terminal del servidor |
| La galería no cambia | El seed no se ejecutó o los proyectos están `activo: false` | `npm run seed` y revisa la colección `proyectos` |

---

## 7. Probar la API a mano

```bash
# Estado
curl http://localhost:3000/api/salud

# Crear un mensaje
curl -X POST http://localhost:3000/api/contacto \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","email":"ana@example.com","servicio":"sesion","mensaje":"Hola, quiero una sesión."}'

# Listar mensajes (privado)
curl http://localhost:3000/api/mensajes \
  -H "x-admin-token: TU_TOKEN"
```

En PowerShell usa `curl.exe` o `Invoke-RestMethod`.
