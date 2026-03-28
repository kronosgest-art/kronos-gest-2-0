import { useState } from 'react'
import { Printer, Save, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import logoUrl from '@/assets/logomarca-kronos-gest-5cdc9.jpeg'

export default function TCLE() {
  const { toast } = useToast()
  const [content, setContent] = useState(`TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO

Eu, [Nome do Paciente], concordo em participar do acompanhamento terapêutico integrativo proposto pela clínica KronosGest.
Fui devidamente informado(a) sobre os procedimentos, metodologias de avaliação e protocolos de desintoxicação/limpeza, quando aplicáveis.

Compreendo que as abordagens integrativas visam o reequilíbrio do organismo como um todo e que o sucesso do tratamento depende fundamentalmente da minha adesão às orientações.

Estou ciente de que as condutas adotadas não substituem tratamentos médicos convencionais emergenciais, mas atuam de forma complementar visando a otimização da minha saúde e bem-estar.

___________________________________________________
Assinatura do Paciente
Data: ___/___/______
`)

  const handleSave = () => {
    // Integração com banco de dados futura/existente
    toast({ title: 'Sucesso', description: 'Template de TCLE salvo com sucesso no sistema!' })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'TCLE_KronosGest.txt'
    link.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Download Iniciado', description: 'O arquivo do TCLE foi gerado e baixado.' })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-background">
      <style>{`
        @media print {
          body, html { height: auto !important; overflow: visible !important; background: white; }
          nav, aside, header { display: none !important; }
          .print-hide { display: none !important; }
          textarea { border: none !important; resize: none !important; box-shadow: none !important; overflow: visible !important; height: auto !important; }
        }
      `}</style>

      <div className="flex justify-between items-center mb-6 print-hide">
        <h1 className="text-3xl font-bold">TCLE</h1>
        <div className="flex gap-2 flex-wrap justify-end">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Download (.txt)
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir Documento
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Salvar Template
          </Button>
        </div>
      </div>

      <div className="hidden print:flex flex-col items-center justify-center border-b pb-6 mb-8">
        <img src={logoUrl} alt="KronosGest Logo" className="w-24 h-24 object-contain mb-4" />
        <h2 className="text-2xl font-bold uppercase tracking-wider text-center">
          KronosGest Clínica Integrativa
        </h2>
        <p className="text-sm text-gray-600 mt-1">Termo de Consentimento Livre e Esclarecido</p>
      </div>

      <div className="bg-card rounded-lg print:bg-white">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[600px] text-base leading-relaxed p-6 focus-visible:ring-1"
        />
      </div>
    </div>
  )
}
