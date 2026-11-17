const formatearFecha = (iso) =>
  new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

function MessageCard({ mensaje, onCambiarEstado, onEliminar }) {
  return (
    <article className={'message is-' + mensaje.estado}>
      <div className="message-head">
        <span className="message-name">{mensaje.nombre}</span>
        <div className="message-meta">
          <span className="chip">{mensaje.servicio}</span>
          <span>{formatearFecha(mensaje.createdAt)}</span>
        </div>
      </div>

      <p className="message-body">{mensaje.mensaje}</p>

      <div className="message-actions">
        <a
          href={
            'mailto:' + encodeURIComponent(mensaje.email) +
            '?subject=' + encodeURIComponent('Re: tu mensaje a FibStudio')
          }
        >
          {mensaje.email}
        </a>

        <select
          aria-label={'Estado del mensaje de ' + mensaje.nombre}
          value={mensaje.estado}
          onChange={(evento) => onCambiarEstado(mensaje, evento.target.value)}
        >
          <option value="nuevo">Nuevo</option>
          <option value="leido">Leído</option>
          <option value="respondido">Respondido</option>
        </select>

        <button type="button" className="message-delete" onClick={() => onEliminar(mensaje)}>
          Eliminar
        </button>
      </div>
    </article>
  )
}

export default MessageCard
