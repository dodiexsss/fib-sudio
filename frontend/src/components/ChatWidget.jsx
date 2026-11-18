import { useEffect, useRef, useState } from 'react'
import ChatMensaje from './ChatMensaje.jsx'
import { buscar, entradaPorId, CHIPS_INICIALES } from '../utils/chatbot.js'
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

const SALUDO =
  '¡Hola! Soy el asistente de FibStudio. Te respondo al instante las dudas más comunes sobre sesiones, eventos, precios y entregas.\n\n¿Sobre qué te gustaría saber?'

function ChatWidget() {
  const [abierto, setAbierto] = useState(false)
  const [visto, setVisto] = useState(false)
  const [iniciado, setIniciado] = useState(false)
  const [mensajes, setMensajes] = useState([])
  const [sugerencias, setSugerencias] = useState([])
  const [texto, setTexto] = useState('')
  const [escribiendo, setEscribiendo] = useState(false)

  const contador = useRef(0)
  const temporizador = useRef(null)
  const logRef = useRef(null)
  const inputRef = useRef(null)
  const toggleRef = useRef(null)

  const siguienteId = () => {
    contador.current += 1
    return contador.current
  }

  function abrir() {
    setAbierto(true)
    setVisto(true)
    if (!iniciado) {
      setMensajes([{ id: siguienteId(), quien: 'bot', entrada: { respuesta: SALUDO } }])
      setSugerencias(CHIPS_INICIALES)
      setIniciado(true)
    }
  }

  function cerrar(devolverFoco = true) {
    setAbierto(false)
    if (devolverFoco) toggleRef.current?.focus({ preventScroll: true })
  }

  function preguntar(textoPregunta) {
    if (escribiendo) return

    const limpio = String(textoPregunta || '').trim()
    if (!limpio) return

    const resultado = buscar(limpio)
    setMensajes((anteriores) => [
      ...anteriores,
      { id: siguienteId(), quien: 'user', texto: limpio },
    ])
    setTexto('')
    setSugerencias([])
    setEscribiendo(true)

    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const retraso = reducido ? 80 : 380 + Math.random() * 320

    temporizador.current = window.setTimeout(() => {
      setMensajes((anteriores) => [
        ...anteriores,
        { id: siguienteId(), quien: 'bot', entrada: resultado.entrada },
      ])
      setSugerencias(resultado.sugerencias)
      setEscribiendo(false)
    }, retraso)
  }

  function elegirSugerencia(id) {
    const entrada = entradaPorId(id)
    if (entrada) preguntar(entrada.pregunta)
  }

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [mensajes, escribiendo, abierto])

  useEffect(() => {
    if (abierto && window.matchMedia('(min-width: 521px)').matches) {
      inputRef.current?.focus({ preventScroll: true })
    }
  }, [abierto])

  useEffect(() => {
    return () => window.clearTimeout(temporizador.current)
  }, [])

  return (
    <div
      id="fs-chat"
      className="fs-chat"
      data-open={abierto ? 'true' : 'false'}
      data-visto={visto ? 'true' : 'false'}
      onKeyDown={(evento) => {
        if (evento.key === 'Escape' && abierto) cerrar()
      }}
    >
      <section
        className="fs-chat__panel"
        id="fs-chat-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="fs-chat-titulo"
        hidden={!abierto}
      >
        <header className="fs-chat__header">
          <div className="fs-chat__identidad">
            <span className="fs-chat__avatar">{ICONO_ESPIRAL}</span>
            <div>
              <p className="fs-chat__titulo" id="fs-chat-titulo">Asistente FibStudio</p>
              <p className="fs-chat__estado"><span className="fs-chat__punto" aria-hidden="true"></span>Respuestas automáticas</p>
            </div>
          </div>
          <button type="button" className="fs-chat__cerrar" aria-label="Cerrar asistente" onClick={() => cerrar()}>
            {ICONO_CERRAR}
          </button>
        </header>

        <div className="fs-chat__log" role="log" aria-live="polite" aria-relevant="additions" ref={logRef}>
          {mensajes.map((mensaje) => (
            <ChatMensaje key={mensaje.id} mensaje={mensaje} onCerrar={cerrar} />
          ))}
          {escribiendo && (
            <div className="fs-chat__msg fs-chat__msg--bot fs-chat__msg--escribiendo" aria-hidden="true">
              <div className="fs-chat__bubble"><span></span><span></span><span></span></div>
            </div>
          )}
        </div>

        <div className="fs-chat__sugerencias" role="group" aria-label="Preguntas sugeridas" hidden={sugerencias.length === 0}>
          {sugerencias.map((id) => {
            const entrada = entradaPorId(id)
            if (!entrada) return null

            return (
              <button
                key={entrada.id}
                type="button"
                className="fs-chat__sugerencia"
                onClick={() => elegirSugerencia(entrada.id)}
              >
                {entrada.chip || entrada.pregunta}
              </button>
            )
          })}
        </div>

        <form
          className="fs-chat__form"
          autoComplete="off"
          onSubmit={(evento) => {
            evento.preventDefault()
            preguntar(texto)
          }}
        >
          <label className="fs-chat__sr" htmlFor="fs-chat-input">Escribe tu pregunta</label>
          <input
            className="fs-chat__input"
            id="fs-chat-input"
            type="text"
            placeholder="Escribe tu pregunta…"
            maxLength={220}
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            ref={inputRef}
          />
          <button type="submit" className="fs-chat__enviar" aria-label="Enviar pregunta" disabled={escribiendo}>
            {ICONO_ENVIAR}
          </button>
        </form>

        <p className="fs-chat__nota">
          Respuestas automáticas ·{' '}
          <a href="https://wa.me/593962377437?text=Hola%20FibStudio%2C%20tengo%20una%20pregunta%20sobre%20sus%20servicios." target="_blank" rel="noopener">
            Escríbenos por WhatsApp
          </a>
        </p>
      </section>

      <button
        type="button"
        className="fs-chat__toggle"
        aria-expanded={abierto}
        aria-controls="fs-chat-panel"
        aria-label={abierto ? 'Cerrar preguntas frecuentes' : 'Abrir preguntas frecuentes'}
        onClick={() => (abierto ? cerrar(false) : abrir())}
        ref={toggleRef}
      >
        <span className="fs-chat__toggle-icono">{ICONO_CHAT}{ICONO_CERRAR}</span>
        <span className="fs-chat__toggle-texto">{abierto ? 'Cerrar' : 'Preguntas frecuentes'}</span>
        <span className="fs-chat__badge" aria-hidden="true">1</span>
      </button>
    </div>
  )
}

export default ChatWidget
