import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { examService } from '@/services/examService'
import { Exam } from '@/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Upload, Trash2, Sparkles } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Exams() {
  const { pacienteId } = useParams<{ pacienteId: string }>()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [exams, setExams] = useState<Exam[]>([])

  useEffect(() => {
    if (pacienteId) examService.getByPatient(pacienteId).then(setExams)
  }, [pacienteId])

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
          <Upload className="mr-2 h-4 w-4" /> Upload de Exame
        </Button>
      </div>

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
                        className="text-gold"
                        onClick={() => alert(e.interpretacao_ia)}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-blue-600">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
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
                    Nenhum exame cadastrado.
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
