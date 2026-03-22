import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { anamneseSchema, type AnamneseFormValues } from './schema'
import { useToast } from '@/hooks/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, Eraser, Loader2, ClipboardList } from 'lucide-react'

import { PersonalTab } from './tabs/PersonalTab'
import { HealthTab } from './tabs/HealthTab'
import { SystemsTab } from './tabs/SystemsTab'
import { LifestyleTab } from './tabs/LifestyleTab'
import { AestheticsTab } from './tabs/AestheticsTab'

export default function ProfAnamnesePage() {
  const { pacienteId } = useParams<{ pacienteId: string }>()
  const navigate = useNavigate()
  const { profile, user } = useAuth()
  const { toast } = useToast()

  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('pessoal')

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
      pratica_atividade_fisica: false,
    },
  })

  useEffect(() => {
    async function loadPatients() {
      if (!profile?.organization_id) return
      const { data } = await supabase
        .from('pacientes')
        .select('id, nome, peso, altura, imc, circunferencia_cintura, circunferencia_quadril')
        .eq('organization_id', profile.organization_id)
        .order('nome')

      if (data) {
        setPatients(data)
        if (pacienteId) {
          const selected = data.find((p) => p.id === pacienteId)
          if (selected) {
            form.reset({
              ...form.getValues(),
              paciente_id: selected.id,
              peso: selected.peso || undefined,
              altura: selected.altura || undefined,
              imc: selected.imc || undefined,
              circunferencia_cintura: selected.circunferencia_cintura || undefined,
              circunferencia_quadril: selected.circunferencia_quadril || undefined,
            })
          }
        }
      }
    }
    loadPatients()
  }, [profile?.organization_id, pacienteId, form])

  const onSubmit = async (data: AnamneseFormValues) => {
    if (!profile?.organization_id || !user?.id) return
    setIsLoading(true)

    try {
      if (
        data.peso ||
        data.altura ||
        data.imc ||
        data.circunferencia_cintura ||
        data.circunferencia_quadril
      ) {
        const razao =
          data.circunferencia_cintura && data.circunferencia_quadril
            ? Number((data.circunferencia_cintura / data.circunferencia_quadril).toFixed(2))
            : null
        await supabase
          .from('pacientes')
          .update({
            peso: data.peso,
            altura: data.altura,
            imc: data.imc,
            circunferencia_cintura: data.circunferencia_cintura,
            circunferencia_quadril: data.circunferencia_quadril,
            razao_cintura_quadril: razao,
          })
          .eq('id', data.paciente_id)
          .eq('organization_id', profile.organization_id)
      }

      const payload = {
        organization_id: profile.organization_id,
        paciente_id: data.paciente_id,
        profissional_id: user.id,
        queixa_principal: data.queixa_principal || null,
        objetivos_tratamento: data.objetivos_tratamento || null,
        doencas_diagnosticadas: data.doencas_diagnosticadas,
        medicamentos_uso: data.medicamentos_uso ? [data.medicamentos_uso] : [],
        alergias_sensibilidades: data.alergias_sensibilidades,
        historico_familiar: data.historico_familiar,
        cardiovascular: data.cardiovascular,
        gastrointestinal: data.gastrointestinal,
        hepatica: data.hepatica,
        pancreatica: data.pancreatica,
        renal: data.renal,
        pulmonar: data.pulmonar,
        nervosa: data.nervosa,
        ossea_articular: data.ossea_articular,
        endocrina: data.endocrina,
        imunologica: data.imunologica,
        alimentacao_descricao: data.alimentacao_descricao || null,
        consumo_agua_litros: data.consumo_agua_litros || null,
        horas_sono: data.horas_sono || null,
        nivel_estresse: data.nivel_estresse || null,
        pratica_atividade_fisica: data.pratica_atividade_fisica,
        tabagismo: data.tabagismo || null,
        consumo_alcool: data.consumo_alcool || null,
        pele_problemas: data.pele_problemas,
        cabelo_problemas: data.cabelo_problemas,
        unhas_problemas: data.unhas_problemas,
        corporal_problemas: data.corporal_problemas,
        olhos_problemas: data.olhos_problemas,
        observacoes_profissional: data.observacoes_profissional || null,
      }

      const { error } = await supabase.from('anamnese').insert([payload])
      if (error) throw error

      toast({ title: 'Sucesso', description: 'Anamnese registrada com sucesso!' })
      navigate('/prof/dashboard')
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro ao salvar', description: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados preenchidos?')) {
      form.reset()
      toast({ description: 'Formulário limpo.' })
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/prof/dashboard')}
            className="text-brand"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-brand flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-gold" /> Anamnese Integrativa
            </h2>
            <p className="text-muted-foreground text-sm">
              Preencha o formulário detalhado para avaliação inicial.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="flex-1 sm:flex-none text-slate-600"
          >
            <Eraser className="mr-2 h-4 w-4" /> Limpar Formulário
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            className="flex-1 sm:flex-none bg-brand hover:bg-brand/90 text-white shadow-md"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvar Anamnese
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-slate-50/50 p-4 rounded-xl border border-brand/10">
            <FormField
              control={form.control}
              name="paciente_id"
              render={({ field }) => (
                <FormItem className="max-w-md">
                  <FormLabel className="text-brand font-semibold">Paciente Selecionado *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white shadow-sm">
                        <SelectValue placeholder="Busque e selecione o paciente..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2 bg-transparent">
              <TabsTrigger
                value="pessoal"
                className="data-[state=active]:bg-brand data-[state=active]:text-white border shadow-sm py-2"
              >
                I & II. Pessoal & Queixas
              </TabsTrigger>
              <TabsTrigger
                value="historico"
                className="data-[state=active]:bg-brand data-[state=active]:text-white border shadow-sm py-2"
              >
                III. Histórico de Saúde
              </TabsTrigger>
              <TabsTrigger
                value="sistemas"
                className="data-[state=active]:bg-brand data-[state=active]:text-white border shadow-sm py-2"
              >
                IV. Avaliação Sistêmica
              </TabsTrigger>
              <TabsTrigger
                value="habitos"
                className="data-[state=active]:bg-brand data-[state=active]:text-white border shadow-sm py-2"
              >
                V. Hábitos & Estilo
              </TabsTrigger>
              <TabsTrigger
                value="estetica"
                className="data-[state=active]:bg-brand data-[state=active]:text-white border shadow-sm py-2"
              >
                VI & VII. Estética & Obs.
              </TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="pessoal" className="m-0 focus-visible:outline-none">
                <PersonalTab />
              </TabsContent>
              <TabsContent value="historico" className="m-0 focus-visible:outline-none">
                <HealthTab />
              </TabsContent>
              <TabsContent value="sistemas" className="m-0 focus-visible:outline-none">
                <SystemsTab />
              </TabsContent>
              <TabsContent value="habitos" className="m-0 focus-visible:outline-none">
                <LifestyleTab />
              </TabsContent>
              <TabsContent value="estetica" className="m-0 focus-visible:outline-none">
                <AestheticsTab />
              </TabsContent>
            </div>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}
