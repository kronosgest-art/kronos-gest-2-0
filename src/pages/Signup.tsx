import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

// Password validation: min 8 chars, 1 uppercase, 1 number
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/

const signupSchema = z
  .object({
    nome: z.string().min(3, { message: 'Nome completo é obrigatório (mín. 3 letras)' }),
    email: z.string().email({ message: 'E-mail inválido' }),
    role: z.enum(['profissional', 'paciente'], { required_error: 'Selecione o tipo de perfil' }),
    organization_id: z.string().optional(),
    password: z
      .string()
      .regex(passwordRegex, { message: 'Mínimo 8 caracteres, 1 maiúscula e 1 número' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nome: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'paciente', // Default selection
      organization_id: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsLoading(true)

    let finalOrgId = data.organization_id || null

    // Automatically assign to first organization if left blank (useful for auto-association)
    if (!finalOrgId) {
      const { data: orgData } = await supabase.from('organizations').select('id').limit(1).single()

      if (orgData) {
        finalOrgId = orgData.id
      }
    }

    // Pass custom metadata for the trigger to pick up
    const { error } = await signUp(data.email, data.password, {
      nome: data.nome,
      role: data.role,
      organization_id: finalOrgId,
    })

    setIsLoading(false)

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar conta',
        description: error.message,
      })
    } else {
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Você já pode fazer login no sistema.',
      })
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand/90 to-black/80 mix-blend-multiply" />

      <div className="relative z-10 w-full max-w-lg p-4 animate-slide-up">
        <div className="flex flex-col items-center mb-6 text-white">
          <div className="h-12 w-12 bg-gold rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg mb-3">
            K
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Criar Conta</h1>
        </div>

        <Card className="glass-card border-none shadow-2xl bg-white/95 backdrop-blur-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-center text-brand">Bem-vindo(a)</CardTitle>
            <CardDescription className="text-center">
              Preencha os dados abaixo para se cadastrar na KronosGest.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: João da Silva" {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-2 sm:col-span-1">
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
                    name="role"
                    render={({ field }) => (
                      <FormItem className="col-span-2 sm:col-span-1">
                        <FormLabel>Perfil</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="profissional">Profissional de Saúde</SelectItem>
                            <SelectItem value="paciente">Paciente</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch('role') === 'paciente' && (
                  <FormField
                    control={form.control}
                    name="organization_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código da Clínica (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="ID da organização" {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Mínimo 8 caracteres, 1 maiúscula, 1 número"
                          {...field}
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Repita a senha"
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
                  className="w-full bg-brand hover:bg-brand/90 text-white font-medium h-11 shadow-md transition-all duration-300 mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cadastrando...
                    </>
                  ) : (
                    'Finalizar Cadastro'
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Já possui uma conta?{' '}
              <Link to="/" className="text-brand font-medium hover:underline">
                Faça Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
