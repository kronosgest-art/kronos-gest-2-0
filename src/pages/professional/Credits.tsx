import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Coins, Plus } from 'lucide-react'

export default function Credits() {
  const { profile } = useAuth()
  const [history, setHistory] = useState<any[]>([])
  const [creditsUsed, setCreditsUsed] = useState(0)

  useEffect(() => {
    if (!profile?.organization_id) return
    const load = async () => {
      const { data: org } = await supabase
        .from('organizations')
        .select('gastos_creditos_mes')
        .eq('id', profile.organization_id)
        .single()
      if (org) setCreditsUsed(org.gastos_creditos_mes || 0)

      const { data: historyData } = await supabase
        .from('creditos_gastos')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })

      if (historyData) setHistory(historyData)
    }
    load()
  }, [profile])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1E3A8A]">Sistema de Créditos</h2>
        <Button className="bg-[#B8860B] hover:bg-[#A0750A] text-white shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Comprar Mais Créditos
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-t-4 border-t-green-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Coins className="h-4 w-4 text-green-600" /> Créditos Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#1E3A8A]">1.500</p>
            <p className="text-xs text-muted-foreground mt-1">Conforme seu plano de assinatura</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-red-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Coins className="h-4 w-4 text-red-600" /> Créditos Gastos este Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{creditsUsed}</p>
            <p className="text-xs text-muted-foreground mt-1">Uso atual no ciclo</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#1E3A8A]">Histórico de Gasto de Créditos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição / Operação</TableHead>
                <TableHead className="text-right">Créditos Gastos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{new Date(h.created_at).toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="font-medium">{h.descricao || h.tipo_operacao}</TableCell>
                  <TableCell className="text-right font-bold text-red-600">
                    -{h.creditos_gastos}
                  </TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                    Nenhum gasto de crédito registrado neste mês.
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
