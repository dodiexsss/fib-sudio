import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Gracias from '../components/Gracias.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Gracias />
  </StrictMode>,
)
