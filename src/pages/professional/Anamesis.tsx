import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { anamesiService } from '@/services/anamesiService'
import { Anamnese } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Eraser } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Anamesis() {
  const { pacienteId } = useParams<{ pacienteId: string }>()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [data, setData] = useState<Partial<Anamnese>>({})

  useEffect(() => {
    if (pacienteId) {
      anamesiService.getByPatient(pacienteId).then((list) => {
        if (list.length > 0) setData(list[0])
      })
    }
  }, [pacienteId])

  const handleSave = async () => {
    if (!profile?.organization_id || !pacienteId) return
    try {
      await anamesiService.create({
        ...data,
        organization_id: profile.organization_id,
        paciente_id: pacienteId,
        profissional_id: profile.id,
      })
      toast({ title: 'Sucesso', description: 'Nova versão da anamnese salva com sucesso.' })
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
          <Button variant="outline" onClick={() => setData({})}>
            <Eraser className="mr-2 h-4 w-4" /> Limpar
          </Button>
          <Button onClick={handleSave} className="bg-brand hover:bg-brand/90 text-white">
            <Save className="mr-2 h-4 w-4" /> Salvar
          </Button>
        </div>
      </div>

      <div className="space-y-6 max-w-4xl bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <label className="font-semibold text-brand block mb-2">
            II. Queixa Principal e Expectativas
          </label>
          <Textarea
            className="min-h-[100px]"
            value={data.queixa_principal || ''}
            onChange={(e) => setData({ ...data, queixa_principal: e.target.value })}
            placeholder="Descreva a queixa principal..."
          />
        </div>
        <div>
          <label className="font-semibold text-brand block mb-2">
            V. Estilo de Vida e Alimentação
          </label>
          <Textarea
            className="min-h-[100px]"
            value={data.alimentacao_descricao || ''}
            onChange={(e) => setData({ ...data, alimentacao_descricao: e.target.value })}
            placeholder="Como é a rotina e alimentação..."
          />
        </div>
        <div>
          <label className="font-semibold text-brand block mb-2">
            VII. Observações do Profissional
          </label>
          <Textarea
            className="min-h-[100px] bg-amber-50 border-amber-200"
            value={data.observacoes_profissional || ''}
            onChange={(e) => setData({ ...data, observacoes_profissional: e.target.value })}
            placeholder="Notas clínicas..."
          />
        </div>
      </div>
    </div>
  )
}
