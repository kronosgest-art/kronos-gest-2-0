import { Bell, Search, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { useApp } from '@/context/AppContext'
import { Badge } from '@/components/ui/badge'

export function TopHeader() {
  const { toggleSidebar } = useSidebar()
  const { role } = useApp()

  const getPageTitle = () => {
    const path = window.location.pathname
    if (path.includes('dashboard')) return 'Dashboard'
    if (path.includes('pacientes')) return 'Pacientes'
    if (path.includes('agenda')) return 'Agenda'
    return 'Visão Geral'
  }

  return (
    <header className="h-16 border-b bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-brand hidden sm:block">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        {(role === 'admin' || role === 'professional') && (
          <div className="relative w-full max-w-sm hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pacientes, prontuários..."
              className="pl-9 bg-muted/50 border-transparent focus-visible:ring-gold"
            />
          </div>
        )}

        <Badge
          variant="outline"
          className="hidden sm:inline-flex capitalize bg-blue-50 text-brand border-blue-200"
        >
          {role === 'professional' ? 'Plano Gold' : role}
        </Badge>

        <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-brand">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </Button>
      </div>
    </header>
  )
}
