import { test } from 'node:test';
import assert from 'node:assert/strict';
import { plantillaBienvenida, crearEnlaceWhatsapp } from '../server/email/plantillas.js';
import { correoConfigurado, enviarCorreo } from '../server/email/transporte.js';

const CLAVES_CORREO = [
  'RESEND_API_KEY',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_PORT',
  'SMTP_SECURE',
  'EMAIL_FROM',
  'WHATSAPP_NUMBER',
  'WHATSAPP_MENSAJE',
];

async function sinConfiguracion(callback) {
  const respaldo = Object.fromEntries(CLAVES_CORREO.map((clave) => [clave, process.env[clave]]));
  CLAVES_CORREO.forEach((clave) => delete process.env[clave]);

  try {
    return await callback();
  } finally {
    for (const [clave, valor] of Object.entries(respaldo)) {
      if (valor === undefined) delete process.env[clave];
      else process.env[clave] = valor;
    }
  }
}

test('el correo de bienvenida usa el tono y la información del sitio', async () => {
  await sinConfiguracion(() => {
    const { asunto, html, texto } = plantillaBienvenida({
      nombre: 'Ana Pérez',
      servicio: 'evento',
      mensaje: 'Quiero cotizar una boda para diciembre.',
    });

    assert.match(asunto, /Ana Pérez/);
    assert.match(asunto, /FibStudio/);
    assert.match(html, /Cobertura de evento/);
    assert.match(html, /menos de 24 horas/);
    assert.match(html, /Agendar mi asesoría por WhatsApp/);
    assert.match(html, /https:\/\/wa\.me\/593962377437/);
    assert.match(texto, /LO QUE NOS CONTASTE/);
    assert.match(texto, /Quiero cotizar una boda para diciembre/);
  });
});

test('el HTML del correo escapa el contenido enviado por la persona', () => {
  const { html } = plantillaBienvenida({
    nombre: '<script>alert(1)</script>',
    servicio: 'sesion',
    mensaje: '<img src=x onerror="alert(2)">',
  });

  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<img src=x'));
  assert.match(html, /&lt;script&gt;/);
});

test('permite personalizar número y mensaje de WhatsApp', () => {
  const respaldoNumero = process.env.WHATSAPP_NUMBER;
  const respaldoMensaje = process.env.WHATSAPP_MENSAJE;

  process.env.WHATSAPP_NUMBER = '+1 (555) 123-4567';
  process.env.WHATSAPP_MENSAJE = 'Hola, soy {nombre} y quiero una cita.';

  try {
    const enlace = crearEnlaceWhatsapp(
      process.env.WHATSAPP_NUMBER,
      process.env.WHATSAPP_MENSAJE,
      'Ana'
    );
    assert.equal(
      enlace,
      'https://wa.me/15551234567?text=' +
        encodeURIComponent('Hola, soy Ana y quiero una cita.')
    );
  } finally {
    if (respaldoNumero === undefined) delete process.env.WHATSAPP_NUMBER;
    else process.env.WHATSAPP_NUMBER = respaldoNumero;

    if (respaldoMensaje === undefined) delete process.env.WHATSAPP_MENSAJE;
    else process.env.WHATSAPP_MENSAJE = respaldoMensaje;
  }
});

test('sin credenciales el envío se omite en vez de romper el formulario', async () => {
  await sinConfiguracion(async () => {
    assert.equal(correoConfigurado(), false);

    const resultado = await enviarCorreo({
      to: 'ana@example.com',
      subject: 'Prueba',
      html: '<p>Prueba</p>',
      text: 'Prueba',
    });

    assert.deepEqual(resultado, { enviado: false, motivo: 'sin-configuracion' });
  });
});
