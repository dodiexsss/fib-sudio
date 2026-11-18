import { useEffect, useRef, useState } from 'react'
import * as api from '../api.js'
import LoginForm from './LoginForm.jsx'
import StatsBar from './StatsBar.jsx'
import FilterBar from './FilterBar.jsx'
import MessageCard from './MessageCard.jsx'
import Toast from './Toast.jsx'

const TOKEN_KEY = 'fibstudio_admin_token'
const STATS_VACIAS = { total: 0, nuevo: 0, leido: 0, respondido: 0 }

function DashboardPage() {
  const [token, setToken] = useState('')
  const [logueado, setLogueado] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [mensajes, setMensajes] = useState([])
  const [stats, setStats] = useState(STATS_VACIAS)
  const [errorLogin, setErrorLogin] = useState('')
  const [toast, setToast] = useState('')
  const [recarga, setRecarga] = useState(0)
  const toastTimer = useRef(null)

  function avisar(texto) {
    setToast(texto)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2600)
  }

  function salir(mensaje = '') {
    setToken('')
    sessionStorage.removeItem(TOKEN_KEY)
    setLogueado(false)
    setErrorLogin(mensaje)
    setMensajes([])
    setStats(STATS_VACIAS)
    setFiltroEstado('')
  }

  function recargar() {
    setRecarga((valor) => valor + 1)
  }

  // Al abrir la página, comprueba si ya había un token guardado en la pestaña.
  useEffect(() => {
    const guardado = sessionStorage.getItem(TOKEN_KEY)
    if (!guardado) return

    let activo = true
    api
      .obtenerStats(guardado)
      .then(() => {
        if (!activo) return
        setToken(guardado)
        setLogueado(true)
      })
      .catch((error) => {
        if (!activo) return
        setToken('')
        setLogueado(false)
        sessionStorage.removeItem(TOKEN_KEY)
        setErrorLogin(
          error.status === 401
            ? 'Tu sesión expiró o el token no es válido.'
            : 'No se pudo conectar con la API. Revisa que el servidor esté corriendo.'
        )
      })

    return () => {
      activo = false
    }
  }, [])

  // Carga estadísticas y mensajes cada vez que cambia el filtro o se pide recargar.
  useEffect(() => {
    if (!logueado) return

    let activo = true

    async function cargarTodo() {
      try {
        const [nuevasStats, nuevosMensajes] = await Promise.all([
          api.obtenerStats(token),
          api.obtenerMensajes(token, filtroEstado),
        ])

        if (!activo) return
        setStats(nuevasStats)
        setMensajes(nuevosMensajes)
      } catch (error) {
        if (!activo) return

        if (error.status === 401) {
          salir('Tu sesión expiró o el token no es válido.')
        } else {
          avisar(error.message)
        }
      }
    }

    cargarTodo()

    return () => {
      activo = false
    }
  }, [logueado, filtroEstado, token, recarga])

  useEffect(() => {
    return () => window.clearTimeout(toastTimer.current)
  }, [])

  async function entrar(evento) {
    evento.preventDefault()
    setErrorLogin('')

    const limpio = token.trim()
    if (!limpio) {
      setErrorLogin('Escribe el token.')
      return
    }

    try {
      await api.obtenerStats(limpio)
      sessionStorage.setItem(TOKEN_KEY, limpio)
      setToken(limpio)
      setLogueado(true)
    } catch (error) {
      if (error.status === 401) {
        salir('Tu sesión expiró o el token no es válido.')
      } else {
        setErrorLogin('No se pudo conectar con la API. ¿Está corriendo el servidor?')
      }
    }
  }

  async function cambiarEstado(mensaje, estado) {
    try {
      await api.actualizarEstadoMensaje(mensaje._id, estado, token)
      avisar('Estado actualizado.')
      recargar()
    } catch (error) {
      avisar(error.message)
      if (error.status === 401) salir('Tu sesión expiró o el token no es válido.')
    }
  }

  async function eliminar(mensaje) {
    if (!window.confirm('¿Eliminar el mensaje de ' + mensaje.nombre + '? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await api.eliminarMensaje(mensaje._id, token)
      avisar('Mensaje eliminado.')
      recargar()
    } catch (error) {
      avisar(error.message)
      if (error.status === 401) salir('Tu sesión expiró o el token no es válido.')
    }
  }

  return (
    <>
      <header>
        <div className="wrap header-inner">
          <p className="logo">fib<span>studio</span> <span className="mono">/ panel</span></p>
          <div className="header-right">
            <span id="connState" className={'mono' + (logueado ? ' ok' : '')}>
              {logueado ? 'sesión activa' : 'sin sesión'}
            </span>
            <button type="button" className="btn-ghost" id="logoutBtn" hidden={!logueado} onClick={() => salir()}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="wrap">
        {!logueado ? (
          <section className="login-card" id="loginView">
            <p className="mono">acceso privado</p>
            <h1>Panel de mensajes</h1>
            <p>Introduce el <code>ADMIN_TOKEN</code> que configuraste en el archivo <code>.env</code> del servidor.</p>
            <LoginForm
              token={token}
              onTokenChange={setToken}
              onSubmit={entrar}
              error={errorLogin}
            />
          </section>
        ) : (
          <section id="panelView">
            <div className="toolbar">
              <div>
                <p className="mono">bandeja de entrada</p>
                <h1>Mensajes recibidos</h1>
              </div>
              <div className="toolbar-actions">
                <button type="button" className="btn-ghost" id="refreshBtn" onClick={recargar}>
                  Actualizar
                </button>
              </div>
            </div>

            <StatsBar stats={stats} />

            <FilterBar filtroEstado={filtroEstado} onFiltrar={setFiltroEstado} />

            <div id="messages">
              {mensajes.length === 0 ? (
                <p className="empty">No hay mensajes en esta vista.</p>
              ) : (
                mensajes.map((mensaje) => (
                  <MessageCard
                    key={mensaje._id}
                    mensaje={mensaje}
                    onCambiarEstado={cambiarEstado}
                    onEliminar={eliminar}
                  />
                ))
              )}
            </div>
          </section>
        )}
      </main>

      {toast && <Toast texto={toast} />}
    </>
  )
}

export default DashboardPage
