import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import logoUrl from '@/assets/logomarca-kronos-gest-5cdc9.jpeg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await signIn(email, password)
      if (error) {
        toast({ title: 'Erro ao fazer login', description: error.message, variant: 'destructive' })
      } else {
        toast({ title: 'Login bem-sucedido', description: 'Bem-vindo ao KronosGest Clínica!' })
      }
    } catch (err: any) {
      toast({ title: 'Erro inesperado', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/30 items-center justify-center p-4">
      <div className="w-full max-w-md bg-background rounded-xl shadow-lg border p-8 space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 shadow-sm bg-white flex items-center justify-center">
            <img src={logoUrl} alt="KronosGest Logo" className="w-full h-full object-contain p-2" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">KronosGest Clínica</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Faça login para acessar a gestão inteligente
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </Button>
        </form>
      </div>
    </div>
  )
}
