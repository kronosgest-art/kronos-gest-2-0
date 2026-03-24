import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-brand">Configurações e Identidade Visual</h2>
      <Card>
        <CardHeader>
          <CardTitle>Cores da Clínica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cor Primária</Label>
              <div className="flex gap-2">
                <Input type="color" defaultValue="#1E3A8A" className="w-12 h-10 p-1" />
                <Input defaultValue="#1E3A8A" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cor Secundária</Label>
              <div className="flex gap-2">
                <Input type="color" defaultValue="#B8860B" className="w-12 h-10 p-1" />
                <Input defaultValue="#B8860B" />
              </div>
            </div>
          </div>
          <Button className="bg-brand text-white mt-4">Salvar Configurações</Button>
        </CardContent>
      </Card>
    </div>
  )
}
