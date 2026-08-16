import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { warmUpBackend } from './utils/apiClient.js'

// Ping the backend immediately on load — on free hosting tiers the server
// may be asleep and take 50+ seconds to wake up. Starting that wake-up now
// means it's more likely already awake by the time the person submits a
// form, instead of waiting for their first real action to trigger it.
warmUpBackend()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
