import { useEffect, useState } from 'react'
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
import { Eye, Edit, Trash2 } from 'lucide-react'

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    clinics: 0,
    professionals: 0,
    patients: 0,
    revenue: 0,
    credits: 0,
  })
  const [clinics, setClinics] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const [
        { count: clinicsCount },
        { count: profsCount },
        { count: patientsCount },
        { data: finData },
        { data: credData },
        { data: clinicsList },
      ] = await Promise.all([
        supabase.from('organizations').select('*', { count: 'exact', head: true }),
        supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'profissional'),
        supabase.from('pacientes').select('*', { count: 'exact', head: true }),
        supabase.from('financeiro').select('valor').eq('tipo', 'Receita'),
        supabase.from('creditos_gastos').select('creditos_gastos'),
        supabase.from('organizations').select('*').order('created_at', { ascending: false }),
      ])

      const revenue = finData?.reduce((a, b) => a + Number(b.valor), 0) || 0
      const credits = credData?.reduce((a, b) => a + Number(b.creditos_gastos), 0) || 0

      setMetrics({
        clinics: clinicsCount || 0,
        professionals: profsCount || 0,
        patients: patientsCount || 0,
        revenue,
        credits,
      })

      if (clinicsList) setClinics(clinicsList)
    }

    load()
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1E3A8A]">Painel de Administrador</h2>

      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-t-4 border-t-[#B8860B]">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total de Clínicas</p>
            <p className="text-3xl font-bold text-[#1E3A8A]">{metrics.clinics}</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-[#B8860B]">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total Profissionais</p>
            <p className="text-3xl font-bold text-[#1E3A8A]">{metrics.professionals}</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-[#B8860B]">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total Pacientes</p>
            <p className="text-3xl font-bold text-[#1E3A8A]">{metrics.patients}</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-green-500">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(metrics.revenue)}</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-purple-500">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Créditos Gastos</p>
            <p className="text-3xl font-bold text-purple-600">{metrics.credits}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#1E3A8A]">Lista de Clínicas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email Responsável</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clinics.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.nome_clinica}</TableCell>
                  <TableCell>{c.email_responsavel || '-'}</TableCell>
                  <TableCell>{c.plano_assinatura || 'Free'}</TableCell>
                  <TableCell>{new Date(c.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {c.status || 'Ativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="text-[#1E3A8A]">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-[#B8860B]">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
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
