import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export default function ProtocolosLimpeza() {
  const [isOpen, setIsOpen] = useState(false)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const { toast } = useToast()

  const handleSave = () => {
    if (!nome.trim()) {
      toast({
        title: 'Atenção',
        description: 'O nome do protocolo é obrigatório.',
        variant: 'destructive',
      })
      return
    }
    toast({ title: 'Sucesso', description: 'Protocolo salvo com sucesso!' })
    setIsOpen(false)
    setNome('')
    setDescricao('')
  }

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Protocolos de Limpeza</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus protocolos de desintoxicação e limpeza integrativa.
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Novo Protocolo
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for protocols list */}
        <div className="p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg">Limpeza Hepática</h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
            Protocolo padrão para desintoxicação do fígado e vesícula biliar. Inclui o uso de ácido
            málico, sais de epsom e azeite extra virgem.
          </p>
          <Button variant="link" className="mt-4 p-0 h-auto">
            Ver detalhes &rarr;
          </Button>
        </div>
        <div className="p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg">Desparasitação</h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
            Protocolo antiparasitário de 15 dias focado em tinturas herbais (Nogueira Negra,
            Absinto, Cravo) e modulação intestinal.
          </p>
          <Button variant="link" className="mt-4 p-0 h-auto">
            Ver detalhes &rarr;
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Novo Protocolo de Limpeza</DialogTitle>
            <DialogDescription>
              Defina as instruções e componentes do novo protocolo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Protocolo</label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Limpeza Intestinal Profunda"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição / Instruções / Posologia</label>
              <Textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o passo a passo, ingredientes e orientações para o paciente..."
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Protocolo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
