import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { patientService } from '@/services/patientService'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FileText, ClipboardList, Pill } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

const ESTADOS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]

function isValidCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, '')
  if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
  let add = 0
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i)
  let rev = 11 - (add % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(cpf.charAt(9))) return false
  add = 0
  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i)
  rev = 11 - (add % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(cpf.charAt(10))) return false
  return true
}

const formatCPF = (val: string) => {
  let v = val.replace(/\D/g, '')
  if (v.length > 11) v = v.slice(0, 11)
  return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const formatPhone = (val: string) => {
  let v = val.replace(/\D/g, '')
  if (v.length > 11) v = v.slice(0, 11)
  if (v.length === 11) return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  return v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
}

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    endereco: '',
    cidade: '',
    estado: '',
    profissao: '',
    alergias: '',
  })

  useEffect(() => {
    if (id && id !== 'novo') {
      patientService
        .getById(id)
        .then((data) => {
          setFormData({
            nome: data.nome || '',
            cpf: data.cpf || '',
            email: data.email || '',
            telefone: data.telefone || '',
            data_nascimento: data.data_nascimento || '',
            endereco: data.endereco || '',
            cidade: data.cidade || '',
            estado: data.estado || '',
            profissao: data.profissao || '',
            alergias: data.alergias || '',
          })
        })
        .catch(console.error)
    }
  }, [id])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidCPF(formData.cpf)) {
      return toast({ variant: 'destructive', title: 'Erro', description: 'CPF inválido.' })
    }

    try {
      if (id === 'novo') {
        const { data: existingCpf } = await supabase
          .from('pacientes')
          .select('id')
          .eq('cpf', formData.cpf)
          .maybeSingle()
        if (existingCpf)
          return toast({ variant: 'destructive', title: 'Erro', description: 'CPF já cadastrado.' })

        if (formData.email) {
          const { data: existingEmail } = await supabase
            .from('pacientes')
            .select('id')
            .eq('email', formData.email)
            .maybeSingle()
          if (existingEmail)
            return toast({
              variant: 'destructive',
              title: 'Erro',
              description: 'Email já cadastrado.',
            })
        }

        await patientService.create({
          ...formData,
          organization_id: profile?.organization_id || '',
        })
        toast({ title: 'Sucesso', description: 'Paciente cadastrado com sucesso.' })
        navigate('/professional/patients')
      } else {
        const { data: existingCpf } = await supabase
          .from('pacientes')
          .select('id')
          .eq('cpf', formData.cpf)
          .neq('id', id)
          .maybeSingle()
        if (existingCpf)
          return toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'CPF já cadastrado em outro paciente.',
          })

        await patientService.update(id as string, formData)
        toast({ title: 'Sucesso', description: 'Dados do paciente atualizados.' })
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro', description: err.message })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/professional/patients')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h2 className="text-2xl font-bold text-[#1E3A8A]">
          {id === 'novo' ? 'Novo Paciente' : formData.nome}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">
                {id === 'novo' ? 'Cadastro' : 'Editar Dados'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      maxLength={100}
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      CPF <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Data de Nascimento <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      required
                      value={formData.data_nascimento}
                      onChange={(e) =>
                        setFormData({ ...formData, data_nascimento: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Telefone <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      required
                      value={formData.telefone}
                      onChange={(e) =>
                        setFormData({ ...formData, telefone: formatPhone(e.target.value) })
                      }
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Endereço</label>
                    <Input
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cidade</label>
                    <Input
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estado</label>
                    <Select
                      value={formData.estado}
                      onValueChange={(v) => setFormData({ ...formData, estado: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTADOS.map((uf) => (
                          <SelectItem key={uf} value={uf}>
                            {uf}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Profissão</label>
                    <Input
                      value={formData.profissao}
                      onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Alergias</label>
                    <Textarea
                      value={formData.alergias}
                      onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
                      placeholder="Descreva possíveis alergias..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="bg-[#B8860B] hover:bg-[#A0750A] text-white">
                    Salvar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-[#1E3A8A] hover:bg-[#152B6A] text-white"
                    onClick={() => navigate('/professional/patients')}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {id !== 'novo' && (
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1E3A8A]">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start text-[#1E3A8A] border-[#1E3A8A]/20 hover:bg-[#1E3A8A]/5"
                >
                  <Link to={`/professional/patients/${id}/anamesis`}>
                    <ClipboardList className="mr-2 h-4 w-4" /> Anamnese
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start text-[#1E3A8A] border-[#1E3A8A]/20 hover:bg-[#1E3A8A]/5"
                >
                  <Link to={`/professional/patients/${id}/exams`}>
                    <FileText className="mr-2 h-4 w-4" /> Exames
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start text-[#1E3A8A] border-[#1E3A8A]/20 hover:bg-[#1E3A8A]/5"
                >
                  <Link to={`/professional/patients/${id}/prescriptions`}>
                    <Pill className="mr-2 h-4 w-4" /> Prescrições
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
