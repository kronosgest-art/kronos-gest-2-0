import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Loader2,
  Settings,
  Image as ImageIcon,
  Users,
  User,
  Palette,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ProfConfiguracoesPage() {
  const navigate = useNavigate()
  const { profile, user } = useAuth()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [orgData, setOrgData] = useState({
    nome_clinica: '',
    cnpj_cpf: '',
    email_responsavel: '',
  })

  const [userData, setUserData] = useState({
    nome: '',
    telefone: '',
  })

  useEffect(() => {
    if (profile?.organization_id && user?.id) {
      loadData()
    }
  }, [profile, user])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [orgRes, userRes] = await Promise.all([
        supabase.from('organizations').select('*').eq('id', profile!.organization_id).single(),
        supabase.from('users').select('*').eq('id', user!.id).single(),
      ])

      if (orgRes.data) {
        setOrgData({
          nome_clinica: orgRes.data.nome_clinica || '',
          cnpj_cpf: orgRes.data.cnpj_cpf || '',
          email_responsavel: orgRes.data.email_responsavel || '',
        })
      }

      if (userRes.data) {
        setUserData({
          nome: userRes.data.nome || '',
          telefone: userRes.data.telefone || '',
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveOrg = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('organizations')
        .update(orgData)
        .eq('id', profile!.organization_id)

      if (error) throw error
      toast({ title: 'Sucesso', description: 'Dados da clínica atualizados.' })
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveUser = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase.from('users').update(userData).eq('id', user!.id)

      if (error) throw error
      toast({ title: 'Sucesso', description: 'Dados do perfil atualizados.' })
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-3 border-b pb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/prof/dashboard')}
          className="text-brand"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-brand flex items-center gap-2">
            <Settings className="h-6 w-6 text-gold" /> Configurações do Sistema
          </h2>
          <p className="text-muted-foreground text-sm">
            Personalize a identidade da clínica e seus dados.
          </p>
        </div>
      </div>

      <Tabs defaultValue="identidade" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto gap-2 bg-transparent">
          <TabsTrigger
            value="identidade"
            className="data-[state=active]:bg-brand data-[state=active]:text-white border shadow-sm py-2"
          >
            <Palette className="mr-2 h-4 w-4" /> Identidade Visual
          </TabsTrigger>
          <TabsTrigger
            value="clinica"
            className="data-[state=active]:bg-brand data-[state=active]:text-white border shadow-sm py-2"
          >
            <Settings className="mr-2 h-4 w-4" /> Dados da Clínica
          </TabsTrigger>
          <TabsTrigger
            value="profissionais"
            className="data-[state=active]:bg-brand data-[state=active]:text-white border shadow-sm py-2"
          >
            <Users className="mr-2 h-4 w-4" /> Equipe
          </TabsTrigger>
          <TabsTrigger
            value="perfil"
            className="data-[state=active]:bg-brand data-[state=active]:text-white border shadow-sm py-2"
          >
            <User className="mr-2 h-4 w-4" /> Meu Perfil
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="identidade">
            <Card>
              <CardHeader>
                <CardTitle>Identidade Visual</CardTitle>
                <CardDescription>
                  Configure a logo e cores para impressões de receitas e relatórios.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Logo da Clínica</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 border-2 border-dashed rounded-xl flex items-center justify-center bg-slate-50 text-slate-400">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                    <Button variant="outline">Fazer Upload</Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-sm">
                  <div className="space-y-2">
                    <Label>Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="w-12 p-1 h-10" defaultValue="#1E3A8A" />
                      <Input type="text" value="#1E3A8A" readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Cor Secundária</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="w-12 p-1 h-10" defaultValue="#D4AF37" />
                      <Input type="text" value="#D4AF37" readOnly />
                    </div>
                  </div>
                </div>
                <Button className="bg-brand text-white mt-4">
                  <Save className="mr-2 h-4 w-4" /> Salvar Aparência
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clinica">
            <Card>
              <CardHeader>
                <CardTitle>Dados Administrativos da Clínica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da Clínica</Label>
                  <Input
                    value={orgData.nome_clinica}
                    onChange={(e) => setOrgData({ ...orgData, nome_clinica: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ / CPF</Label>
                  <Input
                    value={orgData.cnpj_cpf}
                    onChange={(e) => setOrgData({ ...orgData, cnpj_cpf: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>E-mail Responsável</Label>
                  <Input
                    value={orgData.email_responsavel}
                    onChange={(e) => setOrgData({ ...orgData, email_responsavel: e.target.value })}
                  />
                </div>
                <Button
                  onClick={handleSaveOrg}
                  disabled={isSaving}
                  className="bg-brand text-white mt-4"
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Salvar Dados
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profissionais">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Equipe</CardTitle>
                <CardDescription>
                  Adicione e gerencie os profissionais da sua organização.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl bg-slate-50">
                  <Users className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <p>
                    Módulo de gestão de equipe estará disponível no próximo ciclo de atualização.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <CardTitle>Meu Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input
                    value={userData.nome}
                    onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>E-mail de Login</Label>
                  <Input value={user?.email || ''} readOnly className="bg-slate-50" />
                  <p className="text-xs text-muted-foreground">
                    Para alterar o e-mail, acesse a redefinição de segurança.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={userData.telefone}
                    onChange={(e) => setUserData({ ...userData, telefone: e.target.value })}
                  />
                </div>
                <Button
                  onClick={handleSaveUser}
                  disabled={isSaving}
                  className="bg-brand text-white mt-4"
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Atualizar Perfil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
