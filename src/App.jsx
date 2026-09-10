import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider, useAuth } from './context/AuthContext'
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
import MemberDashboard from './pages/MemberDashboard'
import SetupAccount from './pages/SetupAccount'
import AuthCallback from './pages/AuthCallback'
import NotFound from './pages/NotFound'

function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  const { lang } = useParams()
  if (loading) return null
  if (!user || user.role !== 'admin') return <Navigate to={`/${lang}/404`} replace />
  return children
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const { lang } = useParams()
  if (loading) return null
  if (!user) return <Navigate to={`/${lang}/login`} replace />
  return children
}

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
  const { lang } = useParams()
  const validLang = validLangs.includes(lang)

  return (
    <LanguageProvider>
      <ScrollToTop />
      <Navbar />
      <div key={pathname} className="page-fade" style={{ minHeight: '60vh' }}>
        {!validLang ? (
          <NotFound />
        ) : (
          <Routes>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="impact" element={<Impact />} />
            <Route path="developers" element={<Developers />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="auth/callback" element={<AuthCallback />} />
            <Route path="admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
            <Route path="setup" element={<RequireAuth><SetupAccount /></RequireAuth>} />
            <Route path="member" element={<RequireAuth><MemberDashboard /></RequireAuth>} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
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
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
