import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand">Admin Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total de Clínicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assinantes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">38</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
