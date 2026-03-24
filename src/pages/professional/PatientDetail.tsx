import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { patientService } from '@/services/patientService'
import { Patient } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FileText, ClipboardList, Pill } from 'lucide-react'

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [patient, setPatient] = useState<Patient | null>(null)

  useEffect(() => {
    if (id && id !== 'novo') {
      patientService.getById(id).then(setPatient).catch(console.error)
    } else if (id === 'novo') {
      setPatient({ id: 'novo', nome: 'Novo Paciente', organization_id: '' })
    }
  }, [id])

  if (!patient) return <div>Carregando...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/professional/patients')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h2 className="text-2xl font-bold text-brand">{patient.nome}</h2>
      </div>

      {id !== 'novo' && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start text-brand border-brand/20 hover:bg-brand/5"
              >
                <Link to={`/professional/patients/${id}/anamesis`}>
                  <ClipboardList className="mr-2 h-4 w-4" /> Anamnese
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start text-brand border-brand/20 hover:bg-brand/5"
              >
                <Link to={`/professional/patients/${id}/exams`}>
                  <FileText className="mr-2 h-4 w-4" /> Exames
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start text-brand border-brand/20 hover:bg-brand/5"
              >
                <Link to={`/professional/patients/${id}/prescriptions`}>
                  <Pill className="mr-2 h-4 w-4" /> Prescrições
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Dados do Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-muted-foreground">Email:</span>{' '}
                  {patient.email || '-'}
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Telefone:</span>{' '}
                  {patient.telefone || '-'}
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Status:</span>{' '}
                  {patient.status || 'Ativo'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
