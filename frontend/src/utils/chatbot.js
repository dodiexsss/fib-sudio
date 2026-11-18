import faq from '../data/faq.js'

const WHATSAPP_NUMERO = '593962377437'
const WHATSAPP_MENSAJE = 'Hola FibStudio, tengo una pregunta sobre sus servicios.'

export const CHIPS_INICIALES = ['precios', 'reservar', 'entrega', 'que-incluye', 'contacto']

export const SIN_RESPUESTA = {
  id: 'sin-respuesta',
  chip: 'Otra pregunta',
  pregunta: '',
  claves: [],
  respuesta:
    'No tengo una respuesta exacta para eso todavía. Puedo ayudarte con precios, reservas, entregas, sesiones, eventos y pagos.\n\nSi tu pregunta es más específica, escríbenos por WhatsApp y te responde una persona del estudio. También puedes usar el formulario de contacto.',
  enlaces: [
    { texto: 'Escribir por WhatsApp', whatsapp: 'Hola FibStudio, tengo una pregunta sobre sus servicios.' },
    { texto: 'Ir al formulario', url: '#contacto' },
  ],
  sugiere: CHIPS_INICIALES,
}

const PALABRAS_VACIAS = new Set([
  'de', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'que',
  'en', 'y', 'e', 'o', 'u', 'a', 'al', 'del', 'por', 'para', 'con',
  'sin', 'sobre', 'entre', 'hasta', 'desde', 'mi', 'mis', 'tu', 'tus',
  'su', 'sus', 'se', 'es', 'son', 'ser', 'soy', 'esta', 'este', 'esto',
  'estas', 'estos', 'lo', 'le', 'les', 'me', 'te', 'nos', 'os', 'ya',
  'mas', 'pero', 'si', 'no', 'muy', 'tambien', 'hay', 'tienen', 'tiene',
  'tengo', 'quiero', 'quisiera', 'necesito', 'puedo', 'podria', 'puede',
  'hacen', 'hacer', 'tal',
])

export function enlaceWhatsApp(mensaje) {
  return 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(mensaje || WHATSAPP_MENSAJE)
}

export function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const raiz = (palabra) => {
  if (palabra.length > 5 && palabra.endsWith('es')) return palabra.slice(0, -2)
  if (palabra.length > 4 && palabra.endsWith('s')) return palabra.slice(0, -1)
  return palabra
}

const palabrasDe = (texto) =>
  normalizar(texto)
    .split(' ')
    .filter((palabra) => palabra && !PALABRAS_VACIAS.has(palabra))
    .map(raiz)

function puntuar(entrada, textoNormalizado, palabras) {
  let puntaje = 0
  const vistas = new Set()

  for (const clave of entrada.claves) {
    const limpia = normalizar(clave)
    if (!limpia) continue

    if (limpia.includes(' ')) {
      const marca = 'frase:' + limpia
      if (vistas.has(marca)) continue
      vistas.add(marca)
      if (textoNormalizado.includes(limpia)) puntaje += 3
    } else {
      const marca = 'raiz:' + raiz(limpia)
      if (vistas.has(marca)) continue
      vistas.add(marca)
      if (palabras.has(raiz(limpia))) puntaje += 2
    }
  }

  let coincidencias = 0
  for (const palabra of new Set(palabrasDe(entrada.pregunta))) {
    if (palabras.has(palabra)) coincidencias += 1
  }

  return puntaje + Math.min(coincidencias, 3)
}

export function sugerenciasDe(entrada) {
  if (entrada === SIN_RESPUESTA) return CHIPS_INICIALES.slice()

  const ids = (entrada.sugiere || []).filter((id) => id !== entrada.id)
  for (const id of CHIPS_INICIALES) {
    if (ids.length >= 4) break
    if (id !== entrada.id && !ids.includes(id)) ids.push(id)
  }
  return ids.slice(0, 4)
}

export function buscar(texto) {
  const limpio = normalizar(texto)

  if (!limpio) {
    return { entrada: SIN_RESPUESTA, puntaje: 0, sugerencias: CHIPS_INICIALES }
  }

  const exacta = faq.find((entrada) => normalizar(entrada.pregunta) === limpio)
  if (exacta) {
    return { entrada: exacta, puntaje: 99, sugerencias: sugerenciasDe(exacta) }
  }

  const palabras = new Set(
    limpio.split(' ').filter((palabra) => palabra && !PALABRAS_VACIAS.has(palabra)).map(raiz)
  )

  let mejor = null
  let mejorPuntaje = 0
  let mejorTema = null
  let mejorTemaPuntaje = 0

  for (const entrada of faq) {
    const puntaje = puntuar(entrada, limpio, palabras)
    if (puntaje > mejorPuntaje) {
      mejor = entrada
      mejorPuntaje = puntaje
    }
    if (!entrada.cortesia && puntaje > mejorTemaPuntaje) {
      mejorTema = entrada
      mejorTemaPuntaje = puntaje
    }
  }

  if (mejor && mejor.cortesia && mejorTema && mejorTemaPuntaje >= 2) {
    mejor = mejorTema
    mejorPuntaje = mejorTemaPuntaje
  }

  if (!mejor || mejorPuntaje < 2) {
    return { entrada: SIN_RESPUESTA, puntaje: mejorPuntaje, sugerencias: CHIPS_INICIALES }
  }

  return { entrada: mejor, puntaje: mejorPuntaje, sugerencias: sugerenciasDe(mejor) }
}

export function entradaPorId(id) {
  return faq.find((entrada) => entrada.id === id)
}
