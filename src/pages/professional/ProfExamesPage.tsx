import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, FileText, Trash2, Loader2, Plus } from 'lucide-react'
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

export default function ProfExamesPage() {
  const navigate = useNavigate()
  const { profile, user } = useAuth()
  const { toast } = useToast()

  const [exames, setExames] = useState<any[]>([])
  const [pacientes, setPacientes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [novoExame, setNovoExame] = useState({
    paciente_id: '',
    tipo_exame: 'sangue',
    data_exame: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (profile?.organization_id) {
      loadData()
    }
  }, [profile])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [examesRes, pacRes] = await Promise.all([
        supabase
          .from('exames')
          .select('*, pacientes(nome)')
          .eq('organization_id', profile!.organization_id)
          .order('data_exame', { ascending: false }),
        supabase
          .from('pacientes')
          .select('id, nome')
          .eq('organization_id', profile!.organization_id)
          .order('nome'),
      ])

      if (examesRes.data) setExames(examesRes.data)
      if (pacRes.data) setPacientes(pacRes.data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!novoExame.paciente_id) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Selecione um paciente.' })
      return
    }

    setIsUploading(true)
    try {
      const { error } = await supabase.from('exames').insert([
        {
          organization_id: profile!.organization_id,
          paciente_id: novoExame.paciente_id,
          profissional_id: user?.id,
          tipo_exame: novoExame.tipo_exame,
          data_exame: novoExame.data_exame,
          arquivo_pdf_nome: `exame_${novoExame.tipo_exame}_${new Date().getTime()}.pdf`,
          status_interpretacao: 'pendente',
        },
      ])

      if (error) throw error

      toast({ title: 'Sucesso', description: 'Exame registrado com sucesso.' })
      setIsDialogOpen(false)
      loadData()
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro ao salvar', description: error.message })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja realmente excluir este exame?')) return

    try {
      const { error } = await supabase.from('exames').delete().eq('id', id)
      if (error) throw error

      toast({ title: 'Excluído', description: 'Exame removido com sucesso.' })
      setExames(exames.filter((e) => e.id !== id))
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message })
    }
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
            <h2 className="text-2xl font-bold text-brand">Gestão de Exames</h2>
            <p className="text-muted-foreground text-sm">
              Armazene e analise os exames de seus pacientes.
            </p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand hover:bg-brand/90 text-white shadow-md">
              <Plus className="mr-2 h-4 w-4" /> Novo Exame
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Novo Exame</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Paciente</Label>
                <Select
                  value={novoExame.paciente_id}
                  onValueChange={(v) => setNovoExame({ ...novoExame, paciente_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
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
              <div className="space-y-2">
                <Label>Tipo de Exame</Label>
                <Select
                  value={novoExame.tipo_exame}
                  onValueChange={(v) => setNovoExame({ ...novoExame, tipo_exame: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sangue">Exame de Sangue</SelectItem>
                    <SelectItem value="imagem">Exame de Imagem</SelectItem>
                    <SelectItem value="biorressonancia">Biorressonância</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data do Exame</Label>
                <Input
                  type="date"
                  value={novoExame.data_exame}
                  onChange={(e) => setNovoExame({ ...novoExame, data_exame: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Arquivo (PDF/Imagem)</Label>
                <Input type="file" accept=".pdf,image/*" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpload} disabled={isUploading} className="bg-brand text-white">
                {isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Salvar Exame
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Exames</CardTitle>
          <CardDescription>Todos os exames registrados na clínica.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
          ) : exames.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">Nenhum exame encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status IA</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exames.map((exame) => (
                    <TableRow key={exame.id}>
                      <TableCell>
                        {new Date(exame.data_exame).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="font-medium">{exame.pacientes?.nome}</TableCell>
                      <TableCell className="capitalize">{exame.tipo_exame}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${exame.status_interpretacao === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 'bg-emerald-100 text-emerald-800'}`}
                        >
                          {exame.status_interpretacao || 'Pendente'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600"
                            title="Ver Documento"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={() => handleDelete(exame.id)}
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
