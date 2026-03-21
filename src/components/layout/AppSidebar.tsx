import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Activity,
  Settings,
  LogOut,
  Building,
  CreditCard,
  Stethoscope,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/context/AppContext'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function AppSidebar() {
  const { role, logout } = useApp()
  const location = useLocation()

  const getLinks = () => {
    if (role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Clínicas', path: '#', icon: Building },
        { label: 'Faturamento', path: '#', icon: CreditCard },
      ]
    }
    if (role === 'professional') {
      return [
        { label: 'Dashboard', path: '/prof/dashboard', icon: LayoutDashboard },
        { label: 'Pacientes', path: '/prof/pacientes', icon: Users },
        { label: 'Agenda', path: '/prof/agenda', icon: Calendar },
        { label: 'Anamnese', path: '#', icon: FileText },
        { label: 'Exames', path: '#', icon: Activity },
        { label: 'Prescrições', path: '#', icon: Stethoscope },
        { label: 'Financeiro', path: '#', icon: CreditCard },
        { label: 'Configurações', path: '#', icon: Settings },
      ]
    }
    if (role === 'patient') {
      return [
        { label: 'Meu Painel', path: '/paciente/dashboard', icon: LayoutDashboard },
        { label: 'Minha Saúde', path: '#', icon: Activity },
        { label: 'Agenda', path: '#', icon: Calendar },
      ]
    }
    return []
  }

  const links = getLinks()

  if (!role) return null

  return (
    <Sidebar variant="sidebar" className="border-r-0">
      <SidebarHeader className="h-16 flex items-center justify-center px-4 pt-6">
        <div className="flex items-center gap-2 text-sidebar-primary-foreground">
          <div className="h-8 w-8 rounded-lg bg-gold flex items-center justify-center font-bold text-lg shadow-sm">
            K
          </div>
          <span className="text-xl font-bold tracking-tight">KronosGest</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-6 gap-2">
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.label}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === link.path}
                className={cn(
                  'hover:bg-sidebar-accent hover:text-white transition-colors h-10',
                  location.pathname === link.path &&
                    'bg-sidebar-accent text-white font-medium border-l-4 border-gold rounded-l-none',
                )}
              >
                <Link to={link.path} className="flex items-center gap-3">
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="bg-sidebar-accent rounded-xl p-4 flex flex-col gap-3 mb-2 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center border border-gold/50 text-sidebar-primary-foreground">
              {role === 'admin' ? 'A' : role === 'professional' ? 'P' : 'PA'}
            </div>
            <div className="flex flex-col text-sidebar-primary-foreground">
              <span className="text-sm font-medium leading-none capitalize">
                {role === 'admin'
                  ? 'Administrador'
                  : role === 'professional'
                    ? 'Profissional'
                    : 'Paciente'}
              </span>
              <span className="text-xs text-sidebar-primary-foreground/70">conta ativa</span>
            </div>
          </div>
          <button
            onClick={() => {
              logout()
              window.location.href = '/'
            }}
            className="flex items-center gap-2 text-sm text-sidebar-primary-foreground/80 hover:text-white transition-colors mt-2"
          >
            <LogOut className="h-4 w-4" />
            Sair da conta
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
