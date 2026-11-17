import ProyectoCard from './ProyectoCard.jsx'
import proyectos from '../data/proyectos.js'

function Portfolio() {
  return (
    <section className="portfolio" id="portafolio" aria-labelledby="portfolio-title">
      <div className="wrap">
        <p className="section-eyebrow mono">02 — portafolio</p>
        <h2 id="portfolio-title">Historias que ya contamos</h2>
        <p className="section-lead">
          Una muestra de eventos y sesiones. Reemplaza estas imágenes por tu propio trabajo
          (ver <code>README.md</code>).
        </p>

        <div className="gallery" role="list">
          {/* .map() recorre cada proyecto y crea una tarjeta; key debe ser única. */}
          {proyectos.map((proyecto) => (
            <ProyectoCard key={proyecto.id} proyecto={proyecto} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Portfolio
