import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { LandingPage } from './LandingPage'
import './styles.css'

const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
const page = pathname === '/demo' ? <App /> : <LandingPage />

createRoot(document.getElementById('root')!).render(
  <StrictMode>{page}</StrictMode>,
)
