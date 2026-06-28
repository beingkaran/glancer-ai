import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Geist — Vercel's clean geometric typeface, self-hosted via Fontsource so the
// site no longer depends on Google Fonts for its primary type.
import '@fontsource/geist-sans/300.css'
import '@fontsource/geist-sans/400.css'
import '@fontsource/geist-sans/500.css'
import '@fontsource/geist-sans/600.css'
import '@fontsource/geist-sans/700.css'
import '@fontsource/geist-sans/800.css'
import '@fontsource/geist-mono/400.css'
import '@fontsource/geist-mono/500.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ADSENSE_ENABLED, ADSENSE_CLIENT } from './lib/adsense.js'

// Load the Google AdSense loader once, only after a real publisher id is set.
// Keeping it out of index.html avoids a 404 + empty ad boxes during review.
if (ADSENSE_ENABLED && !document.querySelector('script[data-adsense]')) {
  const s = document.createElement('script')
  s.async = true
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`
  s.crossOrigin = 'anonymous'
  s.setAttribute('data-adsense', '1')
  document.head.appendChild(s)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
