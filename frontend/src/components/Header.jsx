import { useState } from 'react'

function Header() {
  // useState guarda si el menú móvil está abierto.
  const [menuAbierto, setMenuAbierto] = useState(false)

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a href="#inicio" className="logo">
          <span className="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" width="28" height="28">
              <path
                d="M20,20 C20,15 23,12 28,12 C34,12 38,17 38,23 C38,31 31,37 22,37 C11,37 3,29 3,17"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </span>
          fib<span className="logo-accent">studio</span>
        </a>

        <nav className="main-nav" aria-label="Navegación principal">
          <button
            className="nav-toggle"
            id="navToggle"
            aria-expanded={menuAbierto}
            aria-controls="navList"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            <span></span>
            <span></span>
            <span></span>
            <span className="sr-only">Abrir menú</span>
          </button>
          <ul id="navList" className={'nav-list' + (menuAbierto ? ' is-open' : '')}>
            <li><a href="#inicio" onClick={cerrarMenu}>Inicio</a></li>
            <li><a href="#estudio" onClick={cerrarMenu}>Estudio</a></li>
            <li><a href="#portafolio" onClick={cerrarMenu}>Portafolio</a></li>
            <li><a href="#servicios" onClick={cerrarMenu}>Servicios</a></li>
            <li><a href="#proceso" onClick={cerrarMenu}>Proceso</a></li>
            <li><a href="#contacto" className="nav-cta" onClick={cerrarMenu}>Reservar</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
