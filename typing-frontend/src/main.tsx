import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import './i18n'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { WrongCharsContextProvider } from './store/WrongCharsContext.tsx';
import { AuthContextProvider } from './store/AuthContext.tsx';
import { PreferenceContextProvider } from './store/PreferenceContext.tsx';
import { LessonContextProvider } from './store/LessonContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <PreferenceContextProvider>
          <LessonContextProvider>
            <WrongCharsContextProvider>
              <App />
            </WrongCharsContextProvider>
          </LessonContextProvider>
        </PreferenceContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
