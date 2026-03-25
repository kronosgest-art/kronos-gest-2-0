import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  Settings,
  HelpCircle,
  Coins,
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

  const adminItems = [{ title: 'Painel Admin', icon: LayoutDashboard, url: '/admin/dashboard' }]

  const profItems = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/professional/dashboard' },
    { title: 'Pacientes', icon: Users, url: '/professional/patients' },
    { title: 'Agenda', icon: Calendar, url: '/professional/appointments' },
    { title: 'Financeiro', icon: CreditCard, url: '/professional/financial' },
    { title: 'Créditos', icon: Coins, url: '/professional/creditos' },
    { title: 'Configurações', icon: Settings, url: '/professional/settings' },
  ]

  const pacienteItems = [
    { title: 'Portal do Paciente', icon: LayoutDashboard, url: '/patient/dashboard' },
  ]

  const navItems = isAdmin ? adminItems : isPaciente ? pacienteItems : profItems

  return (
    <Sidebar className="border-r border-slate-200 bg-[#1E3A8A] text-slate-100">
      <SidebarHeader className="p-4 border-b border-white/10 flex flex-col items-center">
        <img
          src="/logo.png"
          alt="KronosGest Logo"
          className="w-[120px] h-[40px] object-contain mb-2"
        />
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
                      className={`w-full justify-start h-11 transition-all duration-200 ${isActive ? 'bg-white/10 text-[#B8860B] font-medium' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                    >
                      <Link to={item.url}>
                        <item.icon
                          className={`mr-3 h-5 w-5 ${isActive ? 'text-[#B8860B]' : 'text-slate-400'}`}
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
