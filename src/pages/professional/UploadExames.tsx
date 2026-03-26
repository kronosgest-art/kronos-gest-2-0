import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Upload, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { examService } from '@/services/examService'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function UploadExames() {
  const { pacienteId } = useParams<{ pacienteId: string }>()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [file, setFile] = useState<File | null>(null)
  const [examType, setExamType] = useState('biorressonancia')
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file || !examType || !profile?.organization_id || !pacienteId) {
      return toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Preencha todos os campos.',
      })
    }

    setLoading(true)

    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = async () => {
        try {
          const base64Str = reader.result?.toString().split(',')[1]
          let interpretation = ''

          if (examType === 'biorressonancia' || examType === 'laboratorial') {
            const functionName =
              examType === 'biorressonancia' ? 'interpret-bioresonance' : 'interpret-laboratorial'
            const payload =
              examType === 'biorressonancia' ? { pdfBase64: base64Str } : { examData: base64Str }

            const { data, error } = await supabase.functions.invoke(functionName, {
              body: payload,
            })

            if (!error && data) {
              interpretation = data.interpretacao || ''
            } else {
              console.error('AI Error:', error)
            }
          }

          await examService.create({
            organization_id: profile.organization_id,
            paciente_id: pacienteId,
            profissional_id: profile.id,
            tipo_exame: examType,
            arquivo_pdf_nome: file.name,
            status_interpretacao: interpretation ? 'Interpretado' : 'Pendente',
            interpretacao_ia: interpretation,
          })

          toast({ title: 'Sucesso', description: 'Exame enviado e processado com sucesso.' })
          navigate(`/professional/patients/${pacienteId}/exams`)
        } catch (err: any) {
          toast({ variant: 'destructive', title: 'Erro', description: err.message })
        } finally {
          setLoading(false)
        }
      }

      reader.onerror = () => {
        toast({ variant: 'destructive', title: 'Erro', description: 'Erro ao ler arquivo' })
        setLoading(false)
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Erro', description: e.message })
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h2 className="text-2xl font-bold text-brand">Upload de Exames</h2>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Novo Exame</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Exame</label>
            <Select onValueChange={setExamType} value={examType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="biorressonancia">Biorressonância</SelectItem>
                <SelectItem value="laboratorial">Laboratorial</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Arquivo (PDF ou Imagem)</label>
            <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <Button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-hover text-white"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {loading ? 'Enviando e Processando IA...' : 'Enviar Arquivo e Interpretar'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
