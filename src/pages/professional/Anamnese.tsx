import { useState } from 'react'
import { Printer, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { anamesiService } from '@/services/anamesiService'
import logoUrl from '@/assets/logomarca-kronos-gest-5cdc9.jpeg'

export default function Anamnese() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    altura: '',
    peso: '',
    queixa_principal: '',
    hma: '',
    hmp: '',
    habitos: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await anamesiService.saveAnamnese({
        ...formData,
        altura: formData.altura ? parseFloat(formData.altura) : null,
        peso: formData.peso ? parseFloat(formData.peso) : null,
      })
      toast({ title: 'Sucesso', description: 'Anamnese salva com sucesso no prontuário!' })
    } catch (error: any) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-background">
      <style>{`
        @media print {
          body, html { height: auto !important; overflow: visible !important; }
          nav, aside, header { display: none !important; }
          .print-hide { display: none !important; }
          .print-container { padding: 0 !important; margin: 0 !important; box-shadow: none !important; }
          textarea { resize: none; overflow: visible; height: auto !important; border: none; padding: 0; min-height: fit-content; }
          input { border: none !important; padding: 0 !important; }
        }
      `}</style>

      <div className="flex justify-between items-center mb-6 print-hide">
        <h1 className="text-3xl font-bold">Anamnese Clínica</h1>
        <div className="space-x-2 flex">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="mr-2 h-4 w-4" /> {loading ? 'Salvando...' : 'Salvar Anamnese'}
          </Button>
        </div>
      </div>

      <div className="hidden print:flex flex-col items-center justify-center border-b pb-6 mb-8">
        <img src={logoUrl} alt="KronosGest Logo" className="w-24 h-24 object-contain mb-4" />
        <h2 className="text-2xl font-bold uppercase tracking-wider">
          KronosGest Clínica Integrativa
        </h2>
        <p className="text-sm text-gray-600">Documento Oficial de Anamnese</p>
      </div>

      <div className="space-y-6 print-container">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-medium text-sm">Altura (m)</label>
            <Input
              type="number"
              step="0.01"
              value={formData.altura}
              onChange={(e) => handleChange('altura', e.target.value)}
              placeholder="Ex: 1.75"
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium text-sm">Peso (kg)</label>
            <Input
              type="number"
              step="0.1"
              value={formData.peso}
              onChange={(e) => handleChange('peso', e.target.value)}
              placeholder="Ex: 70.5"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-medium">Queixa Principal</label>
          <Textarea
            value={formData.queixa_principal}
            onChange={(e) => handleChange('queixa_principal', e.target.value)}
            rows={3}
            placeholder="Descreva a queixa principal do paciente..."
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium">História da Moléstia Atual (HMA)</label>
          <Textarea
            value={formData.hma}
            onChange={(e) => handleChange('hma', e.target.value)}
            rows={5}
            placeholder="Evolução, início dos sintomas..."
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium">História Médica Pregressa (HMP)</label>
          <Textarea
            value={formData.hmp}
            onChange={(e) => handleChange('hmp', e.target.value)}
            rows={4}
            placeholder="Doenças prévias, cirurgias, alergias..."
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium">Hábitos de Vida</label>
          <Textarea
            value={formData.habitos}
            onChange={(e) => handleChange('habitos', e.target.value)}
            rows={4}
            placeholder="Alimentação, sono, atividade física, tabagismo, etilismo..."
          />
        </div>
      </div>
    </div>
  )
}
