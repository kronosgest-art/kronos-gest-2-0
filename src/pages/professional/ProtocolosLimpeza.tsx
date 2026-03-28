import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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
import { supabase } from '@/lib/supabase/client'

export default function ProtocolosLimpeza() {
  const { pacienteId } = useParams()
  const [protocolos, setProtocolos] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (pacienteId) fetchProtocolos()
  }, [pacienteId])

  const fetchProtocolos = async () => {
    const { data, error } = await supabase
      .from('protocolos_limpeza')
      .select('*')
      .eq('paciente_id', pacienteId)
      .order('created_at', { ascending: false })

    if (data) {
      setProtocolos(data)
    }
    if (error) {
      console.error('Erro ao buscar protocolos:', error)
    }
  }

  const handleOpenNew = () => {
    setEditingId(null)
    setNome('')
    setDescricao('')
    setIsOpen(true)
  }

  const handleOpenEdit = (prot: any) => {
    setEditingId(prot.id)
    setNome(prot.tipo_protocolo || 'Protocolo')
    setDescricao(prot.descricao || '')
    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!nome.trim()) {
      toast({
        title: 'Atenção',
        description: 'O nome do protocolo é obrigatório.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      if (editingId) {
        const { error } = await supabase
          .from('protocolos_limpeza')
          .update({ tipo_protocolo: nome, descricao, updated_at: new Date().toISOString() })
          .eq('id', editingId)

        if (error) throw error
        toast({ title: 'Sucesso', description: 'Protocolo atualizado com sucesso!' })
      } else {
        const { error } = await supabase.from('protocolos_limpeza').insert([
          {
            paciente_id: pacienteId,
            tipo_protocolo: nome,
            descricao,
            status: 'Ativo',
          },
        ])

        if (error) throw error
        toast({ title: 'Sucesso', description: 'Novo protocolo salvo com sucesso!' })
      }

      setIsOpen(false)
      fetchProtocolos() // Atualiza a lista imediatamente
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Protocolos de Limpeza</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os protocolos de desintoxicação e limpeza integrativa do paciente.
          </p>
        </div>
        <Button onClick={handleOpenNew}>
          <Plus className="w-4 h-4 mr-2" /> Novo Protocolo
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {protocolos.length === 0 ? (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl bg-muted/20">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Nenhum protocolo cadastrado
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Clique em "Novo Protocolo" para adicionar instruções para este paciente.
            </p>
            <Button variant="outline" onClick={handleOpenNew}>
              Criar Primeiro Protocolo
            </Button>
          </div>
        ) : (
          protocolos.map((prot) => (
            <div
              key={prot.id}
              className="p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <h3 className="font-semibold text-lg text-primary">{prot.tipo_protocolo}</h3>
              <p
                className="text-sm text-muted-foreground mt-3 flex-1 whitespace-pre-wrap overflow-hidden"
                style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}
              >
                {prot.descricao}
              </p>
              <div className="mt-4 pt-4 border-t border-border/50">
                <Button
                  variant="ghost"
                  className="w-full text-brand justify-center"
                  onClick={() => handleOpenEdit(prot)}
                >
                  Ver / Editar Detalhes
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar Protocolo de Limpeza' : 'Criar Novo Protocolo de Limpeza'}
            </DialogTitle>
            <DialogDescription>
              Defina as instruções e componentes do protocolo. As alterações serão salvas no
              prontuário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Protocolo</label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Limpeza Intestinal Profunda, Desparasitação..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição / Instruções / Posologia</label>
              <Textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o passo a passo, ingredientes e orientações detalhadas para o paciente..."
                className="min-h-[300px] leading-relaxed"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Protocolo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
