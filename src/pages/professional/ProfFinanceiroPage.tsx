import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Loader2,
  Download,
  Printer,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

export default function ProfFinanceiroPage() {
  const navigate = useNavigate()
  const { profile } = useAuth()

  const [lancamentos, setLancamentos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (profile?.organization_id) {
      loadData()
    }
  }, [profile])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('financeiro')
        .select('*')
        .eq('organization_id', profile!.organization_id)
        .order('data_lancamento', { ascending: false })

      if (error) throw error
      setLancamentos(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const { totalReceitas, totalDespesas, saldo } = useMemo(() => {
    let r = 0,
      d = 0
    lancamentos.forEach((l) => {
      if (l.tipo === 'Receita') r += Number(l.valor)
      else d += Number(l.valor)
    })
    return { totalReceitas: r, totalDespesas: d, saldo: r - d }
  }, [lancamentos])

  const chartData = useMemo(() => {
    // Agrupar por mês simplificado para mock/exemplo
    return [
      { mes: 'Out', receita: 12000, despesa: 4000 },
      { mes: 'Nov', receita: 15000, despesa: 4500 },
      { mes: 'Dez', receita: 14000, despesa: 3800 },
      { mes: 'Jan', receita: 18000, despesa: 5000 },
      { mes: 'Fev', receita: totalReceitas || 5000, despesa: totalDespesas || 1000 },
    ]
  }, [totalReceitas, totalDespesas])

  const handlePrintReport = () => {
    window.print()
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/prof/dashboard')}
            className="text-brand"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-brand">Painel Financeiro</h2>
            <p className="text-muted-foreground text-sm">
              Controle de receitas, despesas e relatórios.
            </p>
          </div>
        </div>
        <Button variant="outline" className="text-brand" onClick={handlePrintReport}>
          <Printer className="mr-2 h-4 w-4" /> Imprimir Relatório
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover-lift border-t-4 border-t-emerald-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Receitas (Mês)</p>
                <p className="text-3xl font-bold text-emerald-600">R$ {totalReceitas.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-t-4 border-t-red-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Despesas (Mês)</p>
                <p className="text-3xl font-bold text-red-600">R$ {totalDespesas.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-t-4 border-t-brand">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Saldo Líquido</p>
                <p className="text-3xl font-bold text-brand">R$ {saldo.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-brand" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Receitas vs Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              receita: { label: 'Receita', color: '#10b981' },
              despesa: { label: 'Despesa', color: '#ef4444' },
            }}
            className="h-[300px] w-full"
          >
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="mes"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `R$ ${v}`}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="receita"
                stroke="#10b981"
                fillOpacity={0.2}
                fill="#10b981"
              />
              <Area
                type="monotone"
                dataKey="despesa"
                stroke="#ef4444"
                fillOpacity={0.2}
                fill="#ef4444"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Lançamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
          ) : lancamentos.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              Nenhum lançamento registrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lancamentos.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>
                        {new Date(l.data_lancamento).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="font-medium">{l.descricao}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${l.tipo === 'Receita' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {l.tipo}
                        </span>
                      </TableCell>
                      <TableCell>{l.status}</TableCell>
                      <TableCell className="text-right font-bold">
                        R$ {Number(l.valor).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
