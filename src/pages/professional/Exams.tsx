import { useState, useRef } from 'react'
import { Upload, Brain, Save, History, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

export default function Exams() {
  const [extractedText, setExtractedText] = useState('')
  const [interpretation, setInterpretation] = useState('')
  const [isTextModalOpen, setIsTextModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      toast({ title: 'Processando', description: 'Extraindo texto do PDF...' })

      // Simulating PDF extraction to text for demonstration
      setTimeout(() => {
        setExtractedText(
          '=== Exame de Biorressonância ===\n- Sistema Digestório: Sobrecarga hepática leve.\n- Metais Pesados: Chumbo e Alumínio em níveis detectáveis.\n- Vitaminas: Deficiência em Vitamina D e B12.\n- Emocional: Estresse elevado e fadiga adrenal primária.',
        )
        setIsTextModalOpen(true)
      }, 1500)
    }
  }

  const handleSaveExtractedText = () => {
    toast({ title: 'Salvo', description: 'Texto extraído foi salvo no histórico do paciente.' })
  }

  const handleInterpretWithIA = async () => {
    if (!extractedText.trim()) return
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('interpret-bioresonance', {
        body: { text: extractedText },
      })

      if (error) throw error
      if (data?.error) throw new Error(data.message || 'Erro interno da IA')

      setInterpretation(data.result)
      setIsTextModalOpen(false)
      toast({ title: 'Sucesso', description: 'A IA interpretou o exame.' })
    } catch (err: any) {
      toast({
        title: 'Erro de Interpretação',
        description: err.message || 'Falha na comunicação com a Edge Function.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Exames</h1>
          <p className="text-muted-foreground mt-1">
            Análise laboratorial e biorressonância com Inteligência Artificial
          </p>
        </div>
        <Button variant="outline" onClick={() => setHistoryOpen(true)}>
          <History className="w-4 h-4 mr-2" /> Histórico de Exames
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-8 border-2 border-dashed border-primary/20 rounded-xl flex flex-col items-center justify-center text-center bg-card shadow-sm hover:bg-muted/30 transition-colors">
            <Upload className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Upload de Exame PDF</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Faça upload do laudo laboratorial ou arquivo de biorressonância para iniciar a
              extração automática.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf"
              onChange={handleFileUpload}
            />
            <Button onClick={() => fileInputRef.current?.click()} size="lg">
              Selecionar Arquivo PDF
            </Button>
          </div>

          {extractedText && !isTextModalOpen && (
            <div className="space-y-3 p-5 border rounded-xl bg-card shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-sm">Texto Extraído Disponível</h4>
                </div>
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm"
                  onClick={() => setIsTextModalOpen(true)}
                >
                  Abrir modal
                </Button>
              </div>
              <div className="p-3 bg-muted/50 rounded-md text-sm line-clamp-3 text-muted-foreground whitespace-pre-wrap font-mono border">
                {extractedText}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 flex flex-col">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Interpretação e Conduta (IA)
            </h3>
            {interpretation && (
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" /> Salvar Conduta
              </Button>
            )}
          </div>
          <Textarea
            className="flex-1 min-h-[450px] bg-card p-4 leading-relaxed"
            placeholder="A interpretação clínica sugerida pela IA aparecerá aqui..."
            value={interpretation}
            onChange={(e) => setInterpretation(e.target.value)}
          />
        </div>
      </div>

      <Dialog open={isTextModalOpen} onOpenChange={setIsTextModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Revisão do Texto Extraído</DialogTitle>
            <DialogDescription>
              Revise e edite o texto extraído do PDF antes de solicitar a interpretação pela IA.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="min-h-[350px] font-mono text-sm leading-relaxed"
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between w-full">
            <Button
              variant="outline"
              onClick={handleSaveExtractedText}
              className="w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" /> Salvar Texto Extraído
            </Button>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="ghost" onClick={() => setIsTextModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleInterpretWithIA}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <Brain className="w-4 h-4 mr-2" />
                {loading ? 'Analisando...' : 'Interpretar com IA'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Histórico de Exames do Paciente</DialogTitle>
            <DialogDescription>
              Acesse exames, textos extraídos e interpretações anteriores.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="p-4 border rounded-lg bg-card flex justify-between items-center hover:shadow-sm transition-shadow">
              <div>
                <h4 className="font-semibold text-primary">Biorressonância Completa</h4>
                <p className="text-sm text-muted-foreground mt-1">Realizado em 24/03/2026</p>
              </div>
              <Button variant="outline" size="sm">
                Visualizar
              </Button>
            </div>
            <div className="p-4 border rounded-lg bg-card flex justify-between items-center hover:shadow-sm transition-shadow">
              <div>
                <h4 className="font-semibold text-primary">Hemograma e Perfil Lipídico</h4>
                <p className="text-sm text-muted-foreground mt-1">Realizado em 10/01/2026</p>
              </div>
              <Button variant="outline" size="sm">
                Visualizar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
