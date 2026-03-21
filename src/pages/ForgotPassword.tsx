import { useState } from 'react'
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
import { Loader2, ArrowLeft } from 'lucide-react'

const forgotSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
})

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: z.infer<typeof forgotSchema>) => {
    setIsLoading(true)
    const { error } = await resetPassword(data.email)
    setIsLoading(false)

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível enviar o link de recuperação.',
      })
    } else {
      setIsSent(true)
      toast({
        title: 'Link enviado!',
        description: 'Verifique sua caixa de entrada.',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand/90 to-black/80 mix-blend-multiply" />

      <div className="relative z-10 w-full max-w-md p-4 animate-slide-up">
        <Card className="glass-card border-none shadow-2xl bg-white/95 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-center text-brand">Recuperar Senha</CardTitle>
            <CardDescription className="text-center">
              {isSent
                ? 'Link de redefinição enviado com sucesso.'
                : 'Informe seu e-mail para receber um link de redefinição.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSent ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail cadastrado</FormLabel>
                        <FormControl>
                          <Input placeholder="nome@exemplo.com" {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-brand hover:bg-brand/90 text-white font-medium h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="py-4 text-center">
                <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                  Voltar para o Login
                </Button>
              </div>
            )}

            {!isSent && (
              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="text-sm flex items-center justify-center text-slate-500 hover:text-brand transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para o login
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
