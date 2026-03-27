import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { anamesiService } from '@/services/anamesiService'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Eraser, Printer } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { anamneseSchema, AnamneseFormValues } from './anamnese/schema'
import { Form } from '@/components/ui/form'
import { PersonalTab } from './anamnese/tabs/PersonalTab'
import { HealthTab } from './anamnese/tabs/HealthTab'
import { SystemsTab } from './anamnese/tabs/SystemsTab'
import { LifestyleTab } from './anamnese/tabs/LifestyleTab'
import { AestheticsTab } from './anamnese/tabs/AestheticsTab'

export default function AnamnesePage() {
  const { pacienteId } = useParams<{ pacienteId: string }>()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [anamneseId, setAnamneseId] = useState<string | null>(null)

  const form = useForm<AnamneseFormValues>({
    resolver: zodResolver(anamneseSchema),
    defaultValues: {
      paciente_id: pacienteId || '',
      doencas_diagnosticadas: [],
      alergias_sensibilidades: [],
      historico_familiar: [],
      cardiovascular: [],
      gastrointestinal: [],
      hepatica: [],
      pancreatica: [],
      renal: [],
      pulmonar: [],
      nervosa: [],
      ossea_articular: [],
      endocrina: [],
      imunologica: [],
      pele_problemas: [],
      cabelo_problemas: [],
      unhas_problemas: [],
      corporal_problemas: [],
      olhos_problemas: [],
    },
  })

  useEffect(() => {
    if (pacienteId) {
      anamesiService.getByPatient(pacienteId).then((list) => {
        if (list.length > 0) {
          setAnamneseId(list[0].id || null)
          form.reset({ ...list[0], paciente_id: pacienteId } as any)
        }
      })
    }
  }, [pacienteId, form])

  const onSubmit = async (data: AnamneseFormValues) => {
    if (!profile?.organization_id || !pacienteId) return
    try {
      await anamesiService.create({
        ...data,
        id: anamneseId || undefined,
        organization_id: profile.organization_id,
        paciente_id: pacienteId,
        profissional_id: profile.id,
      })
      toast({ title: 'Sucesso', description: 'Anamnese salva com sucesso.' })
      navigate(`/professional/patients/${pacienteId}`)
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Erro', description: e.message })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(`/professional/patients/${pacienteId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <h2 className="text-2xl font-bold text-brand">Anamnese Completa</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
          <Button variant="outline" onClick={() => form.reset()}>
            <Eraser className="mr-2 h-4 w-4" /> Limpar
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="bg-gold hover:bg-gold-hover text-white"
          >
            <Save className="mr-2 h-4 w-4" /> Salvar
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-slate-100 h-auto p-1">
              <TabsTrigger value="personal" className="py-2">
                Dados Pessoais
              </TabsTrigger>
              <TabsTrigger value="health" className="py-2">
                Saúde/Familiar
              </TabsTrigger>
              <TabsTrigger value="systems" className="py-2">
                Sistemas
              </TabsTrigger>
              <TabsTrigger value="lifestyle" className="py-2">
                Estilo de Vida
              </TabsTrigger>
              <TabsTrigger value="aesthetics" className="py-2">
                Estética
              </TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="personal">
                <PersonalTab />
              </TabsContent>
              <TabsContent value="health">
                <HealthTab />
              </TabsContent>
              <TabsContent value="systems">
                <SystemsTab />
              </TabsContent>
              <TabsContent value="lifestyle">
                <LifestyleTab />
              </TabsContent>
              <TabsContent value="aesthetics">
                <AestheticsTab />
              </TabsContent>
            </div>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}
