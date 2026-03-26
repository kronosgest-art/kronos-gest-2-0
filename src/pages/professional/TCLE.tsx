import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Printer } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function TCLE() {
  const { pacienteId } = useParams<{ pacienteId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [template, setTemplate] = useState(
    `TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO (TCLE)\n\nEu, abaixo assinado, concordo em participar do tratamento...\n\nData: ___/___/_____\nAssinatura: ___________________________`,
  )

  const handleSave = () => {
    toast({ title: 'Sucesso', description: 'Template de TCLE salvo com sucesso.' })
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
          <Button onClick={handleSave} className="bg-[#B8860B] hover:bg-[#A0750A] text-white">
            <Save className="mr-2 h-4 w-4" /> Salvar Template
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#1E3A8A]">Template Editável - TCLE</CardTitle>
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
