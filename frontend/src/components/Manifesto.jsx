function Manifesto() {
  return (
    <section className="manifesto" id="estudio" aria-labelledby="estudio-title">
      <div className="wrap manifesto-inner">
        <p className="section-eyebrow mono">01 — el estudio</p>
        <h2 id="estudio-title">La espiral es la firma de FibStudio</h2>
        <div className="manifesto-grid">
          <p className="manifesto-lead">
            El nombre <strong>Fib</strong>studio viene de Fibonacci: la secuencia detrás de la espiral
            áurea que artistas y fotógrafos usan hace siglos para guiar la mirada hacia lo que importa.
          </p>
          <p>
            Trabajamos igual con las historias de las personas. Cada evento y cada sesión tiene un punto
            de atención emocional —una mirada, un abrazo, un silencio— y nuestro trabajo es encontrarlo,
            encuadrarlo y dejar que la composición lo sostenga. Nada de fórmulas frías: cada sesión se
            planea a partir de lo que quieres recordar dentro de veinte años.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Manifesto
