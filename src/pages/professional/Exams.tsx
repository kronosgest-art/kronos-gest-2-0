import { useEffect, useState, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { examService } from '@/services/examService'
import { supabase } from '@/lib/supabase/client'
import { Exam } from '@/types'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  FileText,
  Upload,
  Trash2,
  Sparkles,
  AlertCircle,
  Loader2,
  Save,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import * as pdfjsLib from 'pdfjs-dist'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'

// Configurar worker ANTES de qualquer operação
const workerSrc = `https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.mjs`
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

async function extractPdfText(file: File): Promise<string> {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('PDF muito grande. Máximo 5MB')
  }

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map((item: any) => item.str).join(' ') + '\n'
  }

  if (!text.trim()) {
    throw new Error('PDF é uma imagem. Transcreva manualmente')
  }

  return text
}

interface ComparisonItem {
  exame: string
  valor_paciente: string
  valor_referencia: string
  status: string
}

interface SugestaoReceita {
  item: string
  dosagem_posologia: string
  justificativa: string
}

interface InterpretationResult {
  tabela_comparacao: ComparisonItem[]
  interpretacao_integrativa: string
  recomendacoes_terapeuticas: string[]
  sugestao_receita?: SugestaoReceita[]
  exame_id?: string
}

export default function Exams() {
  const { pacienteId } = useParams<{ pacienteId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [exams, setExams] = useState<Exam[]>([])

  const [isDragging, setIsDragging] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [isInterpreting, setIsInterpreting] = useState(false)
  const [interpretationResult, setInterpretationResult] = useState<InterpretationResult | null>(
    null,
  )
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [tipoExame, setTipoExame] = useState<string>('laboratorial')

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (pacienteId) examService.getByPatient(pacienteId).then(setExams)
  }, [pacienteId])

  const previousExamWithSuggestion = useMemo(() => {
    if (!interpretationResult) return null
    const currentExamId = interpretationResult.exame_id
    return exams.find(
      (e) =>
        e.id !== currentExamId &&
        ((e as any).sugestao_receita ||
          (e.interpretacao_ia && e.interpretacao_ia.includes('sugestao_receita'))),
    )
  }, [exams, interpretationResult])

  const parseOldSuggestion = (exam: any) => {
    if (exam.sugestao_receita) return exam.sugestao_receita
    if (exam.interpretacao_ia) {
      try {
        const parsed = JSON.parse(exam.interpretacao_ia)
        return parsed.sugestao_receita || []
      } catch (e) {
        return []
      }
    }
    return []
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    setErrorMsg(null)
    setInterpretationResult(null)

    if (file.type !== 'application/pdf') {
      setErrorMsg('Por favor, envie apenas arquivos no formato PDF.')
      return
    }

    setIsExtracting(true)
    try {
      const extractedText = await extractPdfText(file)
      setExtractedText(extractedText)
      toast({
        title: 'Sucesso',
        description: 'Texto extraído do PDF com sucesso.',
      })
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao extrair texto do PDF.')
    } finally {
      setIsExtracting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleInterpret = async () => {
    if (!extractedText.trim()) {
      setErrorMsg('Os dados do exame estão vazios.')
      return
    }

    setIsInterpreting(true)
    setErrorMsg(null)

    try {
      const { data, error } = await supabase.functions.invoke('interpret-laboratorial', {
        body: { examData: extractedText, pacienteId, tipoExame },
      })

      if (error) throw error

      if (data?.error) {
        throw new Error(data.message || 'Erro na interpretação da IA.')
      }

      setInterpretationResult(data)
      toast({
        title: '✅ Exame salvo com sucesso no prontuário do paciente',
        description: 'Exame interpretado e salvo com sucesso.',
      })

      if (pacienteId) {
        examService.getByPatient(pacienteId).then(setExams)
      }
    } catch (err: any) {
      const message = err.message || err.details || 'Erro desconhecido ao interpretar exame.'
      setErrorMsg(message)
      toast({
        variant: 'destructive',
        title: 'Erro na interpretação',
        description: message,
      })
    } finally {
      setIsInterpreting(false)
    }
  }

  const scrollToHistory = () => {
    document.getElementById('historico-table')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSaveTextOnly = async () => {
    if (!extractedText.trim()) return
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { data: profile } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', user?.id)
        .single()
      if (!profile?.organization_id) return

      await examService.create({
        paciente_id: pacienteId,
        profissional_id: user?.id,
        organization_id: profile.organization_id,
        tipo_exame: tipoExame,
        data_exame: new Date().toISOString(),
        dados_extraidos: extractedText,
        status_interpretacao: 'Salvo Manualmente',
      })
      toast({
        title: 'Sucesso',
        description: 'Texto do exame salvo no histórico.',
      })
      if (pacienteId) {
        examService.getByPatient(pacienteId).then(setExams)
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao salvar texto do exame.',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(`/professional/patients/${pacienteId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <h2 className="text-2xl font-bold text-brand">Exames do Paciente</h2>
        </div>
        <Button
          onClick={() => navigate(`/professional/patients/${pacienteId}/upload-exames`)}
          className="bg-gold hover:bg-gold-hover text-white"
        >
          <Upload className="mr-2 h-4 w-4" /> Enviar PDF Manuais
        </Button>
      </div>

      {errorMsg && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-brand flex items-center gap-2">
              <FileText className="h-5 w-5 text-gold" />
              Upload e Extração
            </CardTitle>
            <CardDescription>
              Arraste e solte o PDF do exame laboratorial para extrair os dados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={cn(
                'border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors',
                isDragging ? 'border-gold bg-gold/10' : 'border-gray-300 hover:border-brand/50',
                isExtracting && 'opacity-50 pointer-events-none',
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="application/pdf"
                onChange={onFileSelect}
              />
              {isExtracting ? (
                <>
                  <Loader2 className="h-10 w-10 text-gold animate-spin mb-4" />
                  <p className="text-sm font-medium text-brand">Extraindo texto do PDF...</p>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-gray-400 mb-4" />
                  <p className="text-sm font-medium text-brand mb-1">
                    Clique ou arraste o PDF aqui
                  </p>
                  <p className="text-xs text-gray-500">Apenas arquivos .pdf</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-brand">Texto Extraído</CardTitle>
              <CardDescription>
                Revise os dados extraídos antes de enviar para a IA.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={scrollToHistory}>
              <FileText className="mr-2 h-4 w-4" /> 📋 Ver Histórico de Exames
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Exame</Label>
              <Select value={tipoExame} onValueChange={setTipoExame}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laboratorial">Laboratorial</SelectItem>
                  <SelectItem value="biorressonancia">Biorressonância</SelectItem>
                  <SelectItem value="bioquimico">Bioquímico</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="min-h-[160px] font-mono text-xs focus-visible:ring-gold"
              placeholder="O texto extraído do PDF aparecerá aqui..."
            />
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSaveTextOnly}
                disabled={!extractedText.trim() || isInterpreting}
              >
                <Save className="mr-2 h-4 w-4" /> Salvar Texto Extraído
              </Button>
              <Button
                className="w-full bg-brand hover:bg-brand/90 text-white transition-colors"
                onClick={handleInterpret}
                disabled={!extractedText.trim() || isInterpreting}
              >
                {isInterpreting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-gold" /> Processando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 text-gold" /> Interpretar com IA
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {interpretationResult && (
        <div className="space-y-6">
          <Card className="border-gold shadow-md">
            <CardHeader className="bg-brand/5 border-b border-gold/20 pb-4">
              <CardTitle className="text-brand flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" /> Resultado da Interpretação
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-brand mb-4">Tabela de Comparação</h3>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-brand/5">
                      <TableRow>
                        <TableHead className="font-semibold text-brand">Exame</TableHead>
                        <TableHead className="font-semibold text-brand">Valor Paciente</TableHead>
                        <TableHead className="font-semibold text-brand">Valor Referência</TableHead>
                        <TableHead className="font-semibold text-brand">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {interpretationResult.tabela_comparacao.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{item.exame}</TableCell>
                          <TableCell>{item.valor_paciente}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.valor_referencia}
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                item.status.toLowerCase().includes('normal') ||
                                  item.status.toLowerCase().includes('adequado')
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800',
                              )}
                            >
                              {item.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-brand mb-2">Interpretação Integrativa</h3>
                <div className="bg-brand/5 p-4 rounded-lg border border-brand/10">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {interpretationResult.interpretacao_integrativa}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-brand mb-2">
                  Recomendações Terapêuticas
                </h3>
                <ul className="space-y-2">
                  {interpretationResult.recomendacoes_terapeuticas.map((rec, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-gray-700">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold mt-2 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {interpretationResult.sugestao_receita &&
            interpretationResult.sugestao_receita.length > 0 && (
              <div className="space-y-6">
                <Card className="border-gold shadow-md bg-gradient-to-br from-white to-gold/5">
                  <CardHeader className="border-b border-gold/20 pb-4">
                    <CardTitle className="text-brand flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gold" />
                      Sugestão de Receita Atual (SBPC/ML e SPC)
                    </CardTitle>
                    <CardDescription>
                      Sugestões de nutracêuticos e suplementos geradas a partir da interpretação
                      atual.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {interpretationResult.sugestao_receita.map((receita, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-4 rounded-lg border border-gold/20 shadow-sm relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-gold"></div>
                          <h4 className="font-semibold text-brand mb-1">{receita.item}</h4>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            {receita.dosagem_posologia}
                          </p>
                          <p className="text-xs text-gray-500 italic">{receita.justificativa}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {previousExamWithSuggestion && (
                  <Card className="border-gray-200 shadow-sm bg-gray-50/50">
                    <CardHeader className="border-b border-gray-200 pb-4">
                      <CardTitle className="text-gray-700 flex items-center gap-2 text-lg">
                        <ArrowLeft className="h-5 w-5 text-gray-400" />
                        Comparação: Sugestão Anterior (
                        {new Date(
                          previousExamWithSuggestion.data_exame ||
                            previousExamWithSuggestion.created_at ||
                            '',
                        ).toLocaleDateString('pt-BR')}
                        )
                      </CardTitle>
                      <CardDescription>
                        Para sua referência, esta foi a sugestão gerada no exame laboratorial
                        anterior.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-4 md:grid-cols-2 opacity-80">
                        {parseOldSuggestion(previousExamWithSuggestion).map(
                          (receita: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden"
                            >
                              <div className="absolute top-0 left-0 w-1 h-full bg-gray-300"></div>
                              <h4 className="font-semibold text-gray-700 mb-1">{receita.item}</h4>
                              <p className="text-sm font-medium text-gray-600 mb-2">
                                {receita.dosagem_posologia}
                              </p>
                              <p className="text-xs text-gray-400 italic">
                                {receita.justificativa}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
        </div>
      )}

      <Card id="historico-table" className="scroll-mt-6">
        <CardHeader>
          <CardTitle>Histórico de Exames</CardTitle>
          <CardDescription>
            Visualize todos os exames anteriores e suas respectivas interpretações e receitas
            sugeridas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status IA</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    {new Date(e.data_exame || e.created_at || '').toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="capitalize">{e.tipo_exame}</TableCell>
                  <TableCell>
                    {e.status_interpretacao === 'Interpretado' ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Interpretado
                      </span>
                    ) : e.status_interpretacao === 'Salvo Manualmente' ? (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        Salvo Manual
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Pendente
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    {e.interpretacao_ia || (e as any).sugestao_receita ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gold hover:text-gold-hover flex items-center gap-1"
                          >
                            <Sparkles className="h-4 w-4" />{' '}
                            <span className="hidden sm:inline">Ver Receita</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Sugestão de Receita (
                              {new Date(e.data_exame || e.created_at || '').toLocaleDateString(
                                'pt-BR',
                              )}
                              )
                            </DialogTitle>
                            <DialogDescription>
                              Interpretação e sugestões baseadas nos padrões SBPC/ML e SPC.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            {parseOldSuggestion(e).length > 0 ? (
                              <div className="grid gap-4 md:grid-cols-2">
                                {parseOldSuggestion(e).map((receita: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="bg-white p-4 rounded-lg border border-gold/20 shadow-sm relative overflow-hidden"
                                  >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gold"></div>
                                    <h4 className="font-semibold text-brand mb-1">
                                      {receita.item}
                                    </h4>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                      {receita.dosagem_posologia}
                                    </p>
                                    <p className="text-xs text-gray-500 italic">
                                      {receita.justificativa}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                Nenhuma sugestão de receita estruturada encontrada para este exame.
                              </p>
                            )}

                            {(e as any).interpretacao && (
                              <div className="mt-6">
                                <h4 className="font-semibold text-brand mb-2">
                                  Interpretação Integrativa
                                </h4>
                                <div className="bg-brand/5 p-4 rounded-lg border border-brand/10">
                                  <p className="text-gray-700 text-sm">
                                    {(e as any).interpretacao}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : null}
                    {e.dados_extraidos && !e.interpretacao_ia && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-brand"
                            title="Ver Texto"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Texto Extraído do Exame</DialogTitle>
                          </DialogHeader>
                          <div className="max-h-[60vh] overflow-y-auto w-full mt-4 bg-slate-50 p-4 rounded-md font-mono text-xs whitespace-pre-wrap">
                            {e.dados_extraidos}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() =>
                        examService
                          .delete(e.id)
                          .then(() => setExams(exams.filter((x) => x.id !== e.id)))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {exams.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Nenhum exame cadastrado no histórico.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
