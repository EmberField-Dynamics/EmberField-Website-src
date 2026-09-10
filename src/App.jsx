import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import { AdminProvider } from './context/AdminContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Impact from './pages/Impact'
import Developers from './pages/Developers'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

const validLangs = ['en', 'fr', 'de', 'es', 'it']

function getSavedLang() {
  try {
    const saved = localStorage.getItem('ed-lang')
    if (saved && validLangs.includes(saved)) return saved
  } catch {}
  return 'en'
}

function RootRedirect() {
  const lang = getSavedLang()
  return <Navigate to={`/${lang}`} replace />
}

function BareRouteRedirect() {
  const lang = getSavedLang()
  const path = window.location.pathname
  return <Navigate to={`/${lang}${path}`} replace />
}

function LangLayout() {
  const { pathname } = useLocation()
  return (
    <LanguageProvider>
      <ScrollToTop />
      <Navbar />
      <div key={pathname} className="page-fade" style={{ minHeight: '60vh' }}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="impact" element={<Impact />} />
          <Route path="developers" element={<Developers />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </LanguageProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path=":lang/*" element={<LangLayout />} />
            </Routes>
          </BrowserRouter>
          <Analytics />
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
