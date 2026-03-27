import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { examService } from '@/services/examService'
import { supabase } from '@/lib/supabase/client'
import { Exam } from '@/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Upload, Trash2, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
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

// Configurar worker ANTES de qualquer operação
const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js`
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

interface InterpretationResult {
  tabela_comparacao: ComparisonItem[]
  interpretacao_integrativa: string
  recomendacoes_terapeuticas: string[]
}

export default function Exams() {
  const { pacienteId } = useParams<{ pacienteId: string }>()
  const navigate = useNavigate()
  const { profile } = useAuth()
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

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (pacienteId) examService.getByPatient(pacienteId).then(setExams)
  }, [pacienteId])

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
        body: { examData: extractedText },
      })

      if (error) throw error

      if (data?.error) {
        throw new Error(data.message || 'Erro na interpretação da IA.')
      }

      setInterpretationResult(data)
      toast({
        title: 'Sucesso',
        description: 'Exame interpretado com sucesso.',
      })
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
          <CardHeader>
            <CardTitle className="text-brand">Texto Extraído</CardTitle>
            <CardDescription>Revise os dados extraídos antes de enviar para a IA.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="min-h-[160px] font-mono text-xs focus-visible:ring-gold"
              placeholder="O texto extraído do PDF aparecerá aqui..."
            />
            <Button
              className="w-full bg-brand hover:bg-brand/90 text-white transition-colors"
              onClick={handleInterpret}
              disabled={!extractedText.trim() || isInterpreting}
            >
              {isInterpreting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-gold" /> Interpretando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 text-gold" /> Interpretar com IA
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {interpretationResult && (
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
              <h3 className="text-lg font-semibold text-brand mb-2">Recomendações Terapêuticas</h3>
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
      )}

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Exames</CardTitle>
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
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Pendente
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    {e.interpretacao_ia && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gold hover:text-gold-hover"
                        onClick={() => alert(e.interpretacao_ia)}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-brand">
                      <FileText className="h-4 w-4" />
                    </Button>
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
