import { timingSafeEqual } from 'node:crypto';

/**
 * Protege las rutas de administración con el header `x-admin-token`.
 * El token se define en ADMIN_TOKEN (.env) y nunca se envía al navegador
 * desde el servidor: la persona lo escribe en /admin y se guarda en sessionStorage.
 */
export function adminAuth(req, res, next) {
  const esperado = process.env.ADMIN_TOKEN;

  if (!esperado) {
    return res.status(503).json({
      error: 'El servidor no tiene ADMIN_TOKEN configurado.',
    });
  }

  const recibido = req.get('x-admin-token') || '';
  const a = Buffer.from(recibido);
  const b = Buffer.from(esperado);

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return res.status(401).json({ error: 'Token inválido.' });
  }

  return next();
}
