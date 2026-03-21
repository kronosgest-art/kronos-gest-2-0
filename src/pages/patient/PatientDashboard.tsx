import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Download, FileText, Clock, MapPin, CheckCircle2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { prescriptionsData, timelineData } from '@/lib/mockData'

export default function PatientDashboard() {
  const { appointments, updateAppointmentStatus } = useApp()

  // Get next pending or confirmed appointment
  const nextApp = appointments.find((a) => a.status !== 'cancelado')

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-brand rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Calendar className="h-48 w-48" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Olá, João! 👋</h2>
          <p className="text-blue-100 text-lg max-w-2xl">
            Acompanhe sua saúde integrativa e gerencie seus próximos encontros com nossos
            profissionais.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-gold shadow-md">
          <CardHeader className="bg-gold/5 border-b border-gold/20">
            <CardTitle className="text-brand flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gold" />
              Próximo Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {nextApp ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-brand">{nextApp.type}</h3>
                    <p className="text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4" /> {nextApp.date} às {nextApp.time}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-1 mt-1 text-sm">
                      <MapPin className="h-4 w-4" /> Clínica Zenith Saúde - Sala 04
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      nextApp.status === 'confirmado'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {nextApp.status}
                  </Badge>
                </div>

                {nextApp.status === 'pendente' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      className="flex-1 bg-gold hover:bg-yellow-600 text-white shadow-sm"
                      onClick={() => updateAppointmentStatus(nextApp.id, 'confirmado')}
                    >
                      Confirmar Presença
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => updateAppointmentStatus(nextApp.id, 'cancelado')}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
                {nextApp.status === 'confirmado' && (
                  <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg flex items-center gap-2 text-sm font-medium mt-4">
                    <CheckCircle2 className="h-5 w-5" />
                    Presença Confirmada. Aguardamos você!
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Você não tem agendamentos futuros.</p>
                <Button variant="link" className="text-brand mt-2">
                  Agendar Nova Sessão
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-brand flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand" />
              Minhas Prescrições
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prescriptionsData.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-brand/10 p-2 rounded-lg text-brand">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-brand">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.doctor} • {doc.date}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-brand hover:bg-blue-50"
                    title="Baixar PDF"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full text-brand mt-4">
              Ver todas prescrições
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-brand">Histórico de Sessões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative border-l-2 border-brand/20 ml-3 md:ml-4 space-y-8 pb-4">
            {timelineData.map((item, index) => (
              <div key={item.id} className="relative pl-6 md:pl-8">
                <div className="absolute w-4 h-4 bg-gold rounded-full -left-[9px] top-1 border-4 border-white shadow-sm"></div>
                <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                    {item.date}
                  </span>
                  <h4 className="text-lg font-bold text-brand mt-1">{item.title}</h4>
                  <p className="text-slate-600 mt-2 text-sm">{item.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
