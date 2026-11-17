function Header() {
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
          <button className="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navList">
            <span></span>
            <span></span>
            <span></span>
            <span className="sr-only">Abrir menú</span>
          </button>
          <ul id="navList" className="nav-list">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#estudio">Estudio</a></li>
            <li><a href="#portafolio">Portafolio</a></li>
            <li><a href="#servicios">Servicios</a></li>
            <li><a href="#proceso">Proceso</a></li>
            <li><a href="#contacto" className="nav-cta">Reservar</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
