import ServiceCard from './ServiceCard.jsx'

const servicios = [
  {
    id: 'evento',
    indice: 'Eventos',
    titulo: 'Cobertura de eventos',
    descripcion:
      'Bodas, cumpleaños, lanzamientos, celebraciones familiares. Nos movemos sin interrumpir, atentos a los gestos que nadie más ve, para entregarte el evento completo tal como se sintió.',
    incluye: [
      'Cobertura desde 4 hasta jornada completa',
      'Segundo fotógrafo disponible para eventos grandes',
      'Galería digital editada y organizada por momentos',
      'Entrega de adelanto en las primeras 48 horas',
    ],
    cta: 'Cotizar mi evento',
  },
  {
    id: 'sesion',
    indice: 'Sesiones',
    titulo: 'Sesiones personalizadas',
    descripcion:
      'Retratos, parejas, familias, marca personal. Diseñamos la sesión alrededor de una idea o un sentimiento concreto, no de una pose genérica. Tú llegas, nosotros guiamos el resto.',
    incluye: [
      'Locación a tu elección o propuesta de estudio',
      'Guía de vestuario y moodboard previo',
      'Selección curada de imágenes en alta resolución',
      'Opción de video corto detrás de cámaras',
    ],
    cta: 'Agendar mi sesión',
  },
]

function Services() {
  return (
    <section className="services" id="servicios" aria-labelledby="services-title">
      <div className="wrap">
        <p className="section-eyebrow mono">03 — servicios</p>
        <h2 id="services-title">Dos formas de trabajar juntos</h2>

        <div className="services-grid">
          {servicios.map((servicio) => (
            <ServiceCard key={servicio.id} servicio={servicio} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
