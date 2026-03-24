import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'A senha é obrigatória' }),
})

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, user, profile } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'admin') navigate('/admin/dashboard', { replace: true })
      else if (profile.role === 'profissional')
        navigate('/professional/dashboard', { replace: true })
      else navigate('/patient/dashboard', { replace: true })
    }
  }, [user, profile, navigate])

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true)
    const { error } = await signIn(data.email, data.password)
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao entrar',
        description: 'Credenciais inválidas.',
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand relative overflow-hidden bg-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand/90 to-black/80 mix-blend-multiply" />
      <div className="relative z-10 w-full max-w-md p-4 animate-slide-up">
        <div className="flex flex-col items-center mb-8 text-white">
          <div className="h-16 w-16 bg-gold rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg mb-4">
            K
          </div>
          <h1 className="text-3xl font-bold tracking-tight">KronosGest SaaS</h1>
          <p className="text-blue-200 mt-2">Saúde Integrativa & Gestão Premium</p>
        </div>
        <Card className="glass-card border-none shadow-2xl bg-white/95 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-brand">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="nome@exemplo.com" {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-white font-medium h-12 shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center text-sm text-slate-500">
              Não tem uma conta?{' '}
              <Link to="/signup" className="text-brand font-medium hover:underline">
                Cadastre-se
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
