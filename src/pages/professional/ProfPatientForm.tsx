import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { Loader2, ArrowLeft, Save } from 'lucide-react'

const patientSchema = z.object({
  nome: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }).optional().or(z.literal('')),
  telefone: z.string().min(10, { message: 'Telefone inválido' }).optional().or(z.literal('')),
  data_nascimento: z.string().optional().or(z.literal('')),
  status: z.string().default('ativo'),
})

type PatientFormValues = z.infer<typeof patientSchema>

export default function ProfPatientForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(isEditing)

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      data_nascimento: '',
      status: 'ativo',
    },
  })

  useEffect(() => {
    async function loadPatient() {
      if (!isEditing || !id || !profile?.organization_id) {
        setIsFetching(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('pacientes')
          .select('*')
          .eq('id', id)
          .eq('organization_id', profile.organization_id)
          .single()

        if (error) throw error

        if (data) {
          form.reset({
            nome: data.nome || '',
            email: data.email || '',
            telefone: data.telefone || '',
            data_nascimento: data.data_nascimento || '',
            status: data.status || 'ativo',
          })
        }
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar paciente',
          description: error.message,
        })
        navigate('/prof/pacientes')
      } finally {
        setIsFetching(false)
      }
    }

    loadPatient()
  }, [id, isEditing, form, navigate, toast, profile])

  const onSubmit = async (data: PatientFormValues) => {
    if (!profile?.organization_id) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Organização não encontrada.',
      })
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        nome: data.nome,
        email: data.email || null,
        telefone: data.telefone || null,
        data_nascimento: data.data_nascimento || null,
        status: data.status,
        organization_id: profile.organization_id,
      }

      if (isEditing && id) {
        const { error } = await supabase
          .from('pacientes')
          .update(payload)
          .eq('id', id)
          .eq('organization_id', profile.organization_id)

        if (error) throw error

        toast({
          title: 'Sucesso',
          description: 'Paciente atualizado com sucesso.',
        })
      } else {
        const { error } = await supabase.from('pacientes').insert([payload])

        if (error) throw error

        toast({
          title: 'Sucesso',
          description: 'Paciente cadastrado com sucesso.',
        })
      }
      navigate('/prof/pacientes')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar paciente',
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/prof/pacientes')}>
          <ArrowLeft className="h-5 w-5 text-brand" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-brand">
            {isEditing ? 'Editar Paciente' : 'Novo Paciente'}
          </h2>
          <p className="text-muted-foreground">
            {isEditing
              ? 'Atualize os dados do paciente'
              : 'Preencha os dados para cadastrar um novo paciente'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
          <CardDescription>Informações básicas para identificação e contato.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome Completo *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Maria da Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="maria@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_nascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate('/prof/pacientes')}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-brand text-white hover:bg-brand/90"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Paciente'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
