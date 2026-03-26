import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { prescriptionService } from '@/services/prescriptionService'
import { Prescription } from '@/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer, Sparkles } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Prescriptions() {
  const { pacienteId } = useParams<{ pacienteId: string }>()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])

  useEffect(() => {
    if (pacienteId) prescriptionService.getByPatient(pacienteId).then(setPrescriptions)
  }, [pacienteId])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(`/professional/patients/${pacienteId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <h2 className="text-2xl font-bold text-brand">Prescrições do Paciente</h2>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/professional/patients/${pacienteId}/prescriptions/new`)}
            className="bg-gold hover:bg-gold-hover text-white"
          >
            <Sparkles className="mr-2 h-4 w-4" /> Nova com IA
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Prescrições</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{new Date(p.data_prescricao).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{p.tipo_prescricao}</TableCell>
                  <TableCell>{p.status}</TableCell>
                  <TableCell className="text-right">
                    {p.pdf_url ? (
                      <a
                        href={p.pdf_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none hover:bg-accent hover:text-accent-foreground h-9 w-9"
                      >
                        <Printer className="h-4 w-4" />
                      </a>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-brand"
                        onClick={() => window.print()}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {prescriptions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Nenhuma prescrição encontrada.
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
