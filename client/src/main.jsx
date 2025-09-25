import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <GoogleOAuthProvider clientId="23900530298-sb70uegvp7fh0ont913tfiijuok4f29e.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  </StrictMode>,
)

