function LoginForm() {
  return (
    <form id="loginForm">
      <label htmlFor="token">Token de administración</label>
      <input type="password" id="token" autoComplete="current-password" required />
      <button type="submit" className="btn-primary">Entrar</button>
      <p className="error" id="loginError" role="alert"></p>
    </form>
  )
}

export default LoginForm
