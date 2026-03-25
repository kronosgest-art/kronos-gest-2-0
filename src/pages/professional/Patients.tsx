import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { patientService } from '@/services/patientService'
import { useAuth } from '@/hooks/use-auth'
import { Patient } from '@/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const loadPatients = () => {
    if (profile?.organization_id) {
      patientService.getAll(profile.organization_id).then(setPatients)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [profile])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (
      window.confirm(
        'Tem certeza que deseja deletar este paciente? Esta ação não pode ser desfeita.',
      )
    ) {
      try {
        await patientService.delete(id)
        toast({ title: 'Sucesso', description: 'Paciente deletado.' })
        loadPatients()
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Erro', description: err.message })
      }
    }
  }

  const filtered = patients.filter((p) => {
    const matchName = p.nome?.toLowerCase().includes(search.toLowerCase())
    const matchCity = cityFilter ? p.cidade?.toLowerCase().includes(cityFilter.toLowerCase()) : true
    let matchDate = true
    if (dateStart && p.data_nascimento) matchDate = matchDate && p.data_nascimento >= dateStart
    if (dateEnd && p.data_nascimento) matchDate = matchDate && p.data_nascimento <= dateEnd
    return matchName && matchCity && matchDate
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1E3A8A]">Pacientes</h2>
        <Button
          onClick={() => navigate('/professional/patients/novo')}
          className="bg-[#B8860B] hover:bg-[#A0750A] text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Paciente
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Input
              placeholder="Cidade"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full md:w-48"
            />
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="w-full md:w-40"
              />
              <span className="text-muted-foreground">até</span>
              <Input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="w-full md:w-40"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Data de Nasc.</TableHead>
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
                  <TableCell className="font-medium text-[#1E3A8A]">{p.nome}</TableCell>
                  <TableCell>{p.cpf || '-'}</TableCell>
                  <TableCell>{p.email || '-'}</TableCell>
                  <TableCell>{p.telefone || '-'}</TableCell>
                  <TableCell>
                    {p.data_nascimento
                      ? new Date(p.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/professional/patients/${p.id}`)
                        }}
                      >
                        <Edit className="h-4 w-4 text-[#1E3A8A]" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={(e) => handleDelete(e, p.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    Nenhum paciente encontrado.
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
