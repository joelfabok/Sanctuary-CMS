import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Landing    from './pages/Landing'
import Templates  from './pages/Templates'
import Features   from './pages/Features'
import Pricing    from './pages/Pricing'
import AuthPage   from './pages/Auth'
import Dashboard  from './pages/Dashboard'
import Builder    from './pages/Builder'
import Settings   from './pages/Settings'
import Admin      from './pages/Admin'
import Privacy      from './pages/Privacy'
import Terms        from './pages/Terms'
import Contact      from './pages/Contact'
import SiteRenderer from './pages/SiteRenderer'

function ProtectedRoute({ children, adminRequired = false }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ width:32, height:32, border:'2px solid var(--gold)', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
    </div>
  )
  if (!user) return <Navigate to="/auth" replace />
  if (adminRequired && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/"          element={<Landing />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/features"  element={<Features />} />
      <Route path="/pricing"   element={<Pricing />} />
      <Route path="/auth"      element={user ? <Navigate to={user.role==='admin'?'/admin':'/dashboard'} replace /> : <AuthPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/builder/:siteId" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
      <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/admin"     element={<ProtectedRoute adminRequired><Admin /></ProtectedRoute>} />
      <Route path="/privacy"   element={<Privacy />} />
      <Route path="/terms"     element={<Terms />} />
      <Route path="/contact"   element={<Contact />} />
      <Route path="/site/:siteId" element={<SiteRenderer />} />
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
