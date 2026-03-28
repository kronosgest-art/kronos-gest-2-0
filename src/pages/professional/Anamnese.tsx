import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Printer, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import logoUrl from '@/assets/logomarca-kronos-gest-5cdc9.jpeg'
import { useForm, FormProvider } from 'react-hook-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import { PersonalTab } from './anamnese/tabs/PersonalTab'
import { HealthTab } from './anamnese/tabs/HealthTab'
import { SystemsTab } from './anamnese/tabs/SystemsTab'
import { LifestyleTab } from './anamnese/tabs/LifestyleTab'
import { AestheticsTab } from './anamnese/tabs/AestheticsTab'

export default function Anamnese() {
  const { pacienteId } = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [anamneseId, setAnamneseId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('personal')

  const methods = useForm<any>({
    defaultValues: {
      altura: '',
      peso: '',
      queixa_principal: '',
      objetivos_tratamento: '',
      circunferencia_cintura: '',
      circunferencia_quadril: '',
      doencas_diagnosticadas: [],
      medicamentos_uso: '',
      alergias_sensibilidades: [],
      historico_familiar: [],
      gastrointestinal: [],
      hepatica: [],
      pancreatica: [],
      endocrina: [],
      nervosa: [],
      imunologica: [],
      cardiovascular: [],
      renal: [],
      pulmonar: [],
      ossea_articular: [],
      alimentacao_descricao: '',
      consumo_agua_litros: '',
      horas_sono: '',
      nivel_estresse: '',
      tabagismo: '',
      consumo_alcool: '',
      pratica_atividade_fisica: false,
      pele_problemas: [],
      cabelo_problemas: [],
      unhas_problemas: [],
      corporal_problemas: [],
      olhos_problemas: [],
      observacoes_profissional: '',
    },
  })

  useEffect(() => {
    async function fetchAnamnese() {
      if (!pacienteId) return

      const { data, error } = await supabase
        .from('anamnese')
        .select('*')
        .eq('paciente_id', pacienteId)
        .maybeSingle()

      if (data) {
        setAnamneseId(data.id)
        methods.reset(data)
      }
    }
    fetchAnamnese()
  }, [pacienteId, methods])

  const onSubmit = async (data: any) => {
    if (!pacienteId) {
      toast({ title: 'Erro', description: 'Paciente não identificado.', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...data,
        paciente_id: pacienteId,
        altura: data.altura ? parseFloat(data.altura) : null,
        peso: data.peso ? parseFloat(data.peso) : null,
        circunferencia_cintura: data.circunferencia_cintura
          ? parseFloat(data.circunferencia_cintura)
          : null,
        circunferencia_quadril: data.circunferencia_quadril
          ? parseFloat(data.circunferencia_quadril)
          : null,
        consumo_agua_litros: data.consumo_agua_litros ? parseFloat(data.consumo_agua_litros) : null,
        horas_sono: data.horas_sono ? parseFloat(data.horas_sono) : null,
      }

      if (anamneseId) {
        payload.id = anamneseId
      }

      // Adicionando explicitamente o upsert com conflito na chave primária ou criação de novo
      const { error, data: savedData } = await supabase
        .from('anamnese')
        .upsert(payload)
        .select()
        .single()

      if (error) throw error

      if (savedData) {
        setAnamneseId(savedData.id)
      }

      toast({ title: 'Sucesso', description: 'Dados da anamnese salvos com segurança!' })
    } catch (error: any) {
      console.error('Erro ao salvar anamnese:', error)
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-background print-container">
      <style>{`
        @media print {
          body, html { height: auto !important; overflow: visible !important; background: white; }
          nav, aside, header { display: none !important; }
          .print-hide { display: none !important; }
          .print-block { display: block !important; opacity: 1 !important; visibility: visible !important; position: relative !important; margin-bottom: 2rem !important; }
          .print-container { padding: 0 !important; margin: 0 !important; box-shadow: none !important; max-width: 100% !important; border: none !important; }
          textarea { resize: none !important; overflow: visible !important; height: auto !important; border: 1px solid #e2e8f0 !important; padding: 0.5rem !important; min-height: fit-content !important; break-inside: avoid; }
          input { border: 1px solid #e2e8f0 !important; box-shadow: none !important; }
          .bg-white, .bg-slate-50, .bg-amber-50 { background-color: transparent !important; border: none !important; box-shadow: none !important; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
          h3 { break-after: avoid; }
        }
      `}</style>

      <div className="flex justify-between items-center mb-6 print-hide">
        <h1 className="text-3xl font-bold">Anamnese Completa</h1>
        <div className="space-x-2 flex">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
          <Button onClick={methods.handleSubmit(onSubmit)} disabled={loading}>
            <Save className="mr-2 h-4 w-4" /> {loading ? 'Salvando...' : 'Salvar Anamnese'}
          </Button>
        </div>
      </div>

      <div className="hidden print:flex flex-col items-center justify-center border-b pb-6 mb-8">
        <img src={logoUrl} alt="KronosGest Logo" className="w-24 h-24 object-contain mb-4" />
        <h2 className="text-2xl font-bold uppercase tracking-wider text-center">
          KronosGest Clínica Integrativa
        </h2>
        <p className="text-sm text-gray-600 mt-1">Ficha de Anamnese Integrativa</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8 print:space-y-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 print-hide mb-6 h-auto gap-2 bg-transparent">
              <TabsTrigger
                value="personal"
                className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm border"
              >
                Pessoais
              </TabsTrigger>
              <TabsTrigger
                value="health"
                className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm border"
              >
                Saúde
              </TabsTrigger>
              <TabsTrigger
                value="systems"
                className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm border"
              >
                Sistemas
              </TabsTrigger>
              <TabsTrigger
                value="lifestyle"
                className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm border"
              >
                Hábitos
              </TabsTrigger>
              <TabsTrigger
                value="aesthetics"
                className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm border"
              >
                Estética
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="personal"
              forceMount
              className={cn('mt-4 print-block', activeTab !== 'personal' && 'hidden')}
            >
              <PersonalTab />
            </TabsContent>

            <TabsContent
              value="health"
              forceMount
              className={cn('mt-4 print-block', activeTab !== 'health' && 'hidden')}
            >
              <HealthTab />
            </TabsContent>

            <TabsContent
              value="systems"
              forceMount
              className={cn('mt-4 print-block', activeTab !== 'systems' && 'hidden')}
            >
              <SystemsTab />
            </TabsContent>

            <TabsContent
              value="lifestyle"
              forceMount
              className={cn('mt-4 print-block', activeTab !== 'lifestyle' && 'hidden')}
            >
              <LifestyleTab />
            </TabsContent>

            <TabsContent
              value="aesthetics"
              forceMount
              className={cn('mt-4 print-block', activeTab !== 'aesthetics' && 'hidden')}
            >
              <AestheticsTab />
            </TabsContent>
          </Tabs>
        </form>
      </FormProvider>
    </div>
  )
}
