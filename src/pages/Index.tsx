import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, Role } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function Index() {
  const [selectedRole, setSelectedRole] = useState<Role>('professional')
  const [loading, setLoading] = useState(false)
  const { login } = useApp()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      login(selectedRole)
      if (selectedRole === 'admin') navigate('/admin/dashboard')
      else if (selectedRole === 'professional') navigate('/prof/dashboard')
      else navigate('/paciente/dashboard')
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand relative overflow-hidden bg-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand/90 to-black/80 mix-blend-multiply" />

      <div className="relative z-10 w-full max-w-md p-4 animate-slide-up">
        <div className="flex flex-col items-center mb-8 text-white">
          <div className="h-16 w-16 bg-gold rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg mb-4">
            K
          </div>
          <h1 className="text-3xl font-bold tracking-tight">KronosGest</h1>
          <p className="text-blue-200 mt-2">Saúde Integrativa & Gestão Premium</p>
        </div>

        <Card className="glass-card border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-brand">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-center">
              Simule o acesso escolhendo um perfil abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  defaultValue="demo@kronosgest.com"
                  required
                  className="bg-slate-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  defaultValue="123456"
                  required
                  className="bg-slate-50"
                />
              </div>

              <div className="space-y-2 pt-2 border-t">
                <Label className="text-gold font-medium">Simulador de Papel</Label>
                <Select
                  value={selectedRole || ''}
                  onValueChange={(v) => setSelectedRole(v as Role)}
                >
                  <SelectTrigger className="border-gold/50 focus:ring-gold">
                    <SelectValue placeholder="Selecione o papel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador (Plataforma)</SelectItem>
                    <SelectItem value="professional">Profissional de Saúde</SelectItem>
                    <SelectItem value="patient">Paciente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-white font-medium h-12 shadow-md transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar no KronosGest'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
