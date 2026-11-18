import nodemailer from 'nodemailer';

/**
 * Transporte de correo con dos proveedores posibles:
 *
 * 1. Resend (HTTPS) → define RESEND_API_KEY. Ideal en Render/Railway, donde
 *    algunos planes bloquean los puertos SMTP.
 * 2. SMTP (nodemailer) → define SMTP_HOST, SMTP_USER y SMTP_PASS. Sirve con
 *    Gmail (contraseña de aplicación), Brevo, Mailgun, Zoho, etc.
 *
 * Si no hay credenciales, `enviarCorreo` no falla: devuelve
 * `{ enviado: false, motivo: 'sin-configuracion' }` y el formulario sigue
 * funcionando con normalidad.
 */

let transportador = null;
let claveTransportador = '';

function textoEnv(nombre) {
  return String(process.env[nombre] ?? '').trim();
}

function leerConfiguracion() {
  const host = textoEnv('SMTP_HOST');
  const user = textoEnv('SMTP_USER');
  const pass = textoEnv('SMTP_PASS');
  const remitente = textoEnv('EMAIL_FROM');

  return {
    resendKey: textoEnv('RESEND_API_KEY'),
    host,
    user,
    pass,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    from: remitente || (user ? `FibStudio <${user}>` : ''),
    replyTo: textoEnv('EMAIL_REPLY_TO') || textoEnv('STUDIO_EMAIL') || user,
    configuradoPorSmtp: Boolean(host && user && pass),
  };
}

export function correoConfigurado() {
  const config = leerConfiguracion();
  return Boolean(config.resendKey || config.configuradoPorSmtp);
}

function obtenerTransportador(config) {
  const clave = `${config.host}|${config.port}|${config.secure}|${config.user}|${config.pass}`;
  if (transportador && claveTransportador === clave) return transportador;

  transportador = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
  });
  claveTransportador = clave;
  return transportador;
}

async function enviarConResend(config, mensaje) {
  const respuesta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.from,
      to: [mensaje.to],
      subject: mensaje.subject,
      html: mensaje.html,
      text: mensaje.text,
      reply_to: config.replyTo || undefined,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text().catch(() => '');
    throw new Error(
      `Resend respondió ${respuesta.status}${detalle ? `: ${detalle.slice(0, 300)}` : ''}`
    );
  }

  const datos = await respuesta.json().catch(() => ({}));
  return { enviado: true, proveedor: 'resend', id: datos.id ?? null };
}

export async function enviarCorreo({ to, subject, html, text }) {
  const config = leerConfiguracion();

  if (!config.resendKey && !config.configuradoPorSmtp) {
    return { enviado: false, motivo: 'sin-configuracion' };
  }

  if (!config.from) {
    throw new Error('Falta EMAIL_FROM (o SMTP_USER) para indicar el remitente.');
  }

  if (config.resendKey) {
    return enviarConResend(config, { to, subject, html, text });
  }

  const informacion = await obtenerTransportador(config).sendMail({
    from: config.from,
    to,
    subject,
    html,
    text,
    replyTo: config.replyTo || undefined,
  });

  return {
    enviado: true,
    proveedor: 'smtp',
    id: informacion.messageId ?? null,
  };
}
