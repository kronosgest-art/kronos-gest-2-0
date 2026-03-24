import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'

export default function Appointments() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand">Agenda de Consultas</h2>
      <Card className="max-w-md">
        <CardContent className="p-4 flex justify-center">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </CardContent>
      </Card>
    </div>
  )
}
