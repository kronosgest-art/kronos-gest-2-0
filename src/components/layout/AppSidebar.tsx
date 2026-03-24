import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Settings,
  HelpCircle,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'

export function AppSidebar() {
  const location = useLocation()
  const { profile } = useAuth()
  const isAdmin = profile?.role === 'admin'
  const isPaciente = profile?.role === 'paciente'

  const adminItems = [{ title: 'Dashboard', icon: LayoutDashboard, url: '/admin/dashboard' }]

  const profItems = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/professional/dashboard' },
    { title: 'Pacientes', icon: Users, url: '/professional/patients' },
    { title: 'Agenda', icon: Calendar, url: '/professional/appointments' },
    { title: 'Financeiro', icon: CreditCard, url: '/professional/financial' },
    { title: 'Configurações', icon: Settings, url: '/professional/settings' },
  ]

  const pacienteItems = [{ title: 'Meu Painel', icon: LayoutDashboard, url: '/patient/dashboard' }]

  const navItems = isAdmin ? adminItems : isPaciente ? pacienteItems : profItems

  return (
    <Sidebar className="border-r border-slate-200 bg-brand text-slate-100">
      <SidebarHeader className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gold rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            K
          </div>
          <span className="font-bold text-xl tracking-tight text-white">KronosGest</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.url || location.pathname.startsWith(item.url + '/')
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`w-full justify-start h-11 transition-all duration-200 ${isActive ? 'bg-white/10 text-gold font-medium' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                    >
                      <Link to={item.url}>
                        <item.icon
                          className={`mr-3 h-5 w-5 ${isActive ? 'text-gold' : 'text-slate-400'}`}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="w-full justify-start text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <a href="#">
                <HelpCircle className="mr-3 h-5 w-5 text-slate-400" />
                <span>Ajuda e Suporte</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
