import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { firstAllowedRoute } from '../lib/navItems'
import LoadingSpinner from './ui/LoadingSpinner'

export default function ProtectedRoute({ children, requiredPermission }) {
  const { user, loading, hasPermission } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  // Nëse rruga kërkon një leje që përdoruesi s'e ka → ridrejto te faqja e parë e lejuar.
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={firstAllowedRoute(hasPermission)} replace />
  }

  return children
}
