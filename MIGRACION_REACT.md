# Migración de mi proyecto a React (carpeta backend \+ carpeta frontend)

Eres mi asistente de programación. Soy estudiante de un curso de desarrollo web (Jóvenes creaTIvos 2026\) y estoy aprendiendo, así que explícame lo que haces con palabras sencillas y en español.

## Objetivo

Hoy mi proyecto tiene un **frontend** hecho con HTML, CSS y JavaScript vanilla y un **backend** con Node.js, Express y MongoDB. Quiero organizarlo en dos carpetas:

- `backend/`: mi API, la misma que ya tengo, sin cambiar su lógica.  
- `frontend/`: mi página migrada a React con Vite. Debe verse y funcionar igual que ahora.

## Estructura final esperada

```
├── backendmi-proyecto/
/
│   ├── package.json
│   ├── .env              (no se sube a Git)
│   ├── .env.example
│   └── src/
│       ├── app.js        (o el archivo que ya tenga)
│       ├── server.js
│       └── ...           (rutas, modelos, etc. que ya existan)
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── .env              (no se sube a Git)
│   ├── .env.example
│   ├── public/
│   │   └── img/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api.js
│       └── components/
├── .gitignore
├── README.md
└── CAMBIOS.md
```

Reglas (obligatorias)

### Tecnologías

- React 19 con Vite y **JavaScript** (no TypeScript). Create React App está descontinuado: no lo uses.  
- Express 5 con `express.json()`. No instales `body-parser`.  
- Para reiniciar el servidor en desarrollo usa `node --watch`, no `nodemon`.  
- MongoDB **local**. No lo cambies a Atlas ni cambies el nombre de la base de datos, los modelos o los datos.  
- Respeta el sistema de módulos que ya usa mi backend (`import` o `require`). No lo conviertas.  
- Solo puedes instalar: `react`, `react-dom`, `vite`, `@vitejs/plugin-react` (vienen con la plantilla), `cors` y lo que mi backend ya tenga. Nada de axios, Redux, librerías de componentes ni TypeScript.  
- Si mi proyecto ya usa Tailwind, mantenlo instalando `tailwindcss` y `@tailwindcss/vite`. Si no lo usa, no lo agregues.  
- **No uses React Router** (se ve en la Sesión 18). Si mi frontend tiene varias páginas HTML, detente en la Fase 0 y pregúntame qué hacer.

### Código

- Un componente por archivo en `frontend/src/components/`, con nombre en PascalCase (ej: `ProductoCard.jsx`).  
- En React están prohibidos `document.querySelector`, `getElementById`, `innerHTML`, `addEventListener` y `classList`. Se reemplazan por JSX, `onClick` / `onSubmit` / `onChange` y `useState`.  
- Las listas se pintan con `.map()` y una `key` única (el `_id` o `id` del dato, nunca el índice).  
- Los formularios usan inputs controlados (`value` \+ `onChange`).  
- Los datos de la API se cargan con `useEffect` y arreglo de dependencias `[]`, con estado de "cargando" y mensaje de error.  
- Todas las llamadas a la API van en `frontend/src/api.js` usando `import.meta.env.VITE_API_URL`. No escribas `http://localhost:...` dentro de los componentes.  
- Mantén mis nombres de variables, mis clases CSS y mis textos. Mi CSS se reutiliza tal cual; solo cambian las rutas de las imágenes.  
- Escribe comentarios cortos en español solo donde aparezca algo nuevo de React (`useState`, `useEffect`, props, `.map`). No comentes lo obvio.  
- No cambies el diseño, los textos ni la lógica. Si encuentras un bug en mi código original, no lo arregles en silencio: anótalo en `CAMBIOS.md`.

### Seguridad

- Nunca muestres en el chat el contenido de mis archivos `.env` (contraseñas, cadena de conexión, claves).  
- Los `.env` no se suben a Git. Crea un `.env.example` con los nombres de las variables y valores de ejemplo.  
- No borres archivos originales hasta la Fase 6, y solo si yo lo confirmo.

### Git

- Si el proyecto no es un repositorio, haz `git init` y un commit con el estado actual antes de tocar nada.  
- Trabaja en una rama nueva llamada `migracion-react`. **Nunca hagas push.**  
- Mueve archivos con `git mv` para conservar el historial.  
- Haz un commit al terminar cada fase, con el mensaje que se indica.

## Cómo vamos a trabajar

Vamos por fases, en orden. Al terminar cada fase:

1. Haz el commit.  
2. Explícame en 3 a 5 líneas qué cambiaste y por qué.  
3. Hazme **una** pregunta corta para comprobar que entendí, sin darme la respuesta.  
4. Espera a que yo escriba **"continúa"**.

Si algo falla o no estás seguro, para y pregúntame. No inventes rutas, endpoints ni datos.

---

### Fase 0 — Análisis (no modifiques nada)

Revisa el proyecto y dame un informe con:

- El árbol de carpetas actual (sin `node_modules`).  
- **Frontend:** páginas HTML, archivos CSS y JS, imágenes, y si usa Tailwind u otra librería por CDN.  
- **Backend:** archivo de entrada, puerto, sistema de módulos, lista de endpoints (método \+ ruta), cómo se conecta a MongoDB (mongoose o driver), si ya usa `cors`, si sirve el frontend con `express.static` y si tiene login.  
- Las llamadas `fetch` que hace hoy el frontend y a qué endpoints van.  
- Los componentes que propones, de qué parte del HTML sale cada uno y cuáles tendrán estado (`useState`).  
- Riesgos o dudas.

Espera mi aprobación antes de seguir.

### Fase 1 — Carpeta backend

- Mueve todo lo del servidor a `backend/` (`package.json`, `package-lock.json`, `src/` o archivos sueltos, `.env`).  
- Si el servidor sirve el frontend viejo con `express.static`, quita esa línea: ahora el frontend vive aparte.  
- Configura `cors` con origen `http://localhost:5173`. Si ya existe, revísalo.  
- En `backend/package.json` deja los scripts `"dev": "node --watch src/server.js"` y `"start": "node src/server.js"`, ajustados a mi archivo de entrada real.  
- Crea `backend/.env.example`.  
- **Verifica:** arranca el servidor, prueba cada endpoint GET con `curl`, muéstrame que responde y luego apágalo.  
- Commit: `refactor: mover API a carpeta backend`

### Fase 2 — Proyecto React con Vite

- Ejecuta `npm create vite@latest frontend -- --template react --no-interactive` y luego `npm install` dentro de `frontend/`.  
- Limpia la plantilla: borra `src/App.css`, `src/assets/` y los archivos de ejemplo de `public/`.  
- Copia mis imágenes a `frontend/public/` (por ejemplo `public/img/`) y mi CSS a `frontend/src/index.css`. Las rutas a imágenes, en el CSS y en el código, empiezan con `/` (ej: `/img/logo.png`).  
- Pasa a `frontend/index.html` el `lang="es"`, el `<title>`, la meta description, el favicon y las fuentes de Google Fonts de mi HTML original.  
- Crea `frontend/.env` con `VITE_API_URL=http://localhost:3000` (usa el puerto real de mi backend) y `frontend/.env.example`.  
- **Verifica:** `npm run build` sin errores.  
- Commit: `chore: crear frontend con Vite + React`

### Fase 3 — Componentes (HTML → JSX)

- Parte mi HTML en los componentes que aprobé. `App.jsx` solo los importa y los ordena.  
- Convierte: `class` → `className`, `for` → `htmlFor`, etiquetas cerradas (`<img />`, `<input />`, `<br />`), `style` como objeto y comentarios `{/* */}`.  
- Las listas que hoy se pintan con `innerHTML` pasan a `.map()` con un componente (ej: `ProductoCard`) que recibe props. Si esos datos vienen de la API, por ahora usa datos de prueba en `frontend/src/data/`; se conectan en la Fase 5\.  
- Todavía sin interactividad.  
- **Verifica:** `npm run build` y `npm run lint` sin errores.  
- Commit: `feat: componentes de la página en React`

### Fase 4 — Interactividad con useState

- Todo lo que hoy hace mi JavaScript (menú, filtros, carrito, modales, pestañas, validación de formularios…) pasa a `useState` \+ eventos de React, dentro del componente que lo usa.  
- Si dos componentes necesitan el mismo dato (ej: el contador del carrito en el header y los botones del catálogo), sube el estado al padre común y pásalo por props.  
- Si mi página guardaba algo en `localStorage`, mantén ese comportamiento.  
- **Verifica:** build y lint sin errores. Dame una lista de cosas que debo probar en el navegador.  
- Commit: `feat: interactividad con useState`

### Fase 5 — Conectar con la API

- En `frontend/src/api.js` crea una función por cada endpoint que use el frontend (ej: `obtenerProductos()`, `crearPedido(datos)`), con `fetch` y `VITE_API_URL`. Si la respuesta no es `ok`, lanza un error.  
- En los componentes, carga los datos con `useEffect(() => { ... }, [])`, con estados `cargando` y `error`. Borra los datos de prueba de la Fase 3\.  
- En POST, PUT y DELETE envía el header `Content-Type: application/json` y el cuerpo con `JSON.stringify`.  
- Si hay login con token, mantenlo igual: mismo lugar donde se guarda y mismo header.  
- **Verifica:** con el backend y MongoDB encendidos, prueba los endpoints. Dame la lista de pruebas para hacer en el navegador.  
- Commit: `feat: frontend conectado a la API`

### Fase 6 — Limpieza y documentación

- Crea un `.gitignore` en la raíz con `node_modules/`, `.env` y `dist/` (aplica a las dos carpetas).  
- Muéstrame la lista de archivos del frontend vanilla que ya no se usan y pregúntame si los borro o los muevo a `_vanilla-original/`.  
- `README.md` en la raíz con: requisitos (Node.js y MongoDB local), cómo instalar, cómo correr (dos terminales: `cd backend && npm run dev` y `cd frontend && npm run dev`) y las variables de entorno.  
- `CAMBIOS.md` con una tabla "antes (vanilla) → ahora (React)" por archivo y por funcionalidad, explicada para principiantes, más los bugs o dudas que encontraste.  
- **Verificación final:** build y lint sin errores, y el servidor arranca.  
- Commit: `docs: README y resumen de la migración`

---

Empieza con la **Fase 0**.