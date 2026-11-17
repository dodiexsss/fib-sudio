const anioActual = new Date().getFullYear()

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <p className="logo footer-logo">
          fib<span className="logo-accent">studio</span>
        </p>
        <p className="mono footer-note">Fotografía de eventos y sesiones · hecha con la misma proporción de siempre.</p>
        <p className="footer-copy">&copy; {anioActual} FibStudio. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
