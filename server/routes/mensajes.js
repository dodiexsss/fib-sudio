import { Router } from 'express';
import mongoose from 'mongoose';
import { Mensaje } from '../models/Mensaje.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Todas las rutas de mensajes son privadas.
router.use(adminAuth);

/** Resumen para las tarjetas del panel. */
router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const [total, nuevo, leido, respondido] = await Promise.all([
      Mensaje.countDocuments(),
      Mensaje.countDocuments({ estado: 'nuevo' }),
      Mensaje.countDocuments({ estado: 'leido' }),
      Mensaje.countDocuments({ estado: 'respondido' }),
    ]);

    res.json({ total, nuevo, leido, respondido });
  })
);

/** Listado, más recientes primero. Filtro opcional: /api/mensajes?estado=nuevo */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { estado } = req.query;
    const filtro = {};

    if (estado) {
      if (!['nuevo', 'leido', 'respondido'].includes(estado)) {
        return res.status(400).json({ error: 'Estado no válido.' });
      }
      filtro.estado = estado;
    }

    const mensajes = await Mensaje.find(filtro)
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return res.json(mensajes);
  })
);

/** Cambiar el estado de un mensaje: { "estado": "leido" } */
router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const { estado } = req.body ?? {};

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID no válido.' });
    }

    if (!['nuevo', 'leido', 'respondido'].includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido.' });
    }

    const doc = await Mensaje.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    ).lean();

    if (!doc) {
      return res.status(404).json({ error: 'Mensaje no encontrado.' });
    }

    return res.json(doc);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID no válido.' });
    }

    const doc = await Mensaje.findByIdAndDelete(req.params.id).lean();

    if (!doc) {
      return res.status(404).json({ error: 'Mensaje no encontrado.' });
    }

    return res.json({ ok: true, id: req.params.id });
  })
);

export default router;
