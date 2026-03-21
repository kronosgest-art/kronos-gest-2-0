import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'
import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  CreditCard,
  Activity,
  Building2,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export function AppSidebar() {
  const { profile } = useAuth()
  const location = useLocation()

  const getMenuItems = () => {
    if (profile?.role === 'admin') {
      return [
        { title: 'Dashboard', url: '/admin/dashboard', icon: Home },
        { title: 'Clínicas', url: '#', icon: Building2 },
        { title: 'Assinaturas', url: '#', icon: CreditCard },
        { title: 'Configurações', url: '#', icon: Settings },
      ]
    }
    if (profile?.role === 'profissional') {
      return [
        { title: 'Dashboard', url: '/prof/dashboard', icon: Home },
        { title: 'Pacientes', url: '/prof/pacientes', icon: Users },
        { title: 'Agenda', url: '/prof/agenda', icon: Calendar },
        { title: 'Anamnese', url: '#', icon: Activity },
        { title: 'Exames', url: '#', icon: FileText },
        { title: 'Prescrições', url: '#', icon: FileText },
        { title: 'Financeiro', url: '#', icon: CreditCard },
        { title: 'Configurações', url: '#', icon: Settings },
      ]
    }
    if (profile?.role === 'paciente') {
      return [
        { title: 'Meu Painel', url: '/paciente/dashboard', icon: Home },
        { title: 'Minha Agenda', url: '#', icon: Calendar },
        { title: 'Prescrições', url: '#', icon: FileText },
        { title: 'Perfil', url: '#', icon: Settings },
      ]
    }
    return []
  }

  const items = getMenuItems()

  return (
    <Sidebar className="border-r border-brand/10 bg-white">
      <SidebarContent>
        <div className="p-5 flex flex-col items-center justify-center border-b border-slate-100">
          <div className="h-10 w-10 bg-gold rounded-lg flex items-center justify-center text-white font-bold text-xl mb-2 shadow-sm">
            K
          </div>
          <span className="font-bold text-lg text-brand tracking-tight">KronosGest</span>
        </div>
        <SidebarGroup className="px-2 py-4">
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.url}
                  className="rounded-md data-[active=true]:bg-brand/5 data-[active=true]:text-brand data-[active=true]:font-medium text-slate-600 hover:text-brand hover:bg-slate-50 transition-colors py-5"
                >
                  <Link to={item.url} className="flex items-center gap-3 px-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
