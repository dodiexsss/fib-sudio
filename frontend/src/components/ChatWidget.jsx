import '../chatbot.css'

const ICONO_CHAT = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H8l-4 3v-4.4A8.5 8.5 0 1 1 21 11.5Z" />
  </svg>
)

const ICONO_CERRAR = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

const ICONO_ENVIAR = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m4 12 16-7-7 16-2.2-6.8L4 12Z" />
  </svg>
)

const ICONO_ESPIRAL = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M12 12c0-2 1.5-3.5 3.5-3.5S19 10.5 19 13c0 3.5-3 6-6.5 6C8 19 5 15.5 5 11.5 5 6.5 9 3 14 3" />
  </svg>
)

function ChatWidget() {
  return (
    <div id="fs-chat" className="fs-chat" data-open="false" data-visto="false">
      <section className="fs-chat__panel" id="fs-chat-panel" role="dialog" aria-modal="false" aria-labelledby="fs-chat-titulo" hidden>
        <header className="fs-chat__header">
          <div className="fs-chat__identidad">
            <span className="fs-chat__avatar">{ICONO_ESPIRAL}</span>
            <div>
              <p className="fs-chat__titulo" id="fs-chat-titulo">Asistente FibStudio</p>
              <p className="fs-chat__estado"><span className="fs-chat__punto" aria-hidden="true"></span>Respuestas automáticas</p>
            </div>
          </div>
          <button type="button" className="fs-chat__cerrar" aria-label="Cerrar asistente">{ICONO_CERRAR}</button>
        </header>

        <div className="fs-chat__log" role="log" aria-live="polite" aria-relevant="additions"></div>

        <div className="fs-chat__sugerencias" role="group" aria-label="Preguntas sugeridas"></div>

        <form className="fs-chat__form" autoComplete="off">
          <label className="fs-chat__sr" htmlFor="fs-chat-input">Escribe tu pregunta</label>
          <input className="fs-chat__input" id="fs-chat-input" type="text" placeholder="Escribe tu pregunta…" maxLength={220} />
          <button type="submit" className="fs-chat__enviar" aria-label="Enviar pregunta">{ICONO_ENVIAR}</button>
        </form>

        <p className="fs-chat__nota">
          Respuestas automáticas ·{' '}
          <a href="https://wa.me/593962377437?text=Hola%20FibStudio%2C%20tengo%20una%20pregunta%20sobre%20sus%20servicios." target="_blank" rel="noopener">
            Escríbenos por WhatsApp
          </a>
        </p>
      </section>

      <button type="button" className="fs-chat__toggle" aria-expanded="false" aria-controls="fs-chat-panel" aria-label="Abrir preguntas frecuentes">
        <span className="fs-chat__toggle-icono">{ICONO_CHAT}{ICONO_CERRAR}</span>
        <span className="fs-chat__toggle-texto">Preguntas frecuentes</span>
        <span className="fs-chat__badge" aria-hidden="true">1</span>
      </button>
    </div>
  )
}

export default ChatWidget
