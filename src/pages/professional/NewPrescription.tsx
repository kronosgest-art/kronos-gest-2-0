import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { prescriptionService } from '@/services/prescriptionService'
import { examService } from '@/services/examService'
import { anamesiService } from '@/services/anamesiService'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Sparkles, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'

export default function NewPrescription() {
  const { pacienteId } = useParams<{ pacienteId: string }>()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState<any>(null)
  const [observacoes, setObservacoes] = useState('')
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    generateSuggestion()
  }, [])

  const generateSuggestion = async () => {
    if (!pacienteId) return
    setLoading(true)
    try {
      const { data: patient } = await supabase
        .from('pacientes')
        .select('*')
        .eq('id', pacienteId)
        .single()
      const anamneses = await anamesiService.getByPatient(pacienteId)
      const exames = await examService.getByPatient(pacienteId)

      const anamnese = anamneses[0] || {}
      const biofisico = exames.find((e) => e.tipo_exame === 'biorressonancia') || {}
      const bioquimico = exames.find((e) => e.tipo_exame === 'laboratorial') || {}

      const { data, error } = await supabase.functions.invoke('generate-prescription-suggestion', {
        body: {
          patientData: patient,
          anamnese,
          exameBiofisico: biofisico,
          exameBioquimico: bioquimico,
        },
      })

      if (error) throw error

      setSuggestion(data.suggestion)
      setObservacoes(data.suggestion.observacoes || '')
      setItems(data.suggestion.itens_prescricao || [])
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Erro ao gerar IA', description: e.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!profile?.organization_id || !pacienteId) return
    setLoading(true)
    try {
      const { data: pdfData, error: pdfError } = await supabase.functions.invoke('generate-pdf', {
        body: { observacoes, items },
      })

      if (pdfError) throw pdfError

      await prescriptionService.create({
        organization_id: profile.organization_id,
        paciente_id: pacienteId,
        profissional_id: profile.id,
        tipo_prescricao: 'Suplementação',
        observacoes: observacoes,
        itens_prescricao: items,
        data_prescricao: new Date().toISOString().split('T')[0],
        status: 'Finalizada',
        gerado_por_ia: true,
        pdf_url: pdfData?.url,
      })

      toast({ title: 'Sucesso', description: 'Prescrição salva com sucesso.' })
      navigate(`/professional/patients/${pacienteId}/prescriptions`)
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Erro', description: e.message })
    } finally {
      setLoading(false)
    }
  }

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const addItem = () => {
    setItems([
      ...items,
      { supplement: '', dosage: '', frequency: '', duration: '', justification: '' },
    ])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/professional/patients/${pacienteId}/prescriptions`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <h2 className="text-2xl font-bold text-brand">Nova Prescrição com IA</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateSuggestion} variant="outline" disabled={loading}>
            <Sparkles className="mr-2 h-4 w-4 text-gold" /> {loading ? 'Gerando...' : 'Regerar IA'}
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gold hover:bg-gold-hover text-white"
            disabled={loading || !suggestion}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvar e Gerar PDF
          </Button>
        </div>
      </div>

      {loading && !suggestion && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="text-muted-foreground">
              Analisando exames e anamnese para gerar sugestão inteligente...
            </p>
          </CardContent>
        </Card>
      )}

      {suggestion && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Observações Clínicas (IA)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[100px]"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Itens da Prescrição</CardTitle>
              <Button size="sm" variant="outline" onClick={addItem}>
                Adicionar Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-md relative bg-slate-50"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-red-500 h-8 w-8 p-0"
                    onClick={() => removeItem(i)}
                  >
                    ×
                  </Button>

                  <div className="md:col-span-3 space-y-1">
                    <label className="text-xs font-medium">Suplemento/Ativo</label>
                    <Input
                      value={item.supplement}
                      onChange={(e) => updateItem(i, 'supplement', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-medium">Dosagem</label>
                    <Input
                      value={item.dosage}
                      onChange={(e) => updateItem(i, 'dosage', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-medium">Frequência</label>
                    <Input
                      value={item.frequency}
                      onChange={(e) => updateItem(i, 'frequency', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-medium">Duração</label>
                    <Input
                      value={item.duration}
                      onChange={(e) => updateItem(i, 'duration', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-3 space-y-1">
                    <label className="text-xs font-medium">Justificativa (Opcional)</label>
                    <Input
                      value={item.justification}
                      onChange={(e) => updateItem(i, 'justification', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-center p-4 text-muted-foreground">
                  Nenhum item na prescrição.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
