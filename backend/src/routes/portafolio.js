import { Router } from 'express';
import mongoose from 'mongoose';
import { Proyecto } from '../models/Proyecto.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/** Público: alimenta la galería del sitio. */
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const proyectos = await Proyecto.find({ activo: true })
      .sort({ orden: 1, createdAt: 1 })
      .lean();

    res.json(proyectos);
  })
);

/** Privado: crear un proyecto. */
router.post(
  '/',
  adminAuth,
  asyncHandler(async (req, res) => {
    const doc = await Proyecto.create(req.body ?? {});
    res.status(201).json(doc);
  })
);

/** Privado: editar título, imagen, historia, orden, activo, etc. */
router.patch(
  '/:id',
  adminAuth,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID no válido.' });
    }

    const doc = await Proyecto.findByIdAndUpdate(req.params.id, req.body ?? {}, {
      new: true,
      runValidators: true,
    }).lean();

    if (!doc) {
      return res.status(404).json({ error: 'Proyecto no encontrado.' });
    }

    return res.json(doc);
  })
);

/** Privado: borrar un proyecto. */
router.delete(
  '/:id',
  adminAuth,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID no válido.' });
    }

    const doc = await Proyecto.findByIdAndDelete(req.params.id).lean();

    if (!doc) {
      return res.status(404).json({ error: 'Proyecto no encontrado.' });
    }

    return res.json({ ok: true, id: req.params.id });
  })
);

export default router;
