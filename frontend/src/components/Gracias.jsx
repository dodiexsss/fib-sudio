const estilos = {
  main: {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: '80px',
    paddingBottom: '80px',
  },
  eyebrow: { justifyContent: 'center', display: 'flex' },
  titulo: { fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '20px' },
  texto: { maxWidth: '50ch', margin: '0 auto 32px' },
  boton: { margin: '0 auto' },
}

function Gracias() {
  return (
    <main className="wrap" style={estilos.main}>
      <p className="section-eyebrow mono" style={estilos.eyebrow}>mensaje recibido</p>
      <h1 style={estilos.titulo}>¡Gracias por escribirnos!</h1>
      <p style={estilos.texto}>
        Tu mensaje llegó correctamente. Te responderemos en menos de 24 horas con disponibilidad
        y una propuesta a tu medida.
      </p>
      <a href="/" className="btn btn-primary" style={estilos.boton}>Volver al inicio</a>
    </main>
  )
}

export default Gracias
