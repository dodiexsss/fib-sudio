function ServiceCard({ servicio }) {
  return (
    <article className="service-card">
      <p className="service-index mono">{servicio.indice}</p>
      <h3>{servicio.titulo}</h3>
      <p>{servicio.descripcion}</p>
      <ul className="service-list">
        {servicio.incluye.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <a href="#contacto" className="btn btn-outline">{servicio.cta}</a>
    </article>
  )
}

export default ServiceCard
