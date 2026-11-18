import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import DashboardPage from '../components/DashboardPage.jsx'
import './dashboard.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DashboardPage />
  </StrictMode>,
)
