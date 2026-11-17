import { useState } from 'react'

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

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setDatos((anteriores) => ({ ...anteriores, [name]: value }))
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
      onSubmit={(evento) => evento.preventDefault()}
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

      <button type="submit" className="btn btn-primary btn-block" id="submitBtn">Enviar mensaje</button>

      <p className="form-status" id="formStatus" role="status" aria-live="polite"></p>

      <div className="form-success" id="formSuccess" hidden>
        <p id="formSuccessText"></p>
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
