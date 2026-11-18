import { enlaceWhatsApp } from '../utils/chatbot.js'

function TextoConNegritas({ texto }) {
  const partes = String(texto).split(/(\*\*[^*]+\*\*)/g)

  return partes.map((parte, indice) => {
    if (parte.startsWith('**') && parte.endsWith('**')) {
      return <strong key={indice}>{parte.slice(2, -2)}</strong>
    }
    return <span key={indice}>{parte}</span>
  })
}

function Respuesta({ texto }) {
  const bloques = String(texto).split(/\n{2,}/)

  return bloques.map((bloque, indice) => {
    const lineas = bloque.split('\n').map((linea) => linea.trim()).filter(Boolean)
    if (!lineas.length) return null

    const esLista = lineas.every((linea) => /^-\s+/.test(linea))
    const esNumerada = lineas.every((linea) => /^\d+[.)]\s+/.test(linea))

    if (esLista || esNumerada) {
      const Etiqueta = esNumerada ? 'ol' : 'ul'
      return (
        <Etiqueta key={indice}>
          {lineas.map((linea, posicion) => (
            <li key={posicion}>
              <TextoConNegritas texto={linea.replace(/^-\s+/, '').replace(/^\d+[.)]\s+/, '')} />
            </li>
          ))}
        </Etiqueta>
      )
    }

    return (
      <p key={indice}>
        <TextoConNegritas texto={lineas.join(' ')} />
      </p>
    )
  })
}

// Cada burbuja recibe el mensaje por props y avisa al padre si hay que cerrar el panel.
function ChatMensaje({ mensaje, onCerrar }) {
  const esBot = mensaje.quien === 'bot'

  return (
    <div className={'fs-chat__msg fs-chat__msg--' + (esBot ? 'bot' : 'user')}>
      <div className="fs-chat__bubble">
        {esBot ? (
          <>
            <Respuesta texto={mensaje.entrada.respuesta} />
            {Array.isArray(mensaje.entrada.enlaces) && mensaje.entrada.enlaces.length > 0 && (
              <div className="fs-chat__enlaces">
                {mensaje.entrada.enlaces.map((enlace) => {
                  const externo = Boolean(enlace.whatsapp) || /^https?:/i.test(enlace.url || '')
                  const href = enlace.whatsapp ? enlaceWhatsApp(enlace.whatsapp) : enlace.url

                  return (
                    <a
                      key={enlace.texto}
                      className="fs-chat__enlace"
                      href={href}
                      target={externo ? '_blank' : undefined}
                      rel={externo ? 'noopener' : undefined}
                      onClick={() => {
                        if ((enlace.url || '').startsWith('#')) onCerrar(false)
                      }}
                    >
                      {enlace.texto}
                    </a>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          mensaje.texto
        )}
      </div>
    </div>
  )
}

export default ChatMensaje
