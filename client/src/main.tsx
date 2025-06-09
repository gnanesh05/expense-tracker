import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/authContext.tsx'
import { ToastProvider } from './contexts/toastContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
          <App />
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
)
