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
  Zap,
  Crown,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

export default function ProfDashboard() {
  const { appointments, updateAppointmentStatus } = useApp()
  const { profile } = useAuth()
  const [orgName, setOrgName] = useState<string>('')

  const todayAppointments = appointments.filter((a) => a.date === 'Hoje')

  useEffect(() => {
    async function fetchOrg() {
      if (profile?.organization_id) {
        const { data, error } = await supabase
          .from('organizations')
          .select('nome_clinica')
          .eq('id', profile.organization_id)
          .single()

        if (data && !error) {
          setOrgName(data.nome_clinica)
        }
      }
    }
    fetchOrg()
  }, [profile?.organization_id])

  return (
    <div className="space-y-8">
      {/* Header de Boas-vindas */}
      <div className="flex flex-col gap-1 mb-6 animate-slide-up">
        <h1 className="text-3xl font-bold tracking-tight text-brand">
          Bem-vinda, {profile?.nome?.split(' ')[0] || 'Morgana'}!
        </h1>
        {orgName && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-5 w-5 text-gold" />
            <span className="text-lg font-medium">{orgName}</span>
          </div>
        )}
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
                <p className="text-3xl font-bold text-brand">342</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-brand" />
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

        <Card className="hover-lift border-t-4 border-t-emerald-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Créditos IA Restantes</p>
                <p className="text-3xl font-bold text-brand">1,204</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Zap className="h-5 w-5 text-emerald-600" />
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
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand text-white shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap className="h-32 w-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg text-blue-50">Resumo de Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div>
              <p className="text-blue-200 text-sm mb-1">Taxa de Comparecimento</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">92%</span>
                <span className="text-emerald-400 text-sm mb-1">+2%</span>
              </div>
            </div>
            <div>
              <p className="text-blue-200 text-sm mb-1">Satisfação (NPS)</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">4.9</span>
                <span className="text-blue-200 text-sm mb-1">/ 5.0</span>
              </div>
            </div>
            <Button variant="secondary" className="w-full bg-white text-brand hover:bg-blue-50">
              Ver Relatório Detalhado
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
