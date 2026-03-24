import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { financialService } from '@/services/financialService'
import { Financial } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function FinancialPage() {
  const { profile } = useAuth()
  const [data, setData] = useState<Financial[]>([])

  useEffect(() => {
    if (profile?.organization_id) financialService.getAll(profile.organization_id).then(setData)
  }, [profile])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand">Relatório Financeiro</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-t-4 border-t-emerald-500">
          <CardContent className="pt-6">
            <p className="text-sm">Receitas</p>
            <p className="text-2xl font-bold text-emerald-600">R$ 15.000</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-red-500">
          <CardContent className="pt-6">
            <p className="text-sm">Despesas</p>
            <p className="text-2xl font-bold text-red-600">R$ 2.000</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-brand">
          <CardContent className="pt-6">
            <p className="text-sm">Saldo</p>
            <p className="text-2xl font-bold text-brand">R$ 13.000</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lançamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{new Date(l.data_lancamento).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{l.descricao}</TableCell>
                  <TableCell>{l.tipo}</TableCell>
                  <TableCell className="text-right font-bold">R$ {l.valor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
