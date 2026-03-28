import { useState } from 'react'
import { Brain, Save, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import logoUrl from '@/assets/logomarca-kronos-gest-5cdc9.jpeg'

export default function NewPrescription() {
  const [context, setContext] = useState('')
  const [prescription, setPrescription] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleGenerateIA = async () => {
    if (!context.trim()) {
      toast({
        title: 'Atenção',
        description: 'Descreva o quadro clínico ou sintomas do paciente primeiro.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('generate-prescription-suggestion', {
        body: { context },
      })

      if (error) throw error
      if (data?.error) throw new Error(data.message || 'Erro interno da IA')

      setPrescription(data.result)
      toast({ title: 'Sucesso', description: 'A IA gerou a sugestão de conduta terapêutica.' })
    } catch (err: any) {
      toast({
        title: 'Erro de Geração',
        description: err.message || 'Falha ao comunicar com a Edge Function.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-background">
      <style>{`
        @media print {
          body, html { height: auto !important; overflow: visible !important; background: white; }
          nav, aside, header { display: none !important; }
          .print-hide { display: none !important; }
          textarea { border: none !important; resize: none !important; box-shadow: none !important; overflow: visible !important; height: auto !important; font-family: sans-serif; }
        }
      `}</style>

      <div className="flex justify-between items-center mb-8 print-hide">
        <div>
          <h1 className="text-3xl font-bold">Nova Prescrição</h1>
          <p className="text-muted-foreground mt-1">
            Gere condutas integrativas inteligentes para seus pacientes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Imprimir Receita
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" /> Salvar Prescrição
          </Button>
        </div>
      </div>

      <div className="hidden print:flex flex-col items-center justify-center border-b pb-6 mb-8">
        <img src={logoUrl} alt="Logo KronosGest" className="w-28 h-28 object-contain mb-4" />
        <h2 className="text-2xl font-bold uppercase tracking-wider text-center">
          KronosGest Clínica Integrativa
        </h2>
        <p className="text-sm text-gray-600 mt-1">Prescrição e Conduta Terapêutica</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4 print-hide">
          <div className="p-5 border rounded-xl bg-card shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center">
              <Brain className="w-4 h-4 mr-2 text-primary" />
              Assistente de IA
            </h3>
            <label className="text-sm font-medium mb-2 block text-muted-foreground">
              Descreva o quadro, exames e objetivos do paciente:
            </label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Ex: Paciente com fadiga extrema, insônia crônica, candidíase de repetição. Exames mostram disbiose intestinal..."
              className="min-h-[250px] mb-4"
            />
            <Button onClick={handleGenerateIA} disabled={loading} className="w-full">
              {loading ? 'Gerando Sugestão...' : 'Gerar Prescrição com IA'}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-2">
          <label className="font-semibold text-lg print-hide block">Documento de Prescrição</label>
          <div className="bg-card rounded-xl print:bg-white border print:border-none shadow-sm print:shadow-none">
            <Textarea
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="A prescrição gerada pela IA ou digitada por você aparecerá aqui..."
              className="min-h-[600px] print:min-h-0 text-base leading-relaxed p-6 border-none focus-visible:ring-1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
