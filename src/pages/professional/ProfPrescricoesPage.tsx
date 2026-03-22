import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Trash2, Loader2, Plus, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

export default function ProfPrescricoesPage() {
  const navigate = useNavigate()
  const { profile, user } = useAuth()
  const { toast } = useToast()

  const [prescricoes, setPrescricoes] = useState<any[]>([])
  const [pacientes, setPacientes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [novaPrescricao, setNovaPrescricao] = useState({
    paciente_id: '',
    tipo_prescricao: 'Suplementação',
    observacoes: '',
    data_prescricao: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (profile?.organization_id) {
      loadData()
    }
  }, [profile])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [prescRes, pacRes] = await Promise.all([
        supabase
          .from('prescricoes')
          .select('*, pacientes(nome)')
          .eq('organization_id', profile!.organization_id)
          .order('data_prescricao', { ascending: false }),
        supabase
          .from('pacientes')
          .select('id, nome')
          .eq('organization_id', profile!.organization_id)
          .order('nome'),
      ])

      if (prescRes.data) setPrescricoes(prescRes.data)
      if (pacRes.data) setPacientes(pacRes.data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!novaPrescricao.paciente_id) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Selecione um paciente.' })
      return
    }

    setIsSaving(true)
    try {
      const { error } = await supabase.from('prescricoes').insert([
        {
          organization_id: profile!.organization_id,
          paciente_id: novaPrescricao.paciente_id,
          profissional_id: user?.id,
          tipo_prescricao: novaPrescricao.tipo_prescricao,
          data_prescricao: novaPrescricao.data_prescricao,
          observacoes: novaPrescricao.observacoes,
          status: 'Finalizada',
        },
      ])

      if (error) throw error

      toast({ title: 'Sucesso', description: 'Prescrição salva com sucesso.' })
      setIsDialogOpen(false)
      loadData()
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir prescrição permanentemente?')) return

    try {
      const { error } = await supabase.from('prescricoes').delete().eq('id', id)
      if (error) throw error
      toast({ title: 'Excluída', description: 'Prescrição removida.' })
      setPrescricoes(prescricoes.filter((p) => p.id !== id))
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message })
    }
  }

  const handlePrint = (id: string) => {
    // In a real app, this would generate a PDF or open a print-friendly view.
    // For now, we simulate the action.
    toast({
      title: 'Preparando Impressão',
      description: 'A prescrição está sendo gerada com a identidade visual da clínica.',
    })
    setTimeout(() => {
      window.print()
    }, 500)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/prof/dashboard')}
            className="text-brand"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-brand">Prescrições</h2>
            <p className="text-muted-foreground text-sm">
              Crie e gerencie prescrições personalizadas.
            </p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand hover:bg-brand/90 text-white shadow-md">
              <Plus className="mr-2 h-4 w-4" /> Nova Prescrição
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Emitir Prescrição</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Paciente</Label>
                <Select
                  value={novaPrescricao.paciente_id}
                  onValueChange={(v) => setNovaPrescricao({ ...novaPrescricao, paciente_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pacientes.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={novaPrescricao.tipo_prescricao}
                    onValueChange={(v) =>
                      setNovaPrescricao({ ...novaPrescricao, tipo_prescricao: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Suplementação">Suplementação</SelectItem>
                      <SelectItem value="Protocolo">Protocolo</SelectItem>
                      <SelectItem value="Recomendação">Recomendação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Input
                    type="date"
                    value={novaPrescricao.data_prescricao}
                    onChange={(e) =>
                      setNovaPrescricao({ ...novaPrescricao, data_prescricao: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Prescrição / Formulação</Label>
                <Textarea
                  placeholder="Escreva os itens da prescrição aqui..."
                  className="min-h-[150px]"
                  value={novaPrescricao.observacoes}
                  onChange={(e) =>
                    setNovaPrescricao({ ...novaPrescricao, observacoes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-brand text-white">
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                Salvar Prescrição
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Prescrições</CardTitle>
          <CardDescription>Prescrições emitidas recentemente.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
          ) : prescricoes.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              Nenhuma prescrição encontrada.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescricoes.map((presc) => (
                    <TableRow key={presc.id}>
                      <TableCell>
                        {new Date(presc.data_prescricao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="font-medium">{presc.pacientes?.nome}</TableCell>
                      <TableCell>{presc.tipo_prescricao}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">
                          {presc.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-brand"
                            title="Imprimir Receita"
                            onClick={() => handlePrint(presc.id)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={() => handleDelete(presc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
