import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && profile?.role && !allowedRoles.includes(profile.role)) {
    if (profile.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    if (profile.role === 'profissional') return <Navigate to="/professional/dashboard" replace />
    return <Navigate to="/patient/dashboard" replace />
  }

  return <Outlet />
}
