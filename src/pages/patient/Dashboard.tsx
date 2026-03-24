import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PatientDashboard() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-brand">Meu Painel de Saúde</h2>
      <Card>
        <CardHeader>
          <CardTitle>Próximas Consultas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Você não possui agendamentos futuros.</p>
        </CardContent>
      </Card>
    </div>
  )
}
