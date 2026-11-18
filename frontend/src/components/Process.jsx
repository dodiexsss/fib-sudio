const pasos = [
  {
    numero: '01',
    titulo: 'Conversamos',
    texto: 'Nos cuentas tu evento o idea de sesión, fechas y qué quieres sentir al ver las fotos.',
  },
  {
    numero: '02',
    titulo: 'Planeamos',
    texto: 'Definimos locación, tiempos y una pequeña guía visual para que nada se improvise.',
  },
  {
    numero: '03',
    titulo: 'Disparamos',
    texto: 'El día de la sesión o evento, con calma, presencia y atención a lo que de verdad importa.',
  },
  {
    numero: '04',
    titulo: 'Entregamos',
    texto: 'Editamos con cuidado y te entregamos una galería lista para guardar y compartir.',
  },
]

function Process() {
  return (
    <section className="process" id="proceso" aria-labelledby="process-title">
      <div className="wrap">
        <p className="section-eyebrow mono">04 — proceso</p>
        <h2 id="process-title">Cómo trabajamos, paso a paso</h2>

        <ol className="process-list">
          {pasos.map((paso) => (
            <li key={paso.numero}>
              <span className="process-num mono">{paso.numero}</span>
              <h3>{paso.titulo}</h3>
              <p>{paso.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Process
