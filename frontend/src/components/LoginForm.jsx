// El formulario recibe el token y el error desde el componente padre por props.
function LoginForm({ token, onTokenChange, onSubmit, error }) {
  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <label htmlFor="token">Token de administración</label>
      <input
        type="password"
        id="token"
        autoComplete="current-password"
        required
        value={token}
        onChange={(evento) => onTokenChange(evento.target.value)}
      />
      <button type="submit" className="btn-primary">Entrar</button>
      <p className="error" id="loginError" role="alert">{error}</p>
    </form>
  )
}

export default LoginForm
