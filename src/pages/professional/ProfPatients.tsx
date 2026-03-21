import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, MoreVertical, FileText } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

const patientsList = [
  {
    id: 1,
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    phone: '(11) 98765-4321',
    lastVisit: '10/10/2023',
    status: 'Ativo',
  },
  {
    id: 2,
    name: 'Carlos Santos',
    email: 'carlos.s@email.com',
    phone: '(11) 91234-5678',
    lastVisit: '08/10/2023',
    status: 'Ativo',
  },
  {
    id: 3,
    name: 'Mariana Costa',
    email: 'mari.costa@email.com',
    phone: '(11) 99876-5432',
    lastVisit: '15/09/2023',
    status: 'Inativo',
  },
]

export default function ProfPatients() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand">Pacientes</h2>
          <p className="text-muted-foreground">Gerencie seus pacientes e prontuários</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-brand hover:bg-brand/90 w-full sm:w-auto shadow-md">
              <Plus className="mr-2 h-4 w-4" /> Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-brand">Adicionar Novo Paciente</DialogTitle>
              <DialogDescription>
                Preencha os dados básicos para cadastrar um novo paciente no sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" placeholder="Ex: João da Silva" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="Ex: joao@email.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(00) 00000-0000" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" className="bg-gold hover:bg-yellow-600 text-white">
                Salvar Cadastro
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center space-x-2 relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome, CPF ou e-mail..."
              className="pl-9 bg-slate-50"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="hidden md:table-cell">Última Visita</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientsList.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-brand">{patient.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{patient.phone}</div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {patient.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {patient.lastVisit}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${patient.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}
                    >
                      {patient.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-brand hover:text-brand hover:bg-blue-50"
                        title="Ver Prontuário"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-brand"
                        title="Opções"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
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
