import { useEffect, useState } from 'react'
import ProyectoCard from './ProyectoCard.jsx'
import { obtenerProyectos } from '../api.js'

function Portfolio() {
  const [proyectos, setProyectos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // useEffect con [] carga los proyectos una sola vez al abrir la página.
  useEffect(() => {
    let activo = true

    obtenerProyectos()
      .then((datos) => {
        if (!activo) return
        setProyectos(Array.isArray(datos) ? datos : [])
      })
      .catch((fallo) => {
        if (activo) setError(fallo.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [])

  return (
    <section className="portfolio" id="portafolio" aria-labelledby="portfolio-title">
      <div className="wrap">
        <p className="section-eyebrow mono">02 — portafolio</p>
        <h2 id="portfolio-title">Historias que ya contamos</h2>
        <p className="section-lead">
          Una muestra de eventos y sesiones. Reemplaza estas imágenes por tu propio trabajo
          (ver <code>README.md</code>).
        </p>

        {cargando && <p className="section-lead" role="status">Cargando portafolio…</p>}

        {!cargando && error && (
          <p className="section-lead" role="alert">No se pudo cargar el portafolio: {error}</p>
        )}

        {!cargando && !error && proyectos.length === 0 && (
          <p className="section-lead">Todavía no hay proyectos publicados.</p>
        )}

        {proyectos.length > 0 && (
          <div className="gallery" role="list">
            {/* .map() recorre cada proyecto y crea una tarjeta; key debe ser única. */}
            {proyectos.map((proyecto) => (
              <ProyectoCard key={proyecto._id} proyecto={proyecto} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Portfolio
