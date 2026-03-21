import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './layout/AppSidebar'
import { TopHeader } from './layout/TopHeader'
import { useApp } from '@/context/AppContext'

export default function Layout() {
  const { role } = useApp()
  const location = useLocation()

  if (!role && location.pathname !== '/') {
    return <Navigate to="/" replace />
  }

  if (location.pathname === '/') {
    return <Outlet />
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col bg-background/50">
          <TopHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in overflow-x-hidden">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
