export interface Organization {
  id: string
  nome_clinica: string
  cnpj_cpf?: string
  email_responsavel?: string
  plano_assinatura?: string
  status?: string
  valor_mensal?: number
}

export interface User {
  id: string
  organization_id?: string
  email: string
  nome?: string
  role?: string
  telefone?: string
  ativo?: boolean
}

export interface Patient {
  id: string
  organization_id: string
  user_id?: string
  nome: string
  email?: string
  telefone?: string
  cpf?: string
  data_nascimento?: string
  endereco?: string
  cidade?: string
  estado?: string
  profissao?: string
  alergias?: string
  peso?: number
  altura?: number
  imc?: number
  circunferencia_cintura?: number
  circunferencia_quadril?: number
  status?: string
  created_at?: string
}

export interface Anamnese {
  id?: string
  organization_id: string
  paciente_id: string
  profissional_id?: string
  queixa_principal?: string
  objetivos_tratamento?: string
  doencas_diagnosticadas?: string[]
  medicamentos_uso?: string[]
  alergias_sensibilidades?: string[]
  historico_familiar?: string[]
  observacoes_profissional?: string
  created_at?: string
  [key: string]: any
}

export interface Exam {
  id: string
  organization_id: string
  paciente_id: string
  profissional_id?: string
  tipo_exame?: string
  data_exame?: string
  arquivo_pdf_nome?: string
  arquivo_pdf_url?: string
  status_interpretacao?: string
  interpretacao_ia?: string
  created_at?: string
}

export interface Prescription {
  id?: string
  organization_id: string
  paciente_id: string
  profissional_id?: string
  tipo_prescricao: string
  observacoes?: string
  data_prescricao: string
  status?: string
  itens_prescricao?: any
  gerado_por_ia?: boolean
  pdf_url?: string
  created_at?: string
}

export interface Financial {
  id: string
  organization_id: string
  paciente_id?: string
  descricao: string
  valor: number
  tipo: string
  data_lancamento: string
  status: string
  created_at?: string
}
