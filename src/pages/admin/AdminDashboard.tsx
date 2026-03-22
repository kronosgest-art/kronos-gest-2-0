import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Users, DollarSign, Activity, Building2 } from 'lucide-react'
import { Area, AreaChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { clinicsData, chartData } from '@/lib/mockData'
import { SystemStatusCard } from '@/components/SystemStatusCard'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand">Painel Administrativo</h2>
          <p className="text-muted-foreground">Visão geral do sistema e organizações</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <SystemStatusCard />

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clínicas Ativas</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand">342</div>
            <p className="text-xs text-muted-foreground mt-1">12 em período de trial</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Assinantes</CardTitle>
            <Users className="h-4 w-4 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand">1,245</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand">R$ 145.230</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              +8% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Consumidos</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand">84%</div>
            <Progress value={84} className="h-2 mt-2 bg-slate-100" />
            <p className="text-xs text-muted-foreground mt-2">12M / 15M capacidade global</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="text-brand">Consumo de Créditos (6 meses)</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer
              config={{ creditos: { label: 'Créditos', color: 'hsl(var(--primary))' } }}
              className="h-[300px] w-full"
            >
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCreditos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
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
                  tickFormatter={(value) => `${value}k`}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="creditos"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCreditos)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-brand">Gestão de Clínicas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Clínica</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clinicsData.map((clinic) => (
                    <TableRow key={clinic.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <p className="font-medium text-brand">{clinic.name}</p>
                        <p className="text-xs text-muted-foreground">{clinic.owner}</p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={clinic.plan === 'Premium' ? 'border-gold text-gold' : ''}
                        >
                          {clinic.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            clinic.status === 'Ativa'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : clinic.status === 'Trial'
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }
                          variant="secondary"
                        >
                          {clinic.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-brand">
                          Gerenciar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
