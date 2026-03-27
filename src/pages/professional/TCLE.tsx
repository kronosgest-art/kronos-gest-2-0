import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Save, Printer, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export default function TCLE() {
  const { pacienteId } = useParams<{ pacienteId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { profile } = useAuth()

  const [template, setTemplate] = useState(
    `TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO (TCLE)\n\nEu, abaixo assinado, concordo em participar do tratamento...\n\nData: ___/___/_____\nAssinatura: ___________________________`,
  )
  const [docId, setDocId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (pacienteId) {
      loadTCLE()
    }
  }, [pacienteId])

  const loadTCLE = async () => {
    try {
      const { data, error } = await supabase
        .from('tcle_documents')
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (data) {
        setTemplate(data.conteudo)
        setDocId(data.id)
      }
    } catch (err) {
      console.error('Nenhum TCLE anterior encontrado')
    }
  }

  const handleSave = async () => {
    if (!profile?.organization_id || !pacienteId) return
    setIsLoading(true)
    try {
      if (docId) {
        const { error } = await supabase
          .from('tcle_documents')
          .update({ conteudo: template, updated_at: new Date().toISOString() })
          .eq('id', docId)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('tcle_documents')
          .insert({
            paciente_id: pacienteId,
            organization_id: profile.organization_id,
            profissional_id: profile.id,
            conteudo: template,
          })
          .select()
          .single()
        if (error) throw error
        if (data) setDocId(data.id)
      }
      toast({ title: 'Sucesso', description: 'Template de TCLE salvo com sucesso.' })
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro ao salvar', description: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([template], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `TCLE_${pacienteId}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast({ title: 'Download iniciado', description: 'O documento foi exportado com sucesso.' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <h2 className="text-2xl font-bold text-[#1E3A8A]">TCLE</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-[#1E3A8A]" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
          <Button variant="outline" className="text-green-700" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Exportar / Download
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#B8860B] hover:bg-[#A0750A] text-white"
          >
            <Save className="mr-2 h-4 w-4" /> {isLoading ? 'Salvando...' : 'Salvar Template'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#1E3A8A]">Documento - TCLE</CardTitle>
          <CardDescription>
            Edite e salve o termo de consentimento específico para este paciente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            className="min-h-[400px] font-mono text-sm"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
