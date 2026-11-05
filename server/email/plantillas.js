import { escaparHtml as esc } from '../utils/html.js';

const NUMERO_WHATSAPP_POR_DEFECTO = '593962377437';
const CORREO_ESTUDIO_POR_DEFECTO = 'fibstudio@gmail.com';
const INSTAGRAM_POR_DEFECTO = 'https://instagram.com';
const MENSAJE_WHATSAPP_POR_DEFECTO =
  'Hola FibStudio, soy {nombre}. Acabo de enviar el formulario y quiero agendar mi asesoría personalizada.';

const SERVICIOS = {
  evento: {
    etiqueta: 'Cobertura de evento',
    descripcion:
      'Bodas, cumpleaños, lanzamientos y celebraciones familiares. Nos movemos sin interrumpir y documentamos el evento completo tal como se sintió.',
  },
  sesion: {
    etiqueta: 'Sesión personalizada',
    descripcion:
      'Retratos, parejas, familias y marca personal. Diseñamos la sesión alrededor de una idea concreta, con guía de vestuario y moodboard previo.',
  },
  otro: {
    etiqueta: 'Asesoría personalizada',
    descripcion:
      'Si todavía no sabes qué necesitas, conversamos y te proponemos el formato que mejor cuente tu historia.',
  },
};

function recortar(texto, maximo = 320) {
  const limpio = String(texto ?? '').trim().replace(/\s+/g, ' ');
  if (limpio.length <= maximo) return limpio;
  return `${limpio.slice(0, maximo - 1).trimEnd()}…`;
}

function limpiarCabecera(valor) {
  return String(valor ?? '').replace(/[\r\n]+/g, ' ').trim();
}

function urlSegura(valor) {
  try {
    const url = new URL(String(valor));
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return url.toString().replace(/\/+$/, '');
  } catch {
    return '';
  }
}

function numeroWhatsapp(valor) {
  const digitos = String(valor ?? '').replace(/\D/g, '');
  return digitos.length >= 8 ? digitos : NUMERO_WHATSAPP_POR_DEFECTO;
}

export function crearEnlaceWhatsapp(numero, mensaje, nombre = '') {
  const texto = String(mensaje || MENSAJE_WHATSAPP_POR_DEFECTO).replace(
    /\{nombre\}/g,
    limpiarCabecera(nombre)
  );
  return `https://wa.me/${numeroWhatsapp(numero)}?text=${encodeURIComponent(texto)}`;
}

function datosConfiguracion(nombre) {
  const whatsappNumero = numeroWhatsapp(process.env.WHATSAPP_NUMBER);
  const whatsappUrl = crearEnlaceWhatsapp(
    whatsappNumero,
    process.env.WHATSAPP_MENSAJE,
    nombre
  );
  const sitio = urlSegura(process.env.SITE_URL);
  const instagram = urlSegura(process.env.INSTAGRAM_URL) || INSTAGRAM_POR_DEFECTO;
  const correo = limpiarCabecera(process.env.STUDIO_EMAIL) || CORREO_ESTUDIO_POR_DEFECTO;

  return { whatsappNumero, whatsappUrl, sitio, instagram, correo };
}

/**
 * Correo de bienvenida que recibe la persona justo después de enviar el
 * formulario. Mantiene el tono y la información del sitio.
 */
export function plantillaBienvenida({ nombre, servicio, mensaje } = {}) {
  const nombreSeguro = limpiarCabecera(nombre) || 'hola';
  const servicioInfo = SERVICIOS[servicio] || SERVICIOS.otro;
  const resumen = recortar(mensaje);
  const { whatsappNumero, whatsappUrl, sitio, instagram, correo } =
    datosConfiguracion(nombreSeguro);

  const asunto = limpiarCabecera(
    `${nombreSeguro}, tu historia empieza aquí — FibStudio`
  );

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(asunto)}</title>
</head>
<body style="margin:0;padding:0;background-color:#efe9dd;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    Gracias por escribir a FibStudio. Ya recibimos tu mensaje: aquí tienes lo que pasa ahora y un enlace directo a WhatsApp.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#efe9dd;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#fffdf8;border-radius:14px;overflow:hidden;border:1px solid #e3dacb;">

          <!-- Encabezado -->
          <tr>
            <td style="background-color:#15130f;padding:28px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="48" valign="middle">
                    <div style="width:44px;height:44px;border:1px solid #c9a24b;border-radius:50%;color:#c9a24b;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:44px;text-align:center;">&phi;</div>
                  </td>
                  <td valign="middle" style="padding-left:14px;">
                    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:0.5px;color:#f3ede2;">
                      fib<span style="color:#c9a24b;">studio</span>
                    </p>
                    <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#b7ac9a;">
                      fotografía que crea sentimientos
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Saludo -->
          <tr>
            <td style="padding:38px 36px 8px;">
              <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#a8863d;">
                mensaje recibido
              </p>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;font-weight:500;color:#15130f;">
                Hola, ${esc(nombreSeguro)}. Tu historia empieza aquí.
              </h1>
              <p style="margin:18px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;color:#4a4237;">
                Gracias por escribir a <strong style="color:#15130f;">FibStudio</strong>. Ya recibimos tu mensaje y lo estamos leyendo con calma: no lo responde un robot, lo lee una persona del estudio.
              </p>
              <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;color:#4a4237;">
                Te responderemos en <strong style="color:#15130f;">menos de 24 horas</strong> con disponibilidad y una propuesta a tu medida. Mientras tanto, aquí tienes lo que sigue.
              </p>
            </td>
          </tr>

          <!-- Resumen del mensaje -->
          <tr>
            <td style="padding:26px 36px 6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f2e8;border-left:3px solid #c9a24b;border-radius:6px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#a8863d;">
                      lo que nos contaste
                    </p>
                    <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#7a6f60;">Servicio de interés</p>
                    <p style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:19px;color:#15130f;">${esc(servicioInfo.etiqueta)}</p>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#4a4237;">
                      <em>&ldquo;${esc(resumen)}&rdquo;</em>
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#7a6f60;">
                ${esc(servicioInfo.descripcion)}
              </p>
            </td>
          </tr>

          <!-- Proceso -->
          <tr>
            <td style="padding:30px 36px 6px;">
              <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#a8863d;">
                cómo trabajamos
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="34" valign="top" style="padding:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#c9a24b;">01</td>
                  <td style="padding:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#4a4237;">
                    <strong style="color:#15130f;">Conversamos.</strong> Nos cuentas tu evento o idea de sesión, fechas y qué quieres sentir al ver las fotos.
                  </td>
                </tr>
                <tr>
                  <td width="34" valign="top" style="padding:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#c9a24b;">02</td>
                  <td style="padding:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#4a4237;">
                    <strong style="color:#15130f;">Planeamos.</strong> Definimos locación, tiempos y una pequeña guía visual para que nada se improvise.
                  </td>
                </tr>
                <tr>
                  <td width="34" valign="top" style="padding:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#c9a24b;">03</td>
                  <td style="padding:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#4a4237;">
                    <strong style="color:#15130f;">Disparamos y entregamos.</strong> Vivimos el momento con calma y luego editamos una galería lista para guardar y compartir.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA WhatsApp -->
          <tr>
            <td style="padding:18px 36px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#15130f;border-radius:10px;">
                <tr>
                  <td align="center" style="padding:28px 24px;">
                    <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:#f3ede2;">
                      ¿Quieres una asesoría personalizada?
                    </p>
                    <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#b7ac9a;">
                      Escríbenos por WhatsApp y conversamos tu idea sin compromiso.
                    </p>
                    <a href="${esc(whatsappUrl)}" style="display:inline-block;background-color:#c9a24b;color:#15130f;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;padding:14px 26px;border-radius:6px;">
                      Agendar mi asesoría por WhatsApp
                    </a>
                    <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8f8677;">
                      o guarda el número: <a href="https://wa.me/${esc(whatsappNumero)}" style="color:#c9a24b;text-decoration:none;">+${esc(whatsappNumero)}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Cierre -->
          <tr>
            <td style="padding:22px 36px 34px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#4a4237;">
                Y si prefieres el correo, responde directamente a este mensaje: te llega a la misma bandeja del estudio.
              </p>
              <p style="margin:18px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:17px;font-style:italic;color:#15130f;">
                No fotografiamos momentos. Fotografiamos lo que sentiste en ellos.
              </p>
              <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#a8863d;">
                FibStudio
              </p>
            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td style="background-color:#f7f2e8;border-top:1px solid #e3dacb;padding:22px 36px;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#7a6f60;">
                FibStudio · Fotografía de eventos y sesiones personalizadas
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#7a6f60;">
                <a href="mailto:${esc(correo)}" style="color:#7a6f60;text-decoration:underline;">${esc(correo)}</a>
                &nbsp;·&nbsp;
                <a href="${esc(instagram)}" style="color:#7a6f60;text-decoration:underline;">@fibstudio</a>
                ${sitio ? `&nbsp;·&nbsp;<a href="${esc(sitio)}" style="color:#7a6f60;text-decoration:underline;">Visitar el sitio</a>` : ''}
              </p>
              <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#9a9081;">
                Recibes este correo porque enviaste el formulario de contacto de FibStudio. Si no fuiste tú, puedes ignorarlo sin hacer nada.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const lineas = [
    `Hola, ${nombreSeguro}. Tu historia empieza aquí.`,
    '',
    'Gracias por escribir a FibStudio. Ya recibimos tu mensaje y lo estamos leyendo con calma.',
    'Te responderemos en menos de 24 horas con disponibilidad y una propuesta a tu medida.',
    '',
    'LO QUE NOS CONTASTE:',
    `Servicio de interés: ${servicioInfo.etiqueta}`,
    `"${resumen}"`,
    '',
    servicioInfo.descripcion,
    '',
    'CÓMO TRABAJAMOS',
    '01. Conversamos: nos cuentas tu evento o idea, fechas y qué quieres sentir al ver las fotos.',
    '02. Planeamos: definimos locación, tiempos y una guía visual.',
    '03. Disparamos y entregamos: vivimos el momento y editamos una galería lista para guardar.',
    '',
    '¿QUIERES UNA ASESORÍA PERSONALIZADA?',
    'Escríbenos por WhatsApp y conversamos tu idea sin compromiso:',
    whatsappUrl,
    '',
    'También puedes responder directamente a este correo.',
    '',
    'FibStudio · Fotografía de eventos y sesiones personalizadas',
    `Correo: ${correo}`,
    'Instagram: @fibstudio',
  ];

  if (sitio) lineas.push(`Sitio: ${sitio}`);

  lineas.push(
    '',
    'Recibes este correo porque enviaste el formulario de contacto de FibStudio.'
  );

  return { asunto, html, texto: lineas.join('\n') };
}
