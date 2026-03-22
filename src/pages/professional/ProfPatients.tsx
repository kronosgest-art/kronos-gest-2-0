import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Plus, MoreVertical, FileText, Download, Loader2, Edit } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

export default function ProfPatients() {
  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10

  const { profile } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset page on new search
    }, 500)
    return () => clearTimeout(handler)
  }, [search])

  const fetchPatients = useCallback(async () => {
    if (!profile?.organization_id) return
    setIsLoading(true)

    try {
      // Utilizamos select com count 'exact' e sem flag 'head' para que a requisição
      // seja feita via método GET garantindo dados e contagem sem erros de parse de JSON
      let query = supabase
        .from('pacientes')
        .select('*', { count: 'exact' })
        .eq('organization_id', profile.organization_id)

      if (debouncedSearch) {
        query = query.or(
          `nome.ilike.%${debouncedSearch}%,email.ilike.%${debouncedSearch}%,telefone.ilike.%${debouncedSearch}%`,
        )
      }

      if (statusFilter !== 'todos') {
        query = query.eq('status', statusFilter)
      }

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error

      setPatients(data || [])
      setTotalPages(Math.ceil((count || 0) / pageSize))
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar pacientes',
        description: error.message,
      })
      setPatients([])
      setTotalPages(1)
    } finally {
      setIsLoading(false)
    }
  }, [profile?.organization_id, debouncedSearch, statusFilter, page, toast])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  const handleExportCsv = async () => {
    try {
      let query = supabase
        .from('pacientes')
        .select('nome, email, telefone, status, created_at')
        .eq('organization_id', profile?.organization_id)

      if (debouncedSearch) {
        query = query.or(
          `nome.ilike.%${debouncedSearch}%,email.ilike.%${debouncedSearch}%,telefone.ilike.%${debouncedSearch}%`,
        )
      }
      if (statusFilter !== 'todos') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query.order('nome')

      if (error) throw error

      if (!data || data.length === 0) {
        toast({ description: 'Nenhum dado para exportar.' })
        return
      }

      const headers = ['Nome', 'E-mail', 'Telefone', 'Status', 'Data de Cadastro']
      const csvContent = [
        headers.join(','),
        ...data.map((row) =>
          [
            `"${row.nome || ''}"`,
            `"${row.email || ''}"`,
            `"${row.telefone || ''}"`,
            `"${row.status === 'ativo' ? 'Ativo' : 'Inativo'}"`,
            `"${new Date(row.created_at).toLocaleDateString('pt-BR')}"`,
          ].join(','),
        ),
      ].join('\n')

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `pacientes_${new Date().getTime()}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({ title: 'Sucesso', description: 'Exportação concluída.' })
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro ao exportar', description: error.message })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand">Pacientes</h2>
          <p className="text-muted-foreground">Gerencie seus pacientes e prontuários</p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleExportCsv}
            className="flex-1 sm:flex-none text-brand"
            title="Exportar para Excel/CSV"
          >
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button
            onClick={() => navigate('/prof/pacientes/novo')}
            className="bg-brand hover:bg-brand/90 flex-1 sm:flex-none shadow-md"
          >
            <Plus className="mr-2 h-4 w-4" /> Novo Paciente
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2 relative w-full md:max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nome, e-mail ou telefone..."
                className="pl-9 bg-slate-50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Nenhum paciente encontrado com os filtros atuais.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead className="hidden md:table-cell">Data de Cadastro</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-brand">{patient.nome}</TableCell>
                      <TableCell>
                        <div className="text-sm">{patient.telefone || '-'}</div>
                        <div className="text-xs text-muted-foreground hidden sm:block">
                          {patient.email || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${patient.status === 'ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}
                        >
                          {patient.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-400 hover:text-brand"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => navigate(`/prof/pacientes/${patient.id}`)}
                                className="cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4" /> Editar Paciente
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <FileText className="mr-2 h-4 w-4" /> Ver Prontuário
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="py-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className={
                            page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => {
                        // Very simple pagination display logic
                        if (
                          totalPages > 5 &&
                          i > 0 &&
                          i < totalPages - 1 &&
                          Math.abs(i + 1 - page) > 1
                        ) {
                          if (i + 1 === page - 2 || i + 1 === page + 2) {
                            return (
                              <PaginationItem key={i}>
                                <span className="px-2">...</span>
                              </PaginationItem>
                            )
                          }
                          return null
                        }
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              isActive={page === i + 1}
                              onClick={() => setPage(i + 1)}
                              className="cursor-pointer"
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          className={
                            page === totalPages
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
