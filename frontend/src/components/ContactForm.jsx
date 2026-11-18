import { useState } from 'react'
import { crearMensaje, enviarANetlify } from '../api.js'

const DATOS_INICIALES = {
  nombre: '',
  email: '',
  servicio: '',
  mensaje: '',
  empresa: '',
}

function ContactForm() {
  // Inputs controlados: React guarda cada valor en el estado del formulario.
  const [datos, setDatos] = useState(DATOS_INICIALES)
  const [enviando, setEnviando] = useState(false)
  const [estado, setEstado] = useState({ texto: '', tipo: '' })
  const [textoExito, setTextoExito] = useState('')

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setDatos((anteriores) => ({ ...anteriores, [name]: value }))
  }

  // Guarda en MongoDB. Si la API no existe (sitio solo estático), usa Netlify Forms.
  async function guardarMensaje() {
    try {
      const data = await crearMensaje(datos)
      return { correoEnviado: data.correo === 'enviado' }
    } catch (error) {
      const apiNoDisponible =
        !error.status || [404, 405].includes(error.status) || error.status >= 502

      if (!apiNoDisponible) throw error

      await enviarANetlify(datos)
      return { correoEnviado: false }
    }
  }

  async function enviar(evento) {
    evento.preventDefault()

    // Si el honeypot fue rellenado, es un bot: no enviamos nada.
    if (datos.empresa.trim()) return

    setEnviando(true)
    setEstado({ texto: '', tipo: '' })
    setTextoExito('')

    try {
      const { correoEnviado } = await guardarMensaje()

      const primerNombre = (datos.nombre || '').trim().split(/\s+/)[0]
      const saludo = primerNombre ? '¡Gracias, ' + primerNombre + '!' : '¡Gracias!'

      setEstado({
        texto: correoEnviado
          ? saludo + ' Guardamos tu mensaje y te enviamos un correo con toda la información. Revisa también la carpeta de spam.'
          : saludo + ' Tu mensaje fue enviado. Te responderemos en menos de 24 horas.',
        tipo: 'success',
      })

      setTextoExito(
        correoEnviado
          ? 'Mientras revisamos tu mensaje, puedes adelantar tu asesoría personalizada por WhatsApp.'
          : '¿Quieres adelantar tu asesoría personalizada? Escríbenos por WhatsApp.'
      )

      setDatos(DATOS_INICIALES)
    } catch (error) {
      const esDefinitivo = Boolean(error.status)
      setEstado({
        texto: esDefinitivo
          ? error.message
          : 'Hubo un problema al enviar tu mensaje. Intenta de nuevo o escríbenos directo por correo.',
        tipo: 'error',
      })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form
      className="contact-form"
      id="contactForm"
      name="contacto"
      method="post"
      data-netlify="true"
      netlify-honeypot="empresa"
      action="gracias.html"
      onSubmit={enviar}
    >
      {/* Campo oculto obligatorio para que Netlify identifique el formulario */}
      <input type="hidden" name="form-name" value="contacto" />

      {/* Honeypot anti-spam: invisible para personas, los bots sí lo rellenan */}
      <p className="hp-field" aria-hidden="true">
        <label>
          No llenes este campo si eres humano:{' '}
          <input
            name="empresa"
            tabIndex={-1}
            autoComplete="off"
            value={datos.empresa}
            onChange={manejarCambio}
          />
        </label>
      </p>

      <div className="field">
        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          autoComplete="name"
          required
          value={datos.nombre}
          onChange={manejarCambio}
        />
      </div>
      <div className="field">
        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          required
          value={datos.email}
          onChange={manejarCambio}
        />
      </div>
      <div className="field">
        <label htmlFor="servicio">Tipo de servicio</label>
        <select
          id="servicio"
          name="servicio"
          required
          value={datos.servicio}
          onChange={manejarCambio}
        >
          <option value="" disabled>Selecciona una opción</option>
          <option value="evento">Cobertura de evento</option>
          <option value="sesion">Sesión personalizada</option>
          <option value="otro">Otro / no estoy seguro</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="mensaje">Cuéntanos tu idea</label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows="4"
          required
          value={datos.mensaje}
          onChange={manejarCambio}
        ></textarea>
      </div>

      <button type="submit" className="btn btn-primary btn-block" id="submitBtn" disabled={enviando}>
        {enviando ? 'Enviando…' : 'Enviar mensaje'}
      </button>

      <p className={'form-status' + (estado.tipo ? ' is-' + estado.tipo : '')} id="formStatus" role="status" aria-live="polite">
        {estado.texto}
      </p>

      <div className="form-success" id="formSuccess" hidden={!textoExito}>
        <p id="formSuccessText">{textoExito}</p>
        <a
          className="btn btn-outline btn-block"
          href="https://wa.me/593962377437?text=Hola%20FibStudio%2C%20acabo%20de%20enviar%20el%20formulario%20y%20quiero%20agendar%20mi%20asesor%C3%ADa%20personalizada."
          data-whatsapp
          target="_blank"
          rel="noopener"
        >
          Agendar mi asesoría por WhatsApp
        </a>
      </div>

      <p className="form-note">Tus datos se guardan en nuestra base de datos y llegan directo al estudio. No los compartimos con terceros.</p>
    </form>
  )
}

export default ContactForm
