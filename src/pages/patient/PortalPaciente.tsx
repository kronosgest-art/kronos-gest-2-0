import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Pill, Check, X } from 'lucide-react'

export default function PortalPaciente() {
  const { profile } = useAuth()
  const [upcomingApps, setUpcomingApps] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      if (!profile?.email) return

      const { data: pac } = await supabase
        .from('pacientes')
        .select('id')
        .eq('email', profile.email)
        .maybeSingle()

      if (pac) {
        const { data: agendamentos } = await supabase
          .from('agendamentos')
          .select('*')
          .eq('paciente_id', pac.id)
        if (agendamentos) {
          const upcoming = agendamentos.filter((a) => a.status === 'agendado')
          const hist = agendamentos.filter((a) => a.status !== 'agendado')
          setUpcomingApps(upcoming)
          setHistory(hist)
        }

        const { data: prescricoes } = await supabase
          .from('prescricoes')
          .select('*')
          .eq('paciente_id', pac.id)
        if (prescricoes) setPrescriptions(prescricoes)
      }
    }
    load()
  }, [profile])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-[#1E3A8A]">Meu Portal</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-t-4 border-t-[#B8860B]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1E3A8A]">
              <Calendar className="h-5 w-5" /> Próximos Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingApps.length === 0 ? (
              <p className="text-muted-foreground text-sm">Você não possui agendamentos futuros.</p>
            ) : (
              upcomingApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-slate-50"
                >
                  <div>
                    <p className="font-semibold">
                      {new Date(app.data_hora).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {app.tipo_procedimento || 'Consulta'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-[#B8860B] hover:bg-[#A0750A] text-white">
                      <Check className="h-4 w-4 mr-1" /> Confirmar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" /> Cancelar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-[#1E3A8A]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1E3A8A]">
              <Pill className="h-5 w-5" /> Minhas Prescrições
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {prescriptions.length === 0 ? (
              <p className="text-muted-foreground text-sm">Você não possui prescrições.</p>
            ) : (
              prescriptions.map((p) => (
                <div
                  key={p.id}
                  className="p-3 border rounded-lg bg-slate-50 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{p.tipo_prescricao}</p>
                    <p className="text-sm text-muted-foreground">
                      Data: {new Date(p.data_prescricao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="text-[#1E3A8A] border-[#1E3A8A]">
                    Ver Detalhes
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#1E3A8A]">Histórico de Sessões</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhum histórico encontrado.</p>
            ) : (
              <div className="space-y-3">
                {history.map((h) => (
                  <div key={h.id} className="p-3 border-b flex justify-between">
                    <div>
                      <p className="font-medium">
                        {new Date(h.data_hora).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-muted-foreground">{h.tipo_procedimento}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-800 h-fit capitalize">
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
