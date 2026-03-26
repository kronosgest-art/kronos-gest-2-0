import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { anamesiService } from '@/services/anamesiService'
import { Anamnese } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Eraser } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'

export default function AnamnesePage() {
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
          <h2 className="text-2xl font-bold text-[#1E3A8A]">Anamnese Completa</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setData({})}>
            <Eraser className="mr-2 h-4 w-4" /> Limpar
          </Button>
          <Button onClick={handleSave} className="bg-[#B8860B] hover:bg-[#A0750A] text-white">
            <Save className="mr-2 h-4 w-4" /> Salvar
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div>
            <label className="font-semibold text-[#1E3A8A] block mb-2">
              II. Queixa Principal e Expectativas
            </label>
            <Textarea
              value={data.queixa_principal || ''}
              onChange={(e) => setData({ ...data, queixa_principal: e.target.value })}
              placeholder="Descreva a queixa principal..."
            />
          </div>
          <div>
            <label className="font-semibold text-[#1E3A8A] block mb-2">
              III. Histórico de Saúde e Familiar
            </label>
            <Textarea
              value={data.historico_familiar?.join(', ') || ''}
              onChange={(e) => setData({ ...data, historico_familiar: [e.target.value] })}
              placeholder="Doenças, medicamentos, alergias..."
            />
          </div>
          <div>
            <label className="font-semibold text-[#1E3A8A] block mb-2">
              V. Estilo de Vida e Hábitos
            </label>
            <Textarea
              value={data.alimentacao_descricao || ''}
              onChange={(e) => setData({ ...data, alimentacao_descricao: e.target.value })}
              placeholder="Alimentação, sono, atividade física..."
            />
          </div>
          <div>
            <label className="font-semibold text-[#1E3A8A] block mb-2">
              VII. Observações do Profissional
            </label>
            <Textarea
              className="bg-amber-50"
              value={data.observacoes_profissional || ''}
              onChange={(e) => setData({ ...data, observacoes_profissional: e.target.value })}
              placeholder="Notas clínicas..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
