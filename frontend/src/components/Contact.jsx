import ContactForm from './ContactForm.jsx'

function Contact() {
  return (
    <section className="contact" id="contacto" aria-labelledby="contact-title">
      <div className="wrap contact-inner">
        <div className="contact-info">
          <p className="section-eyebrow mono">05 — contacto</p>
          <h2 id="contact-title">Hablemos de tu historia</h2>
          <p>
            Cuéntanos qué quieres celebrar o recordar. Respondemos en menos de 24 horas con
            disponibilidad y una propuesta a tu medida.
          </p>
          <ul className="contact-list">
            <li>
              <span className="mono">correo</span>
              <a href="mailto:fibstudio.of@gmail.com">fibstudio.of@gmail.com</a>
            </li>
            <li>
              <span className="mono">whatsapp</span>
              <a
                href="https://wa.me/593962377437?text=Hola%20FibStudio%2C%20quiero%20agendar%20una%20asesor%C3%ADa%20personalizada."
                data-whatsapp
                target="_blank"
                rel="noopener"
              >
                +593 96 237 7437
              </a>
            </li>
            <li>
              <span className="mono">instagram</span>
              <a href="https://www.instagram.com/fib.studio.oc?dlrf=MWpnN3F5bDBncnQ5MQ==" target="_blank" rel="noopener">@fibstudio</a>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </section>
  )
}

export default Contact
