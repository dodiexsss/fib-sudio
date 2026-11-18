import 'dotenv/config';
import { correoConfigurado } from './transporte.js';
import { enviarBienvenida } from './index.js';

/**
 * Prueba rápida del correo de bienvenida sin pasar por el formulario.
 *
 * Uso:
 *   npm run email:test -- tu@correo.com
 *
 * Usa las mismas variables del .env (SMTP_* o RESEND_API_KEY).
 */
const destino = process.argv[2] || process.env.EMAIL_TEST_TO;

if (!destino) {
  console.error('Uso: npm run email:test -- tu@correo.com');
  process.exit(1);
}

if (!correoConfigurado()) {
  console.error(
    'No hay correo configurado. Define RESEND_API_KEY o SMTP_HOST + SMTP_USER + SMTP_PASS en .env.'
  );
  process.exit(1);
}

try {
  const resultado = await enviarBienvenida({
    nombre: 'Prueba',
    email: destino,
    servicio: 'sesion',
    mensaje:
      'Este es un correo de prueba enviado desde el formulario de FibStudio para comprobar la configuración.',
  });

  if (resultado.enviado) {
    console.log(`Correo de prueba enviado a ${destino} vía ${resultado.proveedor}.`);
  } else {
    console.log(`No se envió el correo (${resultado.motivo || 'sin configuración'}).`);
  }
} catch (error) {
  console.error('No se pudo enviar el correo de prueba:', error.message);
  process.exit(1);
}
