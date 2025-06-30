import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext.tsx'
import { SuggetionProvider } from './context/SuggetionsContext.tsx'
import { ProfileProvider } from './context/ProfileContext.tsx'
import { CaloriesProvider } from './context/CalorieContex.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ProfileProvider>
          <CaloriesProvider>
            <SuggetionProvider>
              <ThemeProvider>
                <Toaster richColors />
                <App />
              </ThemeProvider>
            </SuggetionProvider>
          </CaloriesProvider>
        </ProfileProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
