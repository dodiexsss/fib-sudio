function Hero() {
  return (
    <section className="hero" id="inicio" aria-label="Presentación">
      <svg className="hero-spiral" viewBox="0 0 500 500" aria-hidden="true" focusable="false">
        <path
          id="spiralPath"
          d="M250,250
             C250,220 270,200 300,200
             C340,200 370,230 370,270
             C370,320 330,350 280,350
             C220,350 180,300 180,240
             C180,170 240,120 320,120
             C410,120 470,190 470,270
             C470,370 380,440 280,440"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>

      <div className="wrap hero-inner">
        <p className="eyebrow mono">f/1.4 &nbsp;·&nbsp; 1/125 &nbsp;·&nbsp; ISO 200 &nbsp;·&nbsp; la proporción que ordena
          la emoción</p>
        <h1 className="hero-title">
          No fotografiamos momentos.<br />
          Fotografiamos <em>lo que sentiste</em> en ellos.
        </h1>
        <p className="hero-sub">
          FibStudio nace de una idea simple: toda buena fotografía sigue una proporción invisible,
          igual que toda buena historia sigue una emoción. Cubrimos tus eventos y creamos tus sesiones
          con esa misma precisión sensible.
        </p>
        <div className="hero-actions">
          <a href="#contacto" className="btn btn-primary">Reservar una sesión</a>
          <a href="#portafolio" className="btn btn-ghost">Ver portafolio</a>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span></span>
        <p className="mono">desplázate</p>
      </div>
    </section>
  )
}

export default Hero
