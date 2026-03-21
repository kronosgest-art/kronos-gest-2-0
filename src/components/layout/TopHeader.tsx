import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { LogOut, Bell, User } from 'lucide-react'

export function TopHeader() {
  const { profile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-brand hidden md:block">
          Bem-vindo(a) ao seu espaço
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-brand relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
        </Button>

        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-slate-700">{profile?.nome || 'Usuário'}</span>
            {profile?.role && (
              <span className="text-[10px] uppercase font-bold text-gold tracking-wider">
                {profile.role}
              </span>
            )}
          </div>
          <div className="h-9 w-9 rounded-full bg-brand/10 flex items-center justify-center text-brand">
            <User className="h-5 w-5" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-red-600 hover:bg-red-50 ml-1"
            onClick={handleSignOut}
            title="Sair do sistema"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
