import { Link, useNavigate } from 'react-router-dom'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell, LogOut, User, Settings, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export function TopHeader() {
  const { signOut, profile, user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const userInitials = profile?.nome ? getInitials(profile.nome) : 'U'
  const roleDisplay =
    profile?.role === 'admin'
      ? 'Administrador'
      : profile?.role === 'profissional'
        ? 'Profissional'
        : 'Paciente'

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-slate-500 hover:text-brand" />
        <div className="hidden md:block">
          <p className="text-sm font-medium text-slate-500">Gestão Inteligente</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-500 hover:text-brand rounded-full"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-brand/10">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${userInitials}`}
                  alt={profile?.nome || 'User'}
                />
                <AvatarFallback className="bg-brand/5 text-brand">{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-brand">
                  {profile?.nome || user?.email}
                </p>
                <p className="text-xs leading-none text-muted-foreground">{roleDisplay}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/perfil" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </Link>
            </DropdownMenuItem>
            {profile?.role === 'admin' && (
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/admin/settings" className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Painel Admin</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-600 cursor-pointer focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
