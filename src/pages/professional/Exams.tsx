import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Upload, Brain, Save, History, FileText, Loader2, CheckCircle2 } from 'lucide-react'
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
  const { pacienteId } = useParams()
  const [extractedText, setExtractedText] = useState('')
  const [interpretation, setInterpretation] = useState('')
  const [isTextModalOpen, setIsTextModalOpen] = useState(false)
  const [loadingExtract, setLoadingExtract] = useState(false)
  const [loadingIA, setLoadingIA] = useState(false)
  const [saving, setSaving] = useState(false)

  const [historyOpen, setHistoryOpen] = useState(false)
  const [historicoExames, setHistoricoExames] = useState<any[]>([])
  const [currentExamId, setCurrentExamId] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (pacienteId && historyOpen) {
      fetchHistorico()
    }
  }, [pacienteId, historyOpen])

  const fetchHistorico = async () => {
    const { data, error } = await supabase
      .from('exames')
      .select('*')
      .eq('paciente_id', pacienteId)
      .order('created_at', { ascending: false })

    if (data) setHistoricoExames(data)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLoadingExtract(true)
      toast({ title: 'Processando', description: 'Extraindo texto do PDF. Por favor, aguarde...' })

      // Simulação aprimorada de extração (em um cenário real, chamaria uma API de OCR)
      setTimeout(() => {
        setExtractedText(
          `=== Exame: ${file.name} ===\n\n- Sistema Digestório: Sobrecarga hepática leve.\n- Metais Pesados: Chumbo e Alumínio em níveis detectáveis.\n- Vitaminas: Deficiência em Vitamina D e B12.\n- Emocional: Estresse elevado e fadiga adrenal primária.\n\n[Texto extraído automaticamente. Revise antes da interpretação.]`,
        )
        setLoadingExtract(false)
        setIsTextModalOpen(true)
        setCurrentExamId(null) // Novo exame
      }, 2000)
    }
  }

  const handleSaveExtractedText = async () => {
    if (!pacienteId || !extractedText) return
    setSaving(true)

    try {
      const payload = {
        paciente_id: pacienteId,
        tipo_exame: 'Exame Analisado',
        dados_extraidos: extractedText,
        status_interpretacao: interpretation ? 'Interpretado' : 'Pendente',
      }

      const req = currentExamId
        ? supabase.from('exames').update(payload).eq('id', currentExamId).select().single()
        : supabase.from('exames').insert([payload]).select().single()

      const { data, error } = await req

      if (error) throw error
      if (data) setCurrentExamId(data.id)

      toast({
        title: 'Salvo com sucesso',
        description: 'O texto base foi salvo no histórico do paciente.',
      })
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleInterpretWithIA = async () => {
    if (!extractedText.trim()) return
    setLoadingIA(true)
    toast({
      title: 'IA em Ação',
      description:
        'A inteligência artificial está analisando os dados. Isso pode levar alguns segundos.',
    })

    try {
      // Usando a Edge Function estabilizada
      const { data, error } = await supabase.functions.invoke('interpret-laboratorial', {
        body: { text: extractedText },
      })

      if (error) throw error
      if (data?.error) throw new Error(data.message || 'Falha na resposta da IA')

      setInterpretation(data.result || 'Interpretação concluída, mas sem texto retornado.')
      setIsTextModalOpen(false) // Fecha o modal após o sucesso para ver o resultado principal
      toast({
        title: 'Análise Concluída',
        description: 'A interpretação sugerida já está disponível na tela principal.',
      })

      // Auto-salva se já tivermos um ID
      if (currentExamId) {
        await supabase
          .from('exames')
          .update({
            interpretacao_ia: data.result,
            status_interpretacao: 'Interpretado',
          })
          .eq('id', currentExamId)
      }
    } catch (err: any) {
      console.error('Erro ao interpretar:', err)
      toast({
        title: 'Erro na IA',
        description: err.message || 'Houve uma falha de conexão. Tente novamente em instantes.',
        variant: 'destructive',
      })
    } finally {
      setLoadingIA(false)
    }
  }

  const handleSaveConduta = async () => {
    if (!pacienteId) return
    setSaving(true)

    try {
      const payload = {
        paciente_id: pacienteId,
        tipo_exame: 'Exame Analisado',
        dados_extraidos: extractedText,
        interpretacao_ia: interpretation,
        status_interpretacao: 'Concluído',
      }

      const req = currentExamId
        ? supabase.from('exames').update(payload).eq('id', currentExamId)
        : supabase.from('exames').insert([payload])

      const { error } = await req
      if (error) throw error

      toast({
        title: 'Conduta Salva',
        description: 'A interpretação final foi salva no prontuário.',
      })
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const openHistoryItem = (exame: any) => {
    setCurrentExamId(exame.id)
    setExtractedText(exame.dados_extraidos || '')
    setInterpretation(exame.interpretacao_ia || '')
    setHistoryOpen(false)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Inteligência Clínica e Exames</h1>
          <p className="text-muted-foreground mt-1">
            Faça upload de resultados para interpretação automática e estruturação de condutas.
          </p>
        </div>
        <Button variant="outline" onClick={() => setHistoryOpen(true)}>
          <History className="w-4 h-4 mr-2" /> Histórico de Exames
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-8 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center text-center bg-card shadow-sm hover:bg-primary/5 transition-colors relative overflow-hidden">
            {loadingExtract && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="font-medium animate-pulse">Extraindo dados do documento...</p>
              </div>
            )}
            <Upload className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Upload de Exame PDF</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Faça upload do laudo laboratorial ou arquivo de biorressonância para iniciar a
              extração automática de texto.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf"
              onChange={handleFileUpload}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              disabled={loadingExtract}
            >
              Selecionar Arquivo PDF
            </Button>
          </div>

          {extractedText && (
            <div className="space-y-3 p-5 border rounded-xl bg-card shadow-sm border-l-4 border-l-primary">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-sm">Dados Extraídos Ativos</h4>
                </div>
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm"
                  onClick={() => setIsTextModalOpen(true)}
                >
                  Revisar e Interpretar &rarr;
                </Button>
              </div>
              <div className="p-3 bg-muted/30 rounded-md text-sm line-clamp-4 text-muted-foreground whitespace-pre-wrap font-mono border">
                {extractedText}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 flex flex-col h-full">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Brain
                className={cn('w-5 h-5', interpretation ? 'text-green-500' : 'text-primary')}
              />
              Interpretação e Conduta Sugerida
            </h3>
            {interpretation && (
              <Button size="sm" onClick={handleSaveConduta} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar Conduta
              </Button>
            )}
          </div>

          <div className="relative flex-1 min-h-[450px]">
            {loadingIA && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 border rounded-md">
                <Brain className="w-12 h-12 text-primary animate-pulse mb-4" />
                <p className="font-medium text-lg text-primary">IA Analisando...</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs text-center">
                  Processando marcadores, cruzando referências funcionais e estruturando sugestões.
                </p>
              </div>
            )}
            <Textarea
              className="w-full h-full min-h-[450px] bg-card p-5 leading-relaxed text-base resize-none focus-visible:ring-primary/50"
              placeholder="A interpretação clínica sugerida pela Inteligência Artificial aparecerá aqui. Você pode editar este texto livremente antes de salvar no prontuário..."
              value={interpretation}
              onChange={(e) => setInterpretation(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Dialog open={isTextModalOpen} onOpenChange={setIsTextModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Revisão do Texto Extraído
            </DialogTitle>
            <DialogDescription>
              Revise o texto bruto extraído do PDF. Você pode corrigir possíveis erros de leitura
              antes de enviar para a Inteligência Artificial analisar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="min-h-[350px] font-mono text-sm leading-relaxed p-4 bg-muted/20"
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between w-full mt-4">
            <Button
              variant="outline"
              onClick={handleSaveExtractedText}
              disabled={saving || loadingIA}
              className="w-full sm:w-auto"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar Texto Base
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="ghost"
                onClick={() => setIsTextModalOpen(false)}
                disabled={loadingIA}
              >
                Fechar
              </Button>
              <Button
                onClick={handleInterpretWithIA}
                disabled={loadingIA || !extractedText.trim()}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loadingIA ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4 mr-2" />
                )}
                {loadingIA ? 'Processando...' : 'Gerar Interpretação com IA'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Histórico de Exames do Paciente</DialogTitle>
            <DialogDescription>
              Acesse as extrações e interpretações anteriores armazenadas no banco de dados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 flex-1 overflow-y-auto pr-2">
            {historicoExames.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                Nenhum exame analisado encontrado no histórico deste paciente.
              </div>
            ) : (
              historicoExames.map((exame) => (
                <div
                  key={exame.id}
                  className="p-4 border rounded-lg bg-card flex justify-between items-center hover:border-primary/40 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-primary">
                        {exame.tipo_exame || 'Exame de Rotina'}
                      </h4>
                      {exame.interpretacao_ia && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Data do Registro: {new Date(exame.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    {exame.dados_extraidos && (
                      <p className="text-xs text-muted-foreground/70 mt-2 line-clamp-1 border-l-2 pl-2">
                        {exame.dados_extraidos.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="ml-4"
                    onClick={() => openHistoryItem(exame)}
                  >
                    Carregar Dados
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
