import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, User } from 'lucide-react'
import { ptBR } from 'date-fns/locale'

export default function ProfAgenda() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Mock slots for the selected day
  const timeSlots = [
    { time: '09:00', patient: 'Ana Silva', type: 'Terapia', status: 'confirmado' },
    { time: '10:00', patient: 'Disponível', type: '', status: 'livre' },
    { time: '11:00', patient: 'João Oliveira', type: 'Retorno', status: 'pendente' },
    { time: '14:00', patient: 'Mariana Costa', type: 'Avaliação', status: 'confirmado' },
    { time: '15:00', patient: 'Disponível', type: '', status: 'livre' },
    { time: '16:00', patient: 'Carlos Santos', type: 'Terapia', status: 'confirmado' },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-12 items-start">
      <div className="md:col-span-5 lg:col-span-4 space-y-6">
        <Card className="shadow-sm border-brand/10">
          <CardContent className="p-4 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-0 bg-transparent"
              locale={ptBR}
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-brand to-brand/90 text-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-blue-50">Resumo do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <span className="text-blue-200">Sessões Realizadas</span>
                <span className="font-bold text-xl">42</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <span className="text-blue-200">Cancelamentos</span>
                <span className="font-bold text-xl">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Novos Pacientes</span>
                <span className="font-bold text-xl text-gold">+8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-7 lg:col-span-8">
        <Card className="shadow-sm h-full">
          <CardHeader className="border-b bg-slate-50 flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-brand text-xl">Agenda do Dia</CardTitle>
              <p className="text-sm text-muted-foreground mt-1 capitalize">
                {date
                  ? date.toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })
                  : 'Selecione uma data'}
              </p>
            </div>
            <Button className="bg-gold hover:bg-yellow-600 text-white shadow-md">
              Bloquear Horário
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 w-32 shrink-0 text-slate-500 font-medium">
                    <Clock className="h-4 w-4" />
                    {slot.time}
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                    {slot.status === 'livre' ? (
                      <div className="text-slate-400 italic flex items-center gap-2">
                        Horário Disponível
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-brand">{slot.patient}</p>
                          <p className="text-sm text-muted-foreground">{slot.type}</p>
                        </div>
                      </div>
                    )}

                    <div>
                      {slot.status === 'livre' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-brand opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Agendar
                        </Button>
                      ) : (
                        <Badge
                          variant="secondary"
                          className={
                            slot.status === 'confirmado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {slot.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
