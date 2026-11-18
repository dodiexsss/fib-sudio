import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import contactoRouter from './routes/contacto.js';
import mensajesRouter from './routes/mensajes.js';
import portafolioRouter from './routes/portafolio.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  // Necesario para que req.ip sea la IP real detrás de un proxy (Render, Railway, Nginx…).
  app.set('trust proxy', 1);

  app.use(express.json({ limit: '100kb' }));

  // CORS: el frontend React corre en el puerto 5173 de Vite.
  // Si defines CORS_ORIGIN en .env, se usan esos dominios (separados por comas).
  const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origen) => origen.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: origins,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'x-admin-token'],
    })
  );

  // --- API ---------------------------------------------------------------
  app.get('/api/salud', (_req, res) => {
    res.json({
      ok: true,
      db: mongoose.connection.readyState === 1 ? 'conectada' : 'desconectada',
    });
  });

  app.use('/api/contacto', contactoRouter);
  app.use('/api/mensajes', mensajesRouter);
  app.use('/api/portafolio', portafolioRouter);

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Ruta de API no encontrada.' });
  });

  // --- Errores -----------------------------------------------------------
  app.use((err, _req, res, _next) => {
    if (err.name === 'ValidationError') {
      const detalles = Object.fromEntries(
        Object.entries(err.errors).map(([campo, error]) => [campo, error.message])
      );
      return res.status(400).json({ error: 'Datos no válidos.', detalles });
    }

    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'El cuerpo de la petición no es JSON válido.' });
    }

    console.error('[error]', err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  });

  return app;
}
