/**
 * Escapa texto que se interpola dentro de HTML (correos, por ejemplo).
 * Evita que el contenido enviado por una persona inyecte etiquetas.
 */
export function escaparHtml(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
