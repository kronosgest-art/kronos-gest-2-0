import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import {
  Building2,
  Users,
  Calendar as CalendarIcon,
  Crown,
  CheckCircle2,
  XCircle,
  TrendingUp,
  UserPlus,
  FileText,
  TestTube,
  Pill,
  DollarSign,
  Settings,
} from 'lucide-react'
import { startOfMonth } from 'date-fns'
import { Link, useNavigate } from 'react-router-dom'

export default function ProfDashboard() {
  const { appointments, updateAppointmentStatus } = useApp()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [orgName, setOrgName] = useState<string>('')

  const [metrics, setMetrics] = useState({
    totalPatients: 0,
    newPatientsThisMonth: 0,
    recentPatients: [] as any[],
  })

  const todayAppointments = appointments.filter((a) => a.date === 'Hoje')

  const handleAnamnese = () => {
    navigate('/prof/anamnese')
  }

  const handleExames = () => {
    navigate('/prof/exames')
  }

  const handlePrescricoes = () => {
    navigate('/prof/prescricoes')
  }

  const handleFinanceiro = () => {
    navigate('/prof/financeiro')
  }

  const handleConfiguracoes = () => {
    navigate('/prof/configuracoes')
  }

  useEffect(() => {
    async function fetchDashboardData() {
      if (!profile?.organization_id) return

      try {
        // Fetch org name
        const { data: orgData } = await supabase
          .from('organizations')
          .select('nome_clinica')
          .eq('id', profile.organization_id)
          .single()

        if (orgData) setOrgName(orgData.nome_clinica)

        // Fetch Metrics - using select id with limit 1 and count exact to avoid HEAD requests
        const startOfCurrentMonth = startOfMonth(new Date()).toISOString()

        const [totalRes, newMonthRes, recentRes] = await Promise.all([
          supabase
            .from('pacientes')
            .select('id', { count: 'exact' })
            .eq('organization_id', profile.organization_id)
            .limit(1),
          supabase
            .from('pacientes')
            .select('id', { count: 'exact' })
            .eq('organization_id', profile.organization_id)
            .gte('created_at', startOfCurrentMonth)
            .limit(1),
          supabase
            .from('pacientes')
            .select('id, nome, email, created_at')
            .eq('organization_id', profile.organization_id)
            .order('created_at', { ascending: false })
            .limit(5),
        ])

        setMetrics({
          totalPatients: totalRes.count || 0,
          newPatientsThisMonth: newMonthRes.count || 0,
          recentPatients: recentRes.data || [],
        })
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error)
      }
    }
    fetchDashboardData()
  }, [profile?.organization_id])

  return (
    <div className="space-y-8">
      {/* Header de Boas-vindas */}
      <div className="flex flex-col gap-1 mb-6 animate-slide-up">
        <h1 className="text-3xl font-bold tracking-tight text-brand">
          Bem-vinda, {profile?.nome?.split(' ')[0] || 'Profissional'}!
        </h1>
        {orgName && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-5 w-5 text-gold" />
            <span className="text-lg font-medium">{orgName}</span>
          </div>
        )}
      </div>

      {/* Ações Rápidas */}
      <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: '50ms' }}>
        <Button
          onClick={handleAnamnese}
          variant="secondary"
          className="flex items-center gap-2 hover-lift"
        >
          <FileText className="h-4 w-4 text-brand" /> Anamnese
        </Button>
        <Button
          onClick={handleExames}
          variant="secondary"
          className="flex items-center gap-2 hover-lift"
        >
          <TestTube className="h-4 w-4 text-brand" /> Exames
        </Button>
        <Button
          onClick={handlePrescricoes}
          variant="secondary"
          className="flex items-center gap-2 hover-lift"
        >
          <Pill className="h-4 w-4 text-brand" /> Prescrições
        </Button>
        <Button
          onClick={handleFinanceiro}
          variant="secondary"
          className="flex items-center gap-2 hover-lift"
        >
          <DollarSign className="h-4 w-4 text-brand" /> Financeiro
        </Button>
        <Button
          onClick={handleConfiguracoes}
          variant="secondary"
          className="flex items-center gap-2 hover-lift"
        >
          <Settings className="h-4 w-4 text-brand" /> Configurações
        </Button>
      </div>

      <div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slide-up"
        style={{ animationDelay: '100ms' }}
      >
        <Card className="hover-lift border-t-4 border-t-brand">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Pacientes</p>
                <p className="text-3xl font-bold text-brand">{metrics.totalPatients}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-brand" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-t-4 border-t-emerald-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Novos (Este Mês)</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-emerald-600">
                    +{metrics.newPatientsThisMonth}
                  </p>
                </div>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-t-4 border-t-gold">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Agendamentos Hoje</p>
                <p className="text-3xl font-bold text-brand">{todayAppointments.length}</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-gold" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-t-4 border-t-purple-500 bg-gradient-to-br from-white to-purple-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Plano Atual</p>
                <p className="text-2xl font-bold text-purple-700 mt-1">Premium</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Crown className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div
        className="grid gap-6 md:grid-cols-3 animate-slide-up"
        style={{ animationDelay: '200ms' }}
      >
        <Card className="md:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="border-b bg-slate-50/50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-brand flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Agenda do Dia
              </CardTitle>
              <Button variant="outline" size="sm" className="text-brand border-brand/20">
                Ver Agenda Completa
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {todayAppointments.map((app) => (
                <div
                  key={app.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center bg-brand/5 text-brand rounded-lg w-16 h-16 border border-brand/10">
                      <span className="text-sm font-bold">{app.time.split(':')[0]}</span>
                      <span className="text-xs">{app.time.split(':')[1]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-brand text-lg">{app.patientName}</p>
                      <p className="text-sm text-muted-foreground">{app.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Badge
                      variant="secondary"
                      className={
                        app.status === 'confirmado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'cancelado'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {app.status}
                    </Badge>

                    {app.status === 'pendente' && (
                      <div className="flex gap-2 ml-auto sm:ml-0">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          onClick={() => updateAppointmentStatus(app.id, 'confirmado')}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => updateAppointmentStatus(app.id, 'cancelado')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {app.status === 'confirmado' && (
                      <Button className="bg-gold hover:bg-gold-hover text-white shadow-md w-full sm:w-auto">
                        Iniciar Sessão
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {todayAppointments.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhum agendamento para hoje.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 flex flex-col">
          <CardHeader className="border-b bg-slate-50/50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-brand flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Últimos Pacientes
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-brand" asChild>
                <Link to="/prof/pacientes">Ver Todos</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="divide-y flex-1">
              {metrics.recentPatients.length > 0 ? (
                metrics.recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-4 hover:bg-slate-50 transition-colors flex flex-col gap-1"
                  >
                    <div className="flex justify-between items-start">
                      <p
                        className="font-semibold text-brand truncate max-w-[200px]"
                        title={patient.nome}
                      >
                        {patient.nome}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {patient.email && (
                      <p className="text-xs text-muted-foreground truncate">{patient.email}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhum paciente cadastrado ainda.
                </div>
              )}
            </div>
            <div className="p-4 border-t mt-auto">
              <Button className="w-full bg-brand hover:bg-brand/90" asChild>
                <Link to="/prof/pacientes/novo">Cadastrar Novo Paciente</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
