import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { patientService } from '@/services/patientService'
import { useAuth } from '@/hooks/use-auth'
import { Patient } from '@/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, MoreVertical, Edit } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [search, setSearch] = useState('')
  const { profile } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (profile?.organization_id) {
      patientService.getAll(profile.organization_id).then(setPatients)
    }
  }, [profile])

  const filtered = patients.filter((p) => p.nome.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand">Pacientes</h2>
        <Button
          onClick={() => navigate('/professional/patients/novo')}
          className="bg-brand hover:bg-brand/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Paciente
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow
                  key={p.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => navigate(`/professional/patients/${p.id}`)}
                >
                  <TableCell className="font-medium text-brand">{p.nome}</TableCell>
                  <TableCell>{p.telefone || '-'}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">
                      {p.status || 'Ativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/professional/patients/${p.id}`)
                      }}
                    >
                      <Edit className="h-4 w-4 text-brand" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
