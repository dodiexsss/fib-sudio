import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../server/app.js';
import { Mensaje } from '../server/models/Mensaje.js';
import { Proyecto } from '../server/models/Proyecto.js';

process.env.ADMIN_TOKEN = 'token-de-prueba';

let mongo;
let server;
let base;

const auth = { 'x-admin-token': 'token-de-prueba' };

async function postJSON(ruta, body, headers = {}) {
  return fetch(base + ruta, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

before(async () => {
  // MongoDB real en memoria (descarga un binario la primera vez).
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  await mongo.stop();
});

test('GET /api/salud informa que la base está conectada', async () => {
  const res = await fetch(base + '/api/salud');
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.equal(data.db, 'conectada');
});

test('sirve el sitio y el panel sin exponer el código del servidor', async () => {
  const home = await fetch(base + '/');
  assert.equal(home.status, 200);
  assert.match(await home.text(), /FibStudio/);

  const panel = await fetch(base + '/admin');
  assert.equal(panel.status, 200);
  assert.match(await panel.text(), /Panel de mensajes/);

  const css = await fetch(base + '/css/images/styles.css');
  assert.equal(css.status, 200);

  const env = await fetch(base + '/.env');
  assert.notEqual(env.status, 200);

  const serverFile = await fetch(base + '/server/index.js');
  assert.notEqual(serverFile.status, 200);
});

test('las rutas privadas exigen token', async () => {
  const res = await fetch(base + '/api/mensajes');
  assert.equal(res.status, 401);
});

test('POST /api/contacto guarda un mensaje válido', async () => {
  const res = await postJSON('/api/contacto', {
    nombre: 'Ana Pérez',
    email: 'ANA@example.com',
    servicio: 'evento',
    mensaje: 'Quiero cotizar una boda para diciembre.',
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.ok, true);

  const guardado = await Mensaje.findById(data.id);
  assert.equal(guardado.nombre, 'Ana Pérez');
  assert.equal(guardado.email, 'ana@example.com'); // se normaliza a minúsculas
  assert.equal(guardado.estado, 'nuevo');

  const lista = await fetch(base + '/api/mensajes', { headers: auth });
  assert.equal(lista.status, 200);
  const mensajes = await lista.json();
  assert.equal(mensajes.length, 1);
  assert.equal(mensajes[0].nombre, 'Ana Pérez');
});

test('POST /api/contacto rechaza datos inválidos', async () => {
  const res = await postJSON('/api/contacto', {
    nombre: 'Sin correo',
    email: 'no-es-un-correo',
    servicio: 'evento',
    mensaje: 'Mensaje suficientemente largo.',
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok(data.detalles.email);
});

test('el honeypot descarta el envío sin guardarlo', async () => {
  const antes = await Mensaje.countDocuments();

  const res = await postJSON('/api/contacto', {
    nombre: 'Bot',
    email: 'bot@example.com',
    servicio: 'otro',
    mensaje: 'Este mensaje no debe guardarse nunca.',
    empresa: 'spam',
  });

  assert.equal(res.status, 201);
  assert.equal(await Mensaje.countDocuments(), antes);
});

test('PATCH /api/mensajes/:id cambia el estado', async () => {
  const mensaje = await Mensaje.findOne({ email: 'ana@example.com' });

  const res = await fetch(base + '/api/mensajes/' + mensaje._id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...auth },
    body: JSON.stringify({ estado: 'respondido' }),
  });

  assert.equal(res.status, 200);
  const actualizado = await Mensaje.findById(mensaje._id);
  assert.equal(actualizado.estado, 'respondido');
});

test('GET /api/portafolio devuelve solo proyectos activos ordenados', async () => {
  await Proyecto.create({
    titulo: 'Sesión de prueba',
    categoria: 'sesiones',
    imagen: 'css/images/images.jpg',
    alt: 'Prueba',
    historia: 'Historia',
    orden: 1,
  });
  await Proyecto.create({
    titulo: 'Proyecto oculto',
    categoria: 'eventos',
    imagen: 'css/images/familia.jpg',
    alt: 'Oculto',
    activo: false,
    orden: 0,
  });

  const res = await fetch(base + '/api/portafolio');
  assert.equal(res.status, 200);
  const proyectos = await res.json();
  assert.equal(proyectos.length, 1);
  assert.equal(proyectos[0].titulo, 'Sesión de prueba');
});
