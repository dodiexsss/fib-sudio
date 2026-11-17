const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

async function pedir(ruta, opciones = {}) {
  const respuesta = await fetch(API_URL + ruta, opciones)
  const datos = await respuesta.json().catch(() => ({}))

  if (!respuesta.ok) {
    const detalle = datos.detalles ? Object.values(datos.detalles)[0] : datos.error
    const error = new Error(detalle || 'No se pudo conectar con la API.')
    error.status = respuesta.status
    throw error
  }

  return datos
}

function opcionesJson(metodo, cuerpo, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['x-admin-token'] = token

  return {
    method: metodo,
    headers,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  }
}

export function obtenerProyectos() {
  return pedir('/api/portafolio')
}

export function crearMensaje(datos) {
  return pedir('/api/contacto', opcionesJson('POST', datos))
}

export function obtenerStats(token) {
  return pedir('/api/mensajes/stats', { headers: { 'x-admin-token': token } })
}

export function obtenerMensajes(token, estado = '') {
  const ruta = '/api/mensajes' + (estado ? '?estado=' + estado : '')
  return pedir(ruta, { headers: { 'x-admin-token': token } })
}

export function actualizarEstadoMensaje(id, estado, token) {
  return pedir('/api/mensajes/' + id, opcionesJson('PATCH', { estado }, token))
}

export function eliminarMensaje(id, token) {
  return pedir('/api/mensajes/' + id, {
    method: 'DELETE',
    headers: { 'x-admin-token': token },
  })
}
