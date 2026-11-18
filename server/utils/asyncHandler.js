/**
 * Express 4 no captura errores de funciones async automáticamente.
 * Este wrapper los envía a next() para que lleguen al manejador de errores.
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
