// Las rutas guardadas en MongoDB apuntan a css/images; ahora las fotos viven en /img.
function rutaImagen(imagen) {
  if (!imagen) return ''
  if (/^https?:\/\//i.test(imagen) || imagen.startsWith('/img/')) return imagen
  if (imagen.includes('css/images/')) return '/img/' + imagen.split('css/images/').pop()
  return imagen.startsWith('/') ? imagen : '/' + imagen
}

function ProyectoCard({ proyecto }) {
  return (
    <figure className={'gallery-item' + (proyecto.span2 ? ' span-2' : '')} role="listitem">
      <img src={rutaImagen(proyecto.imagen)} alt={proyecto.alt} loading="lazy" />
      <figcaption><span className="mono">{proyecto.categoria} /</span> {proyecto.titulo}</figcaption>
      <div className="gallery-overlay">
        <p className="gallery-overlay-eyebrow mono">la historia</p>
        <p className="gallery-overlay-text">{proyecto.historia}</p>
      </div>
    </figure>
  )
}

export default ProyectoCard
