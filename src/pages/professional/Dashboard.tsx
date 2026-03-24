import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { patientService } from '@/services/patientService'
import { Users, Calendar as CalendarIcon, DollarSign, Activity } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [totalPatients, setTotalPatients] = useState(0)

  useEffect(() => {
    if (profile?.organization_id) {
      patientService.getAll(profile.organization_id).then((data) => setTotalPatients(data.length))
    }
  }, [profile])

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-brand">
          Bem-vindo, {profile?.nome || 'Profissional'}!
        </h1>
        <p className="text-muted-foreground">Visão geral da sua clínica e atendimentos.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift border-t-4 border-t-brand">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Pacientes</p>
                <p className="text-3xl font-bold text-brand">{totalPatients}</p>
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
                <p className="text-3xl font-bold text-brand">4</p>
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
                <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
                <p className="text-3xl font-bold text-emerald-600">R$ 15k</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift border-t-4 border-t-purple-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Plano Atual</p>
                <p className="text-2xl font-bold text-purple-700 mt-1">Premium</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-brand">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-wrap">
            <Button asChild className="bg-brand text-white hover:bg-brand/90">
              <Link to="/professional/patients">Gerenciar Pacientes</Link>
            </Button>
            <Button asChild variant="outline" className="border-brand text-brand">
              <Link to="/professional/appointments">Ver Agenda</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
