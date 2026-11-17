function ProyectoCard({ proyecto }) {
  return (
    <figure className={'gallery-item' + (proyecto.span2 ? ' span-2' : '')} role="listitem">
      <img src={proyecto.imagen} alt={proyecto.alt} loading="lazy" />
      <figcaption><span className="mono">{proyecto.categoria} /</span> {proyecto.titulo}</figcaption>
      <div className="gallery-overlay">
        <p className="gallery-overlay-eyebrow mono">la historia</p>
        <p className="gallery-overlay-text">{proyecto.historia}</p>
      </div>
    </figure>
  )
}

export default ProyectoCard
