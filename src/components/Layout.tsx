import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './layout/AppSidebar'
import { TopHeader } from './layout/TopHeader'
import { useAuth } from '@/hooks/use-auth'

export default function Layout() {
  const { user, loading } = useAuth()
  const location = useLocation()

  const publicRoutes = ['/', '/signup', '/forgot-password']
  const isPublicRoute = publicRoutes.includes(location.pathname)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-brand">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="h-12 w-12 bg-gold rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            K
          </div>
          <p className="font-medium">Carregando...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if unauthenticated and trying to access a protected route
  if (!user && !isPublicRoute) {
    return <Navigate to="/" replace />
  }

  // If on a public route, just render the content (Login, Signup, etc)
  if (isPublicRoute) {
    return <Outlet />
  }

  // Authenticated layout
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-50 flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col bg-slate-50 h-screen overflow-hidden">
          <TopHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in overflow-y-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
