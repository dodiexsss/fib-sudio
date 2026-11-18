# FibStudio

**Fotografía de eventos y sesiones personalizadas.**

> No fotografiamos momentos. Fotografiamos _lo que sentiste_ en ellos.

---

## Qué es FibStudio

FibStudio es un estudio de fotografía que nace de una idea sencilla: toda buena fotografía sigue una proporción invisible, igual que toda buena historia sigue una emoción.

No vendemos fotos sueltas. Vendemos la posibilidad de volver a sentir un día dentro de veinte años: la mirada antes del sí, el abrazo que nadie posó, la luz de las seis de la tarde sobre una familia reunida. Nuestro trabajo empieza mucho antes de levantar la cámara y termina cuando la persona mira su galería y se reconoce en ella.

Somos un emprendimiento pequeño por decisión. Trabajamos con agenda limitada porque cada proyecto merece atención real, no una plantilla.

## El nombre: Fibonacci como filosofía

**Fib** viene de Fibonacci, la secuencia detrás de la espiral áurea que artistas y fotógrafos usan desde hace siglos para guiar la mirada hacia lo que importa.

La espiral es nuestra firma y también nuestro método:

- Cada escena tiene un punto de atención emocional: una mirada, un abrazo, un silencio.
- Nuestro trabajo es encontrarlo, encuadrarlo y dejar que la composición lo sostenga.
- Nada de fórmulas frías: cada sesión se planea a partir de lo que quieres recordar, no de lo que se acostumbra fotografiar.

## Qué ofrecemos

### Cobertura de eventos

Bodas, cumpleaños, bautizos, graduaciones, celebraciones familiares, lanzamientos de marca y eventos corporativos.

Nos movemos sin interrumpir, atentos a los gestos que nadie más ve, para entregar el evento completo tal como se sintió. Desde cuatro horas hasta jornada completa, con opción de segundo fotógrafo y un adelanto en las primeras 48 horas.

### Sesiones personalizadas

Retratos, parejas, familias, embarazo, marca personal y books.

Diseñamos la sesión alrededor de una idea o un sentimiento concreto, no de una pose genérica. Incluye conversación previa, guía de vestuario, moodboard y una locación a elección del cliente o propuesta por el estudio. Tú llegas; nosotros guiamos el resto.

### Extras que completan la historia

- Video corto detrás de cámaras en sesiones.
- Piezas audiovisuales cotizadas aparte para eventos.
- Entrega digital en alta resolución, editada y organizada por momentos.

## Cómo trabajamos

1. **Conversamos.** Nos cuentas tu evento o idea, las fechas y qué quieres sentir al ver las fotos.
2. **Planeamos.** Definimos locación, tiempos y una guía visual para que nada se improvise.
3. **Disparamos.** El día acordado, con calma, presencia y atención a lo que de verdad importa.
4. **Entregamos.** Editamos con cuidado y entregamos una galería lista para guardar y compartir.

## Lo que prometemos

- **Respuesta en menos de 24 horas** con disponibilidad y una propuesta a la medida.
- **Un adelanto a las 48 horas** en coberturas de eventos, para compartir mientras trabajamos el resto.
- **Edición una por una**, con look natural: color, luz y detalle, sin filtros automáticos.
- **Todo por escrito**: alcance, tiempos de entrega, mínimo de fotos y condiciones del anticipo.
- **Derechos de uso personal** para imprimir, compartir y publicar, con mención al estudio.
- **Cero poses forzadas.** Dirigimos cuando hace falta, pero las mejores fotos salen de conversar y dejarse llevar.

## A quién servimos

A personas y marcas que quieren recordar algo que les importa: parejas que se casan, familias que crecen, emprendedores que lanzan, personas que necesitan una imagen que hable de ellas sin traicionarlas.

También a quienes no se sienten cómodos frente a la cámara. Ese miedo es, muchas veces, el punto de partida de la mejor sesión.

## El modelo de negocio

Cada proyecto se cotiza a medida. No es lo mismo una sesión de una hora que una boda de jornada completa. El valor depende de:

- La duración de la cobertura o sesión.
- La locación y los traslados.
- La necesidad de un segundo fotógrafo.
- Los entregables elegidos.

Al confirmar la fecha se acuerda un anticipo y el saldo se paga antes de la entrega final. El medio de pago se coordina directamente con el cliente.

La agenda es limitada a propósito: es la forma de sostener la calidad y de que cada cliente sienta que su proyecto es el único. En temporada de bodas y fin de año conviene reservar con anticipación.

## La presencia digital como parte del negocio

Para un estudio pequeño, el sitio web no es una tarjeta de presentación: es el primer contacto y el primer filtro. Por eso FibStudio no solo muestra el portafolio, también acompaña la decisión de compra.

- **Portafolio vivo**, con historias detrás de cada imagen y no solo una cuadrícula bonita.
- **Formulario de contacto** que registra cada solicitud y avisa al estudio.
- **Correo automático de bienvenida** con la información del estudio y un acceso directo a WhatsApp.
- **Asistente de preguntas frecuentes** que responde sobre precios, reservas, entregas, pagos, vestuario y más, y deriva a una persona cuando la pregunta lo merece.
- **Panel privado** para leer y gestionar los mensajes, marcar estados y no perder ninguna oportunidad.
- **Respuesta humana** en menos de 24 horas. La tecnología ordena; las personas deciden.

## Identidad y tono

FibStudio habla en primera persona del plural, con calma y sin tecnicismos. La estética acompaña la idea: espirales, proporción, luz cálida, mucho espacio para respirar y un acento tipográfico que recuerda que detrás de cada foto hay una historia.

El nombre se escribe **fibstudio** en el logotipo, con la segunda mitad en color de acento, y **FibStudio** en el texto.

## Dónde encontrarnos

- **Correo:** fibstudio.of@gmail.com
- **WhatsApp:** [+593 96 237 7437](https://wa.me/593962377437)
- **Instagram:** [@fib.studio.oc](https://www.instagram.com/fib.studio.oc)

---

# Anexo técnico

Esta sección es solo una guía rápida para quien mantenga el proyecto. La historia del emprendimiento está arriba.

## Cómo está organizado

```
fib-studio/
├── backend/            API REST con Express, MongoDB y Mongoose
│   ├── src/
│   │   ├── routes/     contacto, mensajes, portafolio
│   │   ├── models/     Mensaje y Proyecto
│   │   ├── email/      correo automático (Resend o SMTP)
│   │   ├── middleware/ protección del panel con ADMIN_TOKEN
│   │   └── data/       portafolio inicial para el seed
│   └── test/           pruebas de API y correo
├── frontend/           React + Vite
│   ├── src/components/ secciones del sitio y panel
│   ├── src/dashboard/  entrada del panel privado
│   ├── src/gracias/    página de confirmación
│   └── public/img/     fotografías del portafolio
├── _vanilla-original/  primera versión del sitio, conservada como referencia
└── BASE-DE-DATOS.md    guía detallada de base de datos y despliegue
```

## Cómo funciona, en breve

1. El visitante navega el sitio y consulta el portafolio, servido por la API.
2. Al enviar el formulario, la API valida los datos, guarda el mensaje y dispara el correo de bienvenida.
3. Un asistente responde preguntas frecuentes en el navegador y ofrece WhatsApp o el formulario para cerrar la conversación.
4. El estudio entra al panel privado con su token, revisa los mensajes y cambia su estado a leído o respondido.

### Puesta en marcha rápida

```bash
# Backend
cd backend
npm install
npm run seed
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

Variables de entorno: copia `backend/.env.example` y `frontend/.env.example` a `.env` y completa los valores. Para el despliegue y la configuración de MongoDB, consulta `BASE-DE-DATOS.md`.

**Stack:** Node.js 20+, Express, MongoDB/Mongoose, React 19, Vite.
