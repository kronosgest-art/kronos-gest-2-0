import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Settings,
  HelpCircle,
  ClipboardList,
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

  // Admin Items
  const adminItems = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/admin/dashboard' },
    { title: 'Clínicas', icon: Building2, url: '/admin/clinicas' },
    { title: 'Assinaturas', icon: CreditCard, url: '/admin/assinaturas' },
    { title: 'Configurações', icon: Settings, url: '/admin/settings' },
  ]

  // Professional Items
  const profItems = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/prof/dashboard' },
    { title: 'Pacientes', icon: Users, url: '/prof/pacientes' },
    { title: 'Agenda', icon: Calendar, url: '/prof/agenda' },
    { title: 'Anamnese', icon: ClipboardList, url: '/prof/anamnese' },
    { title: 'Exames', icon: FileText, url: '/prof/exames' },
    { title: 'Financeiro', icon: CreditCard, url: '/prof/financeiro' },
  ]

  // Patient Items
  const pacienteItems = [
    { title: 'Meu Painel', icon: LayoutDashboard, url: '/paciente/dashboard' },
    { title: 'Minhas Consultas', icon: Calendar, url: '/paciente/consultas' },
    { title: 'Meus Exames', icon: FileText, url: '/paciente/exames' },
  ]

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
                      className={`w-full justify-start h-11 transition-all duration-200 ${
                        isActive
                          ? 'bg-white/10 text-gold font-medium hover:bg-white/15 hover:text-gold'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
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
              className="w-full justify-start text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
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

function Building2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}
