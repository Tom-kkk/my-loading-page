import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import logoImg from './assets/logo.jpg'
import { LocaleProvider } from './contexts/LocaleContext'

const link =
  document.querySelector("link[rel*='icon']") ||
  (() => {
    const l = document.createElement('link')
    document.head.appendChild(l)
    return l
  })()
link.rel = 'icon'
link.type = 'image/jpeg'
link.href = logoImg

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </BrowserRouter>
  </StrictMode>,
)
