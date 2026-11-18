import { enviarCorreo } from './transporte.js';
import { plantillaBienvenida } from './plantillas.js';

/**
 * Envía el correo de bienvenida al correo indicado en el formulario.
 * Devuelve `{ enviado, motivo?, proveedor?, id? }`.
 */
export async function enviarBienvenida({ nombre, email, servicio, mensaje }) {
  const { asunto, html, texto } = plantillaBienvenida({
    nombre,
    servicio,
    mensaje,
  });

  return enviarCorreo({
    to: email,
    subject: asunto,
    html,
    text: texto,
  });
}

export { correoConfigurado } from './transporte.js';
