import LoginForm from './LoginForm.jsx'

function DashboardPage() {
  return (
    <>
      <header>
        <div className="wrap header-inner">
          <p className="logo">fib<span>studio</span> <span className="mono">/ panel</span></p>
          <div className="header-right">
            <span id="connState" className="mono">sin sesión</span>
            <button type="button" className="btn-ghost" id="logoutBtn" hidden>Cerrar sesión</button>
          </div>
        </div>
      </header>

      <main className="wrap">
        <section className="login-card" id="loginView">
          <p className="mono">acceso privado</p>
          <h1>Panel de mensajes</h1>
          <p>Introduce el <code>ADMIN_TOKEN</code> que configuraste en el archivo <code>.env</code> del servidor.</p>
          <LoginForm />
        </section>

        <section id="panelView" hidden>
          <div className="toolbar">
            <div>
              <p className="mono">bandeja de entrada</p>
              <h1>Mensajes recibidos</h1>
            </div>
            <div className="toolbar-actions">
              <button type="button" className="btn-ghost" id="refreshBtn">Actualizar</button>
            </div>
          </div>

          <div className="stats" id="stats"></div>

          <div className="filters" role="group" aria-label="Filtrar por estado">
            <button type="button" className="filter is-active" data-estado="">Todos</button>
            <button type="button" className="filter" data-estado="nuevo">Nuevos</button>
            <button type="button" className="filter" data-estado="leido">Leídos</button>
            <button type="button" className="filter" data-estado="respondido">Respondidos</button>
          </div>

          <div id="messages"></div>
        </section>
      </main>

      <div className="toast" id="toast" role="status" aria-live="polite" hidden></div>
    </>
  )
}

export default DashboardPage
