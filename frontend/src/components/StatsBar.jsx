function StatsBar({ stats }) {
  const datos = [
    { etiqueta: 'Total', valor: stats.total },
    { etiqueta: 'Nuevos', valor: stats.nuevo },
    { etiqueta: 'Leídos', valor: stats.leido },
    { etiqueta: 'Respondidos', valor: stats.respondido },
  ]

  return (
    <div className="stats" id="stats">
      {datos.map((dato) => (
        <div className="stat" key={dato.etiqueta}>
          <strong>{dato.valor}</strong>
          <span>{dato.etiqueta}</span>
        </div>
      ))}
    </div>
  )
}

export default StatsBar
