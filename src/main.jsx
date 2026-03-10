import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import logoImg from './assets/logo.jpg'

// 使用个人头像作为浏览器标签图标
const link = document.querySelector("link[rel*='icon']") || (() => { const l = document.createElement('link'); document.head.appendChild(l); return l })()
link.rel = 'icon'
link.type = 'image/jpeg'
link.href = logoImg

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
