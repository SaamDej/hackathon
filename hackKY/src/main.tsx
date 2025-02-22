import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthPages from './AuthPages.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthPages />
  </StrictMode>,
)
