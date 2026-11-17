function Toast({ texto }) {
  return (
    <div className="toast" id="toast" role="status" aria-live="polite">
      {texto}
    </div>
  )
}

export default Toast
