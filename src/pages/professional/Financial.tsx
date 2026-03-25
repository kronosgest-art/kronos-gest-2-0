import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Financial } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Plus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('T')[0].split('-')
  return `${d}/${m}/${y}`
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

export default function FinancialPage() {
  const { profile } = useAuth()
  const [data, setData] = useState<Financial[]>([])
  const [search, setSearch] = useState('')
  const [type, setType] = useState('Todos')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')

  useEffect(() => {
    if (profile?.organization_id) {
      supabase
        .from('financeiro')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('data_lancamento', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) setData(data as Financial[])
        })
    }
  }, [profile])

  const filtered = data.filter((l) => {
    const matchDesc = l.descricao.toLowerCase().includes(search.toLowerCase())
    const matchType = type === 'Todos' ? true : l.tipo === type
    let matchDate = true
    if (dateStart) matchDate = matchDate && l.data_lancamento >= dateStart
    if (dateEnd) matchDate = matchDate && l.data_lancamento <= dateEnd
    return matchDesc && matchType && matchDate
  })

  const totalReceitas = filtered
    .filter((l) => l.tipo === 'Receita')
    .reduce((acc, curr) => acc + Number(curr.valor), 0)
  const totalDespesas = filtered
    .filter((l) => l.tipo === 'Despesa')
    .reduce((acc, curr) => acc + Number(curr.valor), 0)
  const saldo = totalReceitas - totalDespesas

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1E3A8A]">Relatório Financeiro</h2>
        <Button className="bg-[#B8860B] hover:bg-[#A0750A] text-white">
          <Plus className="mr-2 h-4 w-4" /> Novo Lançamento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-t-4 border-t-green-500">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total Receitas</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalReceitas)}</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-red-500">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total Despesas</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDespesas)}</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-[#1E3A8A]">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Saldo</p>
            <p className="text-2xl font-bold text-[#1E3A8A]">{formatCurrency(saldo)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Tipos</SelectItem>
                <SelectItem value="Receita">Receita</SelectItem>
                <SelectItem value="Despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>
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
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{formatDate(l.data_lancamento)}</TableCell>
                  <TableCell>{l.descricao}</TableCell>
                  <TableCell>
                    <span
                      className={
                        l.tipo === 'Receita'
                          ? 'text-green-600 font-medium'
                          : 'text-red-600 font-medium'
                      }
                    >
                      {l.tipo}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(l.valor)}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Nenhum lançamento encontrado.
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
