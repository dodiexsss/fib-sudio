import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { Mensaje } from '../models/Mensaje.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/**
 * Límite anti-spam: 5 envíos cada 15 minutos por IP.
 * En producción detrás de un proxy (Render, Railway, Fly) hay que activar
 * `app.set('trust proxy', 1)` para que req.ip sea la IP real.
 */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: 'Demasiados envíos desde esta IP. Intenta de nuevo en 15 minutos.',
  },
});

router.post(
  '/',
  contactLimiter,
  asyncHandler(async (req, res) => {
    const { nombre, email, servicio, mensaje, empresa } = req.body ?? {};

    // Honeypot: el campo `empresa` está oculto para personas.
    // Si viene relleno, respondemos 201 sin guardar para no dar pistas al bot.
    if (typeof empresa === 'string' && empresa.trim() !== '') {
      return res.status(201).json({ ok: true, id: null });
    }

    const doc = await Mensaje.create({
      nombre,
      email,
      servicio,
      mensaje,
      origen: 'web',
      ip: req.ip,
      userAgent: (req.get('user-agent') || '').slice(0, 300),
    });

    return res.status(201).json({
      ok: true,
      id: doc._id,
      mensaje: 'Mensaje guardado correctamente.',
    });
  })
);

export default router;
