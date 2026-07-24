import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
const page =
  pathname === '/demo'
    ? import('./App').then(({ App }) => <App />)
    : import('./LandingPage').then(({ LandingPage }) => <LandingPage />)

createRoot(document.getElementById('root')!).render(<StrictMode>{await page}</StrictMode>)
