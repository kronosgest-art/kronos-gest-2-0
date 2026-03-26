import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { examService } from '@/services/examService'
import { useAuth } from '@/hooks/use-auth'

export default function UploadExames() {
  const { pacienteId } = useParams<{ pacienteId: string }>()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [examType, setExamType] = useState('')

  const handleUpload = async () => {
    if (!file || !examType || !profile?.organization_id || !pacienteId) {
      return toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Preencha todos os campos.',
      })
    }

    try {
      await examService.create({
        organization_id: profile.organization_id,
        paciente_id: pacienteId,
        profissional_id: profile.id,
        tipo_exame: examType,
        arquivo_pdf_nome: file.name,
        status_interpretacao: 'Pendente',
      })
      toast({ title: 'Sucesso', description: 'Exame enviado com sucesso.' })
      navigate(`/professional/patients/${pacienteId}/exams`)
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Erro', description: e.message })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h2 className="text-2xl font-bold text-[#1E3A8A]">Upload de Exames</h2>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Novo Exame</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Exame</label>
            <Input
              placeholder="Ex: Hemograma, Bioressonância..."
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Arquivo (PDF ou Imagem)</label>
            <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <Button
            onClick={handleUpload}
            className="w-full bg-[#B8860B] hover:bg-[#A0750A] text-white"
          >
            <Upload className="mr-2 h-4 w-4" /> Enviar Arquivo
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
