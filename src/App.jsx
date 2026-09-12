import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AdminProvider } from './context/AdminContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import CategoryPage from './pages/CategoryPage'
import ProductDetail from './pages/ProductDetail'
import CartCheckout from './pages/CartCheckout'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Faq from './pages/Faq'
import StatusPage from './pages/StatusPage'
import Impact from './pages/Impact'
import Developers from './pages/Developers'
import Docs from './pages/Docs'
import Forums from './pages/Forums'
import Buy from './pages/Buy'
import Login from './pages/Login'
import Register from './pages/Register'
import SetupAccount from './pages/SetupAccount'
import AuthCallback from './pages/AuthCallback'
import Dashboard from './pages/Dashboard'
import Support from './pages/Support'
import NewTicket from './pages/NewTicket'
import TicketDetail from './pages/TicketDetail'
import Settings from './pages/Settings'
import AdminLayout from './pages/admin/AdminLayout'
import AdminOverview from './pages/admin/AdminOverview'
import ManageProjects from './pages/admin/ManageProjects'
import ManageTeam from './pages/admin/ManageTeam'
import ManageRoles from './pages/admin/ManageRoles'
import ManageUsers from './pages/admin/ManageUsers'
import AdminTickets from './pages/admin/AdminTickets'
import AdminLicenses from './pages/admin/AdminLicenses'
import AdminPromos from './pages/admin/AdminPromos'
import NotFound from './pages/NotFound'

function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  const { lang } = useParams()
  if (loading) return null
  if (!user || user.role !== 'admin') return <Navigate to={`/${lang}/404`} replace />
  return children
}

function RequireStaff({ children }) {
  const { user, loading } = useAuth()
  const { lang } = useParams()
  if (loading) return null
  if (!user || (user.role !== 'staff' && user.role !== 'admin')) return <Navigate to={`/${lang}/404`} replace />
  return children
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const { lang } = useParams()
  if (loading) return null
  if (!user) return <Navigate to={`/${lang}/login`} replace />
  return children
}

function RedirectTo({ to }) {
  const { lang } = useParams()
  return <Navigate to={`/${lang}${to}`} replace />
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
      <CartProvider>
        <ScrollToTop />
        <Navbar />
        <CartDrawer />
        <div key={pathname} className="page-fade" style={{ minHeight: '60vh' }}>
          {!validLang ? (
            <NotFound />
          ) : (
            <Routes>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:catId" element={<CategoryPage />} />
              <Route path="product/:slug" element={<ProductDetail />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="faq" element={<Faq />} />
              <Route path="status" element={<StatusPage />} />
              <Route path="checkout" element={<CartCheckout />} />
              <Route path="impact" element={<Impact />} />
              <Route path="developers" element={<Developers />} />
<Route path="docs" element={<Docs />} />
<Route path="forums" element={<Forums />} />
            <Route path="pricing" element={<RedirectTo to="/services" />} />
            <Route path="buy" element={<Buy />} />
            <Route path="buy/:plan" element={<Buy />} />
            <Route path="contact" element={<RedirectTo to="/support/new" />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="auth/callback" element={<AuthCallback />} />
            <Route path="setup" element={<RequireAuth><SetupAccount /></RequireAuth>} />
            <Route path="dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="support" element={<RequireAuth><Support /></RequireAuth>} />
            <Route path="support/new" element={<RequireAuth><NewTicket /></RequireAuth>} />
            <Route path="support/ticket/:slug" element={<RequireAuth><TicketDetail /></RequireAuth>} />
            <Route path="settings/:section" element={<RequireAuth><Settings /></RequireAuth>} />
            <Route path="admin" element={<RequireStaff><AdminLayout /></RequireStaff>}>
              <Route index element={<AdminOverview />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="team" element={<ManageTeam />} />
              <Route path="roles" element={<ManageRoles />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="tickets" element={<AdminTickets />} />
              <Route path="licenses" element={<AdminLicenses />} />
              <Route path="promos" element={<AdminPromos />} />
            </Route>
            <Route path="member" element={<RedirectTo to="/dashboard" />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </div>
      <Footer />
    </CartProvider>
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