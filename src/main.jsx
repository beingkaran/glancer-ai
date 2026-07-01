import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Editorial type system (Newsreader serif + IBM Plex Sans/Mono) is loaded via
// Google Fonts in index.html — see the "Intelligence Desk" comment there.
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ADSENSE_ENABLED, ADSENSE_CLIENT } from './lib/adsense.js'
import { initNativeApp } from './lib/nativeApp.js'

// Tag the platform + theme the native shell (no-op on the plain web build).
initNativeApp()

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
