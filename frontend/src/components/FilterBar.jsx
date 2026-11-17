const FILTROS = [
  { estado: '', etiqueta: 'Todos' },
  { estado: 'nuevo', etiqueta: 'Nuevos' },
  { estado: 'leido', etiqueta: 'Leídos' },
  { estado: 'respondido', etiqueta: 'Respondidos' },
]

function FilterBar({ filtroEstado, onFiltrar }) {
  return (
    <div className="filters" role="group" aria-label="Filtrar por estado">
      {FILTROS.map((filtro) => (
        <button
          key={filtro.etiqueta}
          type="button"
          className={'filter' + (filtroEstado === filtro.estado ? ' is-active' : '')}
          onClick={() => onFiltrar(filtro.estado)}
        >
          {filtro.etiqueta}
        </button>
      ))}
    </div>
  )
}

export default FilterBar
