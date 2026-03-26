// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          created_at: string | null
          data_hora: string | null
          duracao_minutos: number | null
          id: string
          motivo_cancelamento: string | null
          numero_sessoes: number | null
          organization_id: string
          paciente_id: string
          profissional_id: string | null
          status: string | null
          tipo_procedimento: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_hora?: string | null
          duracao_minutos?: number | null
          id?: string
          motivo_cancelamento?: string | null
          numero_sessoes?: number | null
          organization_id: string
          paciente_id: string
          profissional_id?: string | null
          status?: string | null
          tipo_procedimento?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_hora?: string | null
          duracao_minutos?: number | null
          id?: string
          motivo_cancelamento?: string | null
          numero_sessoes?: number | null
          organization_id?: string
          paciente_id?: string
          profissional_id?: string | null
          status?: string | null
          tipo_procedimento?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      anamesis: {
        Row: {
          assessment: string | null
          chief_complaint: string | null
          created_at: string | null
          custom_fields: Json | null
          family_history: string | null
          history_of_present_illness: string | null
          id: string
          organization_id: string
          past_medical_history: string | null
          patient_id: string
          physical_examination: string | null
          plan: string | null
          professional_id: string
          review_of_systems: string | null
          social_history: string | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          assessment?: string | null
          chief_complaint?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          family_history?: string | null
          history_of_present_illness?: string | null
          id?: string
          organization_id: string
          past_medical_history?: string | null
          patient_id: string
          physical_examination?: string | null
          plan?: string | null
          professional_id: string
          review_of_systems?: string | null
          social_history?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          assessment?: string | null
          chief_complaint?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          family_history?: string | null
          history_of_present_illness?: string | null
          id?: string
          organization_id?: string
          past_medical_history?: string | null
          patient_id?: string
          physical_examination?: string | null
          plan?: string | null
          professional_id?: string
          review_of_systems?: string | null
          social_history?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "anamesis_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamesis_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamesis_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      anamnese: {
        Row: {
          alergias_sensibilidades: Json | null
          alimentacao_descricao: string | null
          bebidas_acucaradas: string | null
          cabelo_problemas: Json | null
          cardiovascular: Json | null
          cirurgias_internacoes: string | null
          consome_gluten: boolean | null
          consome_laticinios: boolean | null
          consumo_agua_litros: number | null
          consumo_alcool: string | null
          consumo_cafe: string | null
          corporal_problemas: Json | null
          created_at: string | null
          data_termo_consentimento: string | null
          dificuldade_sono: Json | null
          doencas_diagnosticadas: Json | null
          duracao_atividade: string | null
          endocrina: Json | null
          exposicao_quimicos: boolean | null
          fontes_estresse: Json | null
          frequencia_acucares: string | null
          frequencia_atividade: string | null
          frequencia_carnes_vermelhas: string | null
          frequencia_farinaceos: string | null
          frequencia_frituras: string | null
          frequencia_peixes: string | null
          frequencia_ultraprocessados: string | null
          gastrointestinal: Json | null
          hepatica: Json | null
          historico_familiar: Json | null
          hobbies_relaxantes: string | null
          horas_sono: number | null
          id: string
          identidade_genero: string | null
          imunologica: Json | null
          medicamentos_uso: Json | null
          moradia_poluicao: boolean | null
          nervosa: Json | null
          nivel_estresse: string | null
          objetivos_tratamento: string | null
          observacoes_profissional: string | null
          olhos_problemas: Json | null
          organization_id: string
          ossea_articular: Json | null
          paciente_id: string
          pancreatica: Json | null
          pele_problemas: Json | null
          porcoes_frutas: string | null
          porcoes_vegetais: string | null
          pratica_atividade_fisica: boolean | null
          problemas_saude_mental: Json | null
          profissao: string | null
          profissional_id: string | null
          pulmonar: Json | null
          queixa_principal: string | null
          renal: Json | null
          restricoes_alimentares: string | null
          rotina_cuidados_pele: string | null
          sexo_biologico: string | null
          suplementos_uso: Json | null
          tabagismo: string | null
          termo_consentimento_aceito: boolean | null
          tipo_atividade_fisica: string | null
          tipo_pele: string | null
          unhas_problemas: Json | null
          updated_at: string | null
          usa_cosmeticos_quimicos: boolean | null
          usa_panelas_aluminio: boolean | null
        }
        Insert: {
          alergias_sensibilidades?: Json | null
          alimentacao_descricao?: string | null
          bebidas_acucaradas?: string | null
          cabelo_problemas?: Json | null
          cardiovascular?: Json | null
          cirurgias_internacoes?: string | null
          consome_gluten?: boolean | null
          consome_laticinios?: boolean | null
          consumo_agua_litros?: number | null
          consumo_alcool?: string | null
          consumo_cafe?: string | null
          corporal_problemas?: Json | null
          created_at?: string | null
          data_termo_consentimento?: string | null
          dificuldade_sono?: Json | null
          doencas_diagnosticadas?: Json | null
          duracao_atividade?: string | null
          endocrina?: Json | null
          exposicao_quimicos?: boolean | null
          fontes_estresse?: Json | null
          frequencia_acucares?: string | null
          frequencia_atividade?: string | null
          frequencia_carnes_vermelhas?: string | null
          frequencia_farinaceos?: string | null
          frequencia_frituras?: string | null
          frequencia_peixes?: string | null
          frequencia_ultraprocessados?: string | null
          gastrointestinal?: Json | null
          hepatica?: Json | null
          historico_familiar?: Json | null
          hobbies_relaxantes?: string | null
          horas_sono?: number | null
          id?: string
          identidade_genero?: string | null
          imunologica?: Json | null
          medicamentos_uso?: Json | null
          moradia_poluicao?: boolean | null
          nervosa?: Json | null
          nivel_estresse?: string | null
          objetivos_tratamento?: string | null
          observacoes_profissional?: string | null
          olhos_problemas?: Json | null
          organization_id: string
          ossea_articular?: Json | null
          paciente_id: string
          pancreatica?: Json | null
          pele_problemas?: Json | null
          porcoes_frutas?: string | null
          porcoes_vegetais?: string | null
          pratica_atividade_fisica?: boolean | null
          problemas_saude_mental?: Json | null
          profissao?: string | null
          profissional_id?: string | null
          pulmonar?: Json | null
          queixa_principal?: string | null
          renal?: Json | null
          restricoes_alimentares?: string | null
          rotina_cuidados_pele?: string | null
          sexo_biologico?: string | null
          suplementos_uso?: Json | null
          tabagismo?: string | null
          termo_consentimento_aceito?: boolean | null
          tipo_atividade_fisica?: string | null
          tipo_pele?: string | null
          unhas_problemas?: Json | null
          updated_at?: string | null
          usa_cosmeticos_quimicos?: boolean | null
          usa_panelas_aluminio?: boolean | null
        }
        Update: {
          alergias_sensibilidades?: Json | null
          alimentacao_descricao?: string | null
          bebidas_acucaradas?: string | null
          cabelo_problemas?: Json | null
          cardiovascular?: Json | null
          cirurgias_internacoes?: string | null
          consome_gluten?: boolean | null
          consome_laticinios?: boolean | null
          consumo_agua_litros?: number | null
          consumo_alcool?: string | null
          consumo_cafe?: string | null
          corporal_problemas?: Json | null
          created_at?: string | null
          data_termo_consentimento?: string | null
          dificuldade_sono?: Json | null
          doencas_diagnosticadas?: Json | null
          duracao_atividade?: string | null
          endocrina?: Json | null
          exposicao_quimicos?: boolean | null
          fontes_estresse?: Json | null
          frequencia_acucares?: string | null
          frequencia_atividade?: string | null
          frequencia_carnes_vermelhas?: string | null
          frequencia_farinaceos?: string | null
          frequencia_frituras?: string | null
          frequencia_peixes?: string | null
          frequencia_ultraprocessados?: string | null
          gastrointestinal?: Json | null
          hepatica?: Json | null
          historico_familiar?: Json | null
          hobbies_relaxantes?: string | null
          horas_sono?: number | null
          id?: string
          identidade_genero?: string | null
          imunologica?: Json | null
          medicamentos_uso?: Json | null
          moradia_poluicao?: boolean | null
          nervosa?: Json | null
          nivel_estresse?: string | null
          objetivos_tratamento?: string | null
          observacoes_profissional?: string | null
          olhos_problemas?: Json | null
          organization_id?: string
          ossea_articular?: Json | null
          paciente_id?: string
          pancreatica?: Json | null
          pele_problemas?: Json | null
          porcoes_frutas?: string | null
          porcoes_vegetais?: string | null
          pratica_atividade_fisica?: boolean | null
          problemas_saude_mental?: Json | null
          profissao?: string | null
          profissional_id?: string | null
          pulmonar?: Json | null
          queixa_principal?: string | null
          renal?: Json | null
          restricoes_alimentares?: string | null
          rotina_cuidados_pele?: string | null
          sexo_biologico?: string | null
          suplementos_uso?: Json | null
          tabagismo?: string | null
          termo_consentimento_aceito?: boolean | null
          tipo_atividade_fisica?: string | null
          tipo_pele?: string | null
          unhas_problemas?: Json | null
          updated_at?: string | null
          usa_cosmeticos_quimicos?: boolean | null
          usa_panelas_aluminio?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "anamnese_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnese_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnese_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      anamneses: {
        Row: {
          alergias: string
          cliente_id: string
          created_at: string | null
          habitos_vida: string
          historico_doencas: string
          id: string
          medicamentos_atuais: string
          objetivo_tratamento: string
          queixa_principal: string
          updated_at: string | null
        }
        Insert: {
          alergias: string
          cliente_id: string
          created_at?: string | null
          habitos_vida: string
          historico_doencas: string
          id?: string
          medicamentos_atuais: string
          objetivo_tratamento: string
          queixa_principal: string
          updated_at?: string | null
        }
        Update: {
          alergias?: string
          cliente_id?: string
          created_at?: string | null
          habitos_vida?: string
          historico_doencas?: string
          id?: string
          medicamentos_atuais?: string
          objetivo_tratamento?: string
          queixa_principal?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anamneses_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: true
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          organization_id: string
          patient_id: string
          professional_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          organization_id: string
          patient_id: string
          professional_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          organization_id?: string
          patient_id?: string
          professional_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          altura: number | null
          cpf: string | null
          created_at: string | null
          data_admissao: string | null
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          id: string
          idade: number | null
          imc: number | null
          nome: string
          observacoes: string | null
          peso: number | null
          profissional_responsavel: string | null
          rg: string | null
          sessoes_contratadas: number | null
          sexo: string | null
          status: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          altura?: number | null
          cpf?: string | null
          created_at?: string | null
          data_admissao?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          idade?: number | null
          imc?: number | null
          nome: string
          observacoes?: string | null
          peso?: number | null
          profissional_responsavel?: string | null
          rg?: string | null
          sessoes_contratadas?: number | null
          sexo?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          altura?: number | null
          cpf?: string | null
          created_at?: string | null
          data_admissao?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          idade?: number | null
          imc?: number | null
          nome?: string
          observacoes?: string | null
          peso?: number | null
          profissional_responsavel?: string | null
          rg?: string | null
          sessoes_contratadas?: number | null
          sexo?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      creditos_gastos: {
        Row: {
          created_at: string | null
          creditos_gastos: number | null
          descricao: string | null
          id: string
          organization_id: string
          tipo_operacao: string | null
        }
        Insert: {
          created_at?: string | null
          creditos_gastos?: number | null
          descricao?: string | null
          id?: string
          organization_id: string
          tipo_operacao?: string | null
        }
        Update: {
          created_at?: string | null
          creditos_gastos?: number | null
          descricao?: string | null
          id?: string
          organization_id?: string
          tipo_operacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creditos_gastos_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      credits_spent: {
        Row: {
          created_at: string | null
          credits_used: number
          description: string | null
          feature: string
          id: string
          organization_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credits_used: number
          description?: string | null
          feature: string
          id?: string
          organization_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          credits_used?: number
          description?: string | null
          feature?: string
          id?: string
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_spent_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_spent_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exames: {
        Row: {
          arquivo_pdf_nome: string | null
          arquivo_pdf_url: string | null
          ativos_alterados: Json | null
          created_at: string | null
          data_exame: string | null
          data_interpretacao: string | null
          id: string
          interpretacao_ia: string | null
          organization_id: string
          paciente_id: string
          profissional_id: string | null
          sistemas_alterados: Json | null
          status_interpretacao: string | null
          tamanho_arquivo: number | null
          tipo_exame: string | null
          updated_at: string | null
        }
        Insert: {
          arquivo_pdf_nome?: string | null
          arquivo_pdf_url?: string | null
          ativos_alterados?: Json | null
          created_at?: string | null
          data_exame?: string | null
          data_interpretacao?: string | null
          id?: string
          interpretacao_ia?: string | null
          organization_id: string
          paciente_id: string
          profissional_id?: string | null
          sistemas_alterados?: Json | null
          status_interpretacao?: string | null
          tamanho_arquivo?: number | null
          tipo_exame?: string | null
          updated_at?: string | null
        }
        Update: {
          arquivo_pdf_nome?: string | null
          arquivo_pdf_url?: string | null
          ativos_alterados?: Json | null
          created_at?: string | null
          data_exame?: string | null
          data_interpretacao?: string | null
          id?: string
          interpretacao_ia?: string | null
          organization_id?: string
          paciente_id?: string
          profissional_id?: string | null
          sistemas_alterados?: Json | null
          status_interpretacao?: string | null
          tamanho_arquivo?: number | null
          tipo_exame?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exames_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exames_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exames_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exames_biofisicos: {
        Row: {
          arquivo_url: string
          created_at: string | null
          data_exame: string
          id: string
          interpretacao_ia: string | null
          nome_exame: string | null
          paciente_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          arquivo_url: string
          created_at?: string | null
          data_exame: string
          id?: string
          interpretacao_ia?: string | null
          nome_exame?: string | null
          paciente_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          arquivo_url?: string
          created_at?: string | null
          data_exame?: string
          id?: string
          interpretacao_ia?: string | null
          nome_exame?: string | null
          paciente_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exames_biofisicos_cliente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      exames_bioquimicos: {
        Row: {
          arquivo_url: string
          created_at: string
          data_exame: string
          id: string
          interpretacao_ia: string | null
          nome_exame: string
          paciente_id: string
          status: string
          updated_at: string
        }
        Insert: {
          arquivo_url: string
          created_at?: string
          data_exame: string
          id?: string
          interpretacao_ia?: string | null
          nome_exame: string
          paciente_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          arquivo_url?: string
          created_at?: string
          data_exame?: string
          id?: string
          interpretacao_ia?: string | null
          nome_exame?: string
          paciente_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exames_bioquimicos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          created_at: string | null
          exam_date: string | null
          exam_name: string
          exam_type: string
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          notes: string | null
          organization_id: string
          patient_id: string
          professional_id: string
          results: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          exam_date?: string | null
          exam_name: string
          exam_type: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          patient_id: string
          professional_id: string
          results?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          exam_date?: string | null
          exam_name?: string
          exam_type?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          patient_id?: string
          professional_id?: string
          results?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exams_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exams_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exams_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro: {
        Row: {
          agendamento_id: string | null
          created_at: string
          data_lancamento: string
          descricao: string
          forma_pagamento: string | null
          id: string
          organization_id: string | null
          paciente_id: string | null
          status: string
          tipo: string
          tipo_lancamento: string | null
          updated_at: string
          valor: number
        }
        Insert: {
          agendamento_id?: string | null
          created_at?: string
          data_lancamento?: string
          descricao: string
          forma_pagamento?: string | null
          id?: string
          organization_id?: string | null
          paciente_id?: string | null
          status?: string
          tipo: string
          tipo_lancamento?: string | null
          updated_at?: string
          valor?: number
        }
        Update: {
          agendamento_id?: string | null
          created_at?: string
          data_lancamento?: string
          descricao?: string
          forma_pagamento?: string | null
          id?: string
          organization_id?: string | null
          paciente_id?: string | null
          status?: string
          tipo?: string
          tipo_lancamento?: string | null
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_agendamento_id_fkey"
            columns: ["agendamento_id"]
            isOneToOne: false
            referencedRelation: "agendamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financeiro_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financeiro_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      financial: {
        Row: {
          amount: number
          appointment_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          organization_id: string
          paid_date: string | null
          patient_id: string | null
          payment_method: string | null
          status: string | null
          transaction_type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          organization_id: string
          paid_date?: string | null
          patient_id?: string | null
          payment_method?: string | null
          status?: string | null
          transaction_type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          organization_id?: string
          paid_date?: string | null
          patient_id?: string | null
          payment_method?: string | null
          status?: string | null
          transaction_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          cnpj_cpf: string | null
          created_at: string | null
          data_inicio_assinatura: string | null
          data_proxima_cobranca: string | null
          email_responsavel: string | null
          gastos_creditos_mes: number | null
          id: string
          nome_clinica: string
          plano_assinatura: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          valor_mensal: number | null
        }
        Insert: {
          cnpj_cpf?: string | null
          created_at?: string | null
          data_inicio_assinatura?: string | null
          data_proxima_cobranca?: string | null
          email_responsavel?: string | null
          gastos_creditos_mes?: number | null
          id?: string
          nome_clinica: string
          plano_assinatura?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          valor_mensal?: number | null
        }
        Update: {
          cnpj_cpf?: string | null
          created_at?: string | null
          data_inicio_assinatura?: string | null
          data_proxima_cobranca?: string | null
          email_responsavel?: string | null
          gastos_creditos_mes?: number | null
          id?: string
          nome_clinica?: string
          plano_assinatura?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          valor_mensal?: number | null
        }
        Relationships: []
      }
      pacientes: {
        Row: {
          alergias: string | null
          altura: number | null
          cidade: string | null
          circunferencia_cintura: number | null
          circunferencia_quadril: number | null
          cpf: string | null
          created_at: string | null
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          foto_url: string | null
          id: string
          imc: number | null
          nome: string
          organization_id: string
          peso: number | null
          profissao: string | null
          razao_cintura_quadril: number | null
          status: string | null
          telefone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alergias?: string | null
          altura?: number | null
          cidade?: string | null
          circunferencia_cintura?: number | null
          circunferencia_quadril?: number | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          foto_url?: string | null
          id?: string
          imc?: number | null
          nome: string
          organization_id: string
          peso?: number | null
          profissao?: string | null
          razao_cintura_quadril?: number | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alergias?: string | null
          altura?: number | null
          cidade?: string | null
          circunferencia_cintura?: number | null
          circunferencia_quadril?: number | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          foto_url?: string | null
          id?: string
          imc?: number | null
          nome?: string
          organization_id?: string
          peso?: number | null
          profissao?: string | null
          razao_cintura_quadril?: number | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pacientes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          allergies: string | null
          city: string | null
          cpf: string | null
          created_at: string | null
          current_medications: string | null
          date_of_birth: string | null
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          full_name: string
          gender: string | null
          id: string
          marital_status: string | null
          medical_history: string | null
          occupation: string | null
          organization_id: string
          phone: string | null
          professional_id: string
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          allergies?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          current_medications?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name: string
          gender?: string | null
          id?: string
          marital_status?: string | null
          medical_history?: string | null
          occupation?: string | null
          organization_id: string
          phone?: string | null
          professional_id: string
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          allergies?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          current_medications?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          marital_status?: string | null
          medical_history?: string | null
          occupation?: string | null
          organization_id?: string
          phone?: string | null
          professional_id?: string
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prescricoes: {
        Row: {
          ativos: Json | null
          created_at: string | null
          data_geracao_ia: string | null
          data_geracao_pdf: string | null
          data_prescricao: string
          descricao: string | null
          dosagem: string | null
          duracao: string | null
          editado_pelo_profissional: boolean | null
          exame_id: string | null
          frequencia: string | null
          gerada_por_ia: boolean | null
          gerado_por_ia: boolean | null
          id: string
          itens_prescricao: Json | null
          observacoes: string | null
          organization_id: string | null
          paciente_id: string
          pdf_url: string | null
          profissional_id: string | null
          status: string | null
          tipo_prescricao: string
          updated_at: string | null
        }
        Insert: {
          ativos?: Json | null
          created_at?: string | null
          data_geracao_ia?: string | null
          data_geracao_pdf?: string | null
          data_prescricao: string
          descricao?: string | null
          dosagem?: string | null
          duracao?: string | null
          editado_pelo_profissional?: boolean | null
          exame_id?: string | null
          frequencia?: string | null
          gerada_por_ia?: boolean | null
          gerado_por_ia?: boolean | null
          id?: string
          itens_prescricao?: Json | null
          observacoes?: string | null
          organization_id?: string | null
          paciente_id: string
          pdf_url?: string | null
          profissional_id?: string | null
          status?: string | null
          tipo_prescricao: string
          updated_at?: string | null
        }
        Update: {
          ativos?: Json | null
          created_at?: string | null
          data_geracao_ia?: string | null
          data_geracao_pdf?: string | null
          data_prescricao?: string
          descricao?: string | null
          dosagem?: string | null
          duracao?: string | null
          editado_pelo_profissional?: boolean | null
          exame_id?: string | null
          frequencia?: string | null
          gerada_por_ia?: boolean | null
          gerado_por_ia?: boolean | null
          id?: string
          itens_prescricao?: Json | null
          observacoes?: string | null
          organization_id?: string | null
          paciente_id?: string
          pdf_url?: string | null
          profissional_id?: string | null
          status?: string | null
          tipo_prescricao?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescricoes_cliente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescricoes_exame_id_fkey"
            columns: ["exame_id"]
            isOneToOne: false
            referencedRelation: "exames"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescricoes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescricoes_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string | null
          dosage: string | null
          duration: string | null
          frequency: string | null
          id: string
          instructions: string | null
          medication_name: string
          organization_id: string
          patient_id: string
          prescribed_date: string | null
          professional_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dosage?: string | null
          duration?: string | null
          frequency?: string | null
          id?: string
          instructions?: string | null
          medication_name: string
          organization_id: string
          patient_id: string
          prescribed_date?: string | null
          professional_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dosage?: string | null
          duration?: string | null
          frequency?: string | null
          id?: string
          instructions?: string | null
          medication_name?: string
          organization_id?: string
          patient_id?: string
          prescribed_date?: string | null
          professional_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      protocolos_limpeza: {
        Row: {
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          duracao_dias: number | null
          etapas: Json | null
          frequencia: string | null
          gerado_por_ia: boolean | null
          id: string
          orientacoes: string | null
          paciente_id: string
          status: string | null
          tipo_protocolo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          duracao_dias?: number | null
          etapas?: Json | null
          frequencia?: string | null
          gerado_por_ia?: boolean | null
          id?: string
          orientacoes?: string | null
          paciente_id: string
          status?: string | null
          tipo_protocolo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          duracao_dias?: number | null
          etapas?: Json | null
          frequencia?: string | null
          gerado_por_ia?: boolean | null
          id?: string
          orientacoes?: string | null
          paciente_id?: string
          status?: string | null
          tipo_protocolo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocolos_limpeza_cliente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      recebimentos: {
        Row: {
          created_at: string | null
          data_pagamento: string
          id: string
          status: string
          valor_pago: number
          venda_id: string
        }
        Insert: {
          created_at?: string | null
          data_pagamento?: string
          id?: string
          status?: string
          valor_pago?: number
          venda_id: string
        }
        Update: {
          created_at?: string | null
          data_pagamento?: string
          id?: string
          status?: string
          valor_pago?: number
          venda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recebimentos_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      sessoes: {
        Row: {
          assinatura_digital: string | null
          created_at: string | null
          data_sessao: string
          evolucao_clinica: string | null
          hora_sessao: string
          id: string
          paciente_id: string
          profissional_responsavel: string
          status: string
          tipo_sessao: string
          updated_at: string | null
        }
        Insert: {
          assinatura_digital?: string | null
          created_at?: string | null
          data_sessao: string
          evolucao_clinica?: string | null
          hora_sessao: string
          id?: string
          paciente_id: string
          profissional_responsavel: string
          status?: string
          tipo_sessao: string
          updated_at?: string | null
        }
        Update: {
          assinatura_digital?: string | null
          created_at?: string | null
          data_sessao?: string
          evolucao_clinica?: string | null
          hora_sessao?: string
          id?: string
          paciente_id?: string
          profissional_responsavel?: string
          status?: string
          tipo_sessao?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessoes_cliente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          data_inicio: string | null
          data_proxima_cobranca: string | null
          id: string
          organization_id: string
          plano: string | null
          status: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          valor_mensal: number | null
        }
        Insert: {
          created_at?: string | null
          data_inicio?: string | null
          data_proxima_cobranca?: string | null
          id?: string
          organization_id: string
          plano?: string | null
          status?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          valor_mensal?: number | null
        }
        Update: {
          created_at?: string | null
          data_inicio?: string | null
          data_proxima_cobranca?: string | null
          id?: string
          organization_id?: string
          plano?: string | null
          status?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          valor_mensal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          data_nascimento: string | null
          email: string
          foto_url: string | null
          id: string
          nome: string | null
          organization_id: string | null
          role: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          data_nascimento?: string | null
          email: string
          foto_url?: string | null
          id: string
          nome?: string | null
          organization_id?: string | null
          role?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string
          foto_url?: string | null
          id?: string
          nome?: string | null
          organization_id?: string | null
          role?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          created_at: string
          email: string
          id: string
          status: string
          stripe_customer_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          status?: string
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vendas: {
        Row: {
          cliente_id: string
          created_at: string | null
          data_venda: string
          descricao: string | null
          id: string
          servico_id: string | null
          updated_at: string | null
          valor: number
        }
        Insert: {
          cliente_id: string
          created_at?: string | null
          data_venda?: string
          descricao?: string | null
          id?: string
          servico_id?: string | null
          updated_at?: string | null
          valor?: number
        }
        Update: {
          cliente_id?: string
          created_at?: string | null
          data_venda?: string
          descricao?: string | null
          id?: string
          servico_id?: string | null
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_org: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: agendamentos
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   paciente_id: uuid (not null)
//   profissional_id: uuid (nullable)
//   tipo_procedimento: text (nullable)
//   data_hora: timestamp with time zone (nullable)
//   duracao_minutos: integer (nullable)
//   numero_sessoes: integer (nullable)
//   status: text (nullable, default: 'agendado'::text)
//   motivo_cancelamento: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: anamesis
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   patient_id: uuid (not null)
//   professional_id: uuid (not null)
//   chief_complaint: text (nullable)
//   history_of_present_illness: text (nullable)
//   past_medical_history: text (nullable)
//   family_history: text (nullable)
//   social_history: text (nullable)
//   review_of_systems: text (nullable)
//   physical_examination: text (nullable)
//   assessment: text (nullable)
//   plan: text (nullable)
//   custom_fields: jsonb (nullable)
//   version: integer (nullable, default: 1)
//   created_at: timestamp without time zone (nullable, default: CURRENT_TIMESTAMP)
//   updated_at: timestamp without time zone (nullable, default: CURRENT_TIMESTAMP)
// Table: anamnese
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   paciente_id: uuid (not null)
//   profissional_id: uuid (nullable)
//   sexo_biologico: text (nullable)
//   identidade_genero: text (nullable)
//   profissao: text (nullable)
//   queixa_principal: text (nullable)
//   objetivos_tratamento: text (nullable)
//   doencas_diagnosticadas: jsonb (nullable, default: '[]'::jsonb)
//   medicamentos_uso: jsonb (nullable, default: '[]'::jsonb)
//   suplementos_uso: jsonb (nullable, default: '[]'::jsonb)
//   cirurgias_internacoes: text (nullable)
//   alergias_sensibilidades: jsonb (nullable, default: '[]'::jsonb)
//   historico_familiar: jsonb (nullable, default: '[]'::jsonb)
//   cardiovascular: jsonb (nullable, default: '{}'::jsonb)
//   gastrointestinal: jsonb (nullable, default: '{}'::jsonb)
//   hepatica: jsonb (nullable, default: '{}'::jsonb)
//   pancreatica: jsonb (nullable, default: '{}'::jsonb)
//   renal: jsonb (nullable, default: '{}'::jsonb)
//   pulmonar: jsonb (nullable, default: '{}'::jsonb)
//   nervosa: jsonb (nullable, default: '{}'::jsonb)
//   ossea_articular: jsonb (nullable, default: '{}'::jsonb)
//   endocrina: jsonb (nullable, default: '{}'::jsonb)
//   imunologica: jsonb (nullable, default: '{}'::jsonb)
//   alimentacao_descricao: text (nullable)
//   frequencia_ultraprocessados: text (nullable)
//   frequencia_acucares: text (nullable)
//   frequencia_farinaceos: text (nullable)
//   frequencia_frituras: text (nullable)
//   frequencia_carnes_vermelhas: text (nullable)
//   frequencia_peixes: text (nullable)
//   porcoes_frutas: text (nullable)
//   porcoes_vegetais: text (nullable)
//   consome_laticinios: boolean (nullable)
//   consome_gluten: boolean (nullable)
//   restricoes_alimentares: text (nullable)
//   consumo_agua_litros: numeric (nullable)
//   bebidas_acucaradas: text (nullable)
//   consumo_cafe: text (nullable)
//   horas_sono: numeric (nullable)
//   dificuldade_sono: jsonb (nullable, default: '[]'::jsonb)
//   nivel_estresse: text (nullable)
//   fontes_estresse: jsonb (nullable, default: '[]'::jsonb)
//   problemas_saude_mental: jsonb (nullable, default: '[]'::jsonb)
//   hobbies_relaxantes: text (nullable)
//   pratica_atividade_fisica: boolean (nullable)
//   tipo_atividade_fisica: text (nullable)
//   frequencia_atividade: text (nullable)
//   duracao_atividade: text (nullable)
//   tabagismo: text (nullable)
//   consumo_alcool: text (nullable)
//   exposicao_quimicos: boolean (nullable)
//   moradia_poluicao: boolean (nullable)
//   usa_cosmeticos_quimicos: boolean (nullable)
//   usa_panelas_aluminio: boolean (nullable)
//   pele_problemas: jsonb (nullable, default: '[]'::jsonb)
//   tipo_pele: text (nullable)
//   rotina_cuidados_pele: text (nullable)
//   cabelo_problemas: jsonb (nullable, default: '[]'::jsonb)
//   unhas_problemas: jsonb (nullable, default: '[]'::jsonb)
//   corporal_problemas: jsonb (nullable, default: '[]'::jsonb)
//   olhos_problemas: jsonb (nullable, default: '[]'::jsonb)
//   observacoes_profissional: text (nullable)
//   termo_consentimento_aceito: boolean (nullable, default: false)
//   data_termo_consentimento: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: anamneses
//   id: uuid (not null, default: gen_random_uuid())
//   cliente_id: uuid (not null)
//   queixa_principal: text (not null)
//   historico_doencas: text (not null)
//   medicamentos_atuais: text (not null)
//   alergias: text (not null)
//   habitos_vida: text (not null)
//   objetivo_tratamento: text (not null)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: appointments
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   patient_id: uuid (not null)
//   professional_id: uuid (not null)
//   appointment_date: timestamp without time zone (not null)
//   duration_minutes: integer (nullable, default: 60)
//   status: character varying (nullable, default: 'scheduled'::character varying)
//   notes: text (nullable)
//   created_at: timestamp without time zone (nullable, default: CURRENT_TIMESTAMP)
//   updated_at: timestamp without time zone (nullable, default: CURRENT_TIMESTAMP)
// Table: clientes
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   email: text (nullable)
//   telefone: text (nullable)
//   data_nascimento: date (nullable)
//   idade: integer (nullable)
//   cpf: text (nullable)
//   rg: text (nullable)
//   sexo: text (nullable)
//   endereco: text (nullable)
//   status: text (nullable, default: 'Ativo'::text)
//   profissional_responsavel: text (nullable)
//   data_admissao: date (nullable)
//   peso: numeric (nullable)
//   altura: numeric (nullable)
//   imc: numeric (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   sessoes_contratadas: integer (nullable, default: 0)
// Table: creditos_gastos
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   tipo_operacao: text (nullable)
//   creditos_gastos: numeric (nullable)
//   descricao: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: credits_spent
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   user_id: uuid (not null)
//   feature: character varying (not null)
//   credits_used: integer (not null)
//   description: text (nullable)
//   created_at: timestamp without time zone (nullable, default: CURRENT_TIMESTAMP)
// Table: exames
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   paciente_id: uuid (not null)
//   profissional_id: uuid (nullable)
//   tipo_exame: text (nullable)
//   data_exame: date (nullable)
//   arquivo_pdf_url: text (nullable)
//   arquivo_pdf_nome: text (nullable)
//   tamanho_arquivo: numeric (nullable)
//   interpretacao_ia: text (nullable)
//   status_interpretacao: text (nullable, default: 'pendente'::text)
//   data_interpretacao: timestamp with time zone (nullable)
//   sistemas_alterados: jsonb (nullable, default: '[]'::jsonb)
//   ativos_alterados: jsonb (nullable, default: '[]'::jsonb)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: exames_biofisicos
//   id: uuid (not null, default: gen_random_uuid())
//   paciente_id: uuid (not null)
//   nome_exame: text (nullable, default: 'Biorressonância'::text)
//   data_exame: date (not null)
//   arquivo_url: text (not null)
//   interpretacao_ia: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   status: text (not null, default: 'Pendente'::text)
// Table: exames_bioquimicos
//   id: uuid (not null, default: gen_random_uuid())
//   paciente_id: uuid (not null)
//   nome_exame: text (not null)
//   data_exame: date (not null)
//   arquivo_url: text (not null)
//   interpretacao_ia: text (nullable)
//   status: text (not null, default: 'Pendente'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: exams
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   patient_id: uuid (not null)
//   professional_id: uuid (not null)
//   exam_type: character varying (not null)
//   exam_name: character varying (not null)
//   exam_date: date (nullable)
//   file_url: text (nullable)
//   file_type: character varying (nullable)
//   file_size: integer (nullable)
//   results: text (nullable)
//   notes: text (nullable)
//   created_at: timestamp without time zone (nullable, default: CURRENT_TIMESTAMP)
//   updated_at: timestamp without time zone (nullable, default: CURRENT_TIMESTAMP)
// Table: financeiro
//   id: uuid (not null, default: gen_random_uuid())
//   paciente_id: uuid (nullable)
//   descricao: text (not null)
//   valor: numeric (not null, default: 0)
//   tipo: text (not null)
//   data_lancamento: date (not null, default: CURRENT_DATE)
//   status: text (not null, default: 'Pendente'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   organization_id: uuid (nullable)
//   tipo_lancamento: text (nullable)
//   forma_pagamento: text (nullable)
//   agendamento_id: uuid (nullable)
// Table: financial
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   patient_id: uuid (nullable)
//   appointment_id: uuid (nullable)
//   transaction_type: character varying (not null)
//   amount: numeric (not null)
//   description: text (nullable)
//   payment_method: character varying (nullable)
//   status: character varying (nullable, default: 'pending'::character varying)
//   due_date: date (nullable)
//   paid_date: date (nullable)
//   created_at: timestamp without time zone (nullable, default: CURRENT_TIMESTAMP)
//   updated_at: timestamp without time zone (nullable, default: CURRENT_TIMESTAMP)
// Table: organizations
//   id: uuid (not null, default: gen_random_uuid())
//   nome_clinica: text (not null)
//   cnpj_cpf: text (nullable)
//   email_responsavel: text (nullable)
//   plano_assinatura: text (nullable)
//   data_inicio_assinatura: timestamp with time zone (nullable)
//   data_proxima_cobranca: timestamp with time zone (nullable)
//   status: text (nullable, default: 'ativo'::text)
//   gastos_creditos_mes: numeric (nullable, default: 0)
//   stripe_customer_id: text (nullable)
//   stripe_subscription_id: text (nullable)
//   valor_mensal: numeric (nullable, default: 0)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: pacientes
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   user_id: uuid (nullable)
//   nome: text (not null)
//   email: text (nullable)
//   telefone: text (nullable)
//   data_nascimento: date (nullable)
//   peso: numeric (nullable)
//   altura: numeric (nullable)
//   imc: numeric (nullable)
//   circunferencia_cintura: numeric (nullable)
//   circunferencia_quadril: numeric (nullable)
//   razao_cintura_quadril: numeric (nullable)
//   foto_url: text (nullable)
//   status: text (nullable, default: 'ativo'::text)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   cpf: text (nullable)
//   endereco: text (nullable)
//   cidade: text (nullable)
//   estado: text (nullable)
//   profissao: text (nullable)
//   alergias: text (nullable)
// Table: patients
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   professional_id: uuid (not null)
//   email: character varying (nullable)
//   phone: character varying (nullable)
//   full_name: character varying (not null)
//   date_of_birth: date (nullable)
//   cpf: character varying (nullable)
//   gender: character varying (nullable)
//   marital_status: character varying (nullable)
//   occupation: character varying (nullable)
//   address: text (nullable)
//   city: character varying (nullable)
//   state: character varying (nullable)
//   zip_code: character varying (nullable)
//   emergency_contact: character varying (nullable)
//   emergency_phone: character varying (nullable)
//   medical_history: text (nullable)
//   allergies: text (nullable)
//   current_medications: text (nullable)
//   created_at: timestamp without time zone (nullable, default: CURRENT_TIMESTAMP)
//   updated_at: timestamp without time zone (nullable, default: CURRENT_TIMESTAMP)
// Table: prescricoes
//   id: uuid (not null, default: gen_random_uuid())
//   paciente_id: uuid (not null)
//   tipo_prescricao: text (not null)
//   observacoes: text (nullable)
//   itens_prescricao: jsonb (nullable)
//   dosagem: text (nullable)
//   frequencia: text (nullable)
//   duracao: text (nullable)
//   data_prescricao: date (not null)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   status: text (nullable, default: 'Rascunho'::text)
//   gerado_por_ia: boolean (nullable, default: false)
//   editado_pelo_profissional: boolean (nullable, default: false)
//   organization_id: uuid (nullable)
//   exame_id: uuid (nullable)
//   profissional_id: uuid (nullable)
//   descricao: text (nullable)
//   ativos: jsonb (nullable, default: '[]'::jsonb)
//   gerada_por_ia: boolean (nullable, default: false)
//   data_geracao_ia: timestamp with time zone (nullable)
//   pdf_url: text (nullable)
//   data_geracao_pdf: timestamp with time zone (nullable)
// Table: prescriptions
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   patient_id: uuid (not null)
//   professional_id: uuid (not null)
//   medication_name: character varying (not null)
//   dosage: character varying (nullable)
//   frequency: character varying (nullable)
//   duration: character varying (nullable)
//   instructions: text (nullable)
//   status: character varying (nullable, default: 'active'::character varying)
//   prescribed_date: date (nullable)
//   created_at: timestamp without time zone (nullable, default: CURRENT_TIMESTAMP)
//   updated_at: timestamp without time zone (nullable, default: CURRENT_TIMESTAMP)
// Table: protocolos_limpeza
//   id: uuid (not null, default: gen_random_uuid())
//   paciente_id: uuid (not null)
//   tipo_protocolo: text (not null)
//   descricao: text (nullable)
//   duracao_dias: integer (nullable)
//   frequencia: text (nullable)
//   etapas: jsonb (nullable, default: '[]'::jsonb)
//   orientacoes: text (nullable)
//   data_inicio: date (nullable)
//   data_fim: date (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   status: text (nullable, default: 'Rascunho'::text)
//   gerado_por_ia: boolean (nullable, default: false)
// Table: recebimentos
//   id: uuid (not null, default: gen_random_uuid())
//   venda_id: uuid (not null)
//   valor_pago: numeric (not null, default: 0)
//   data_pagamento: date (not null, default: CURRENT_DATE)
//   status: text (not null, default: 'Pendente'::text)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: sessoes
//   id: uuid (not null, default: gen_random_uuid())
//   paciente_id: uuid (not null)
//   data_sessao: date (not null)
//   hora_sessao: time without time zone (not null)
//   tipo_sessao: text (not null)
//   profissional_responsavel: text (not null)
//   assinatura_digital: text (nullable)
//   status: text (not null, default: 'Agendada'::text)
//   evolucao_clinica: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: subscriptions
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   stripe_subscription_id: text (nullable)
//   plano: text (nullable)
//   valor_mensal: numeric (nullable)
//   data_inicio: timestamp with time zone (nullable)
//   data_proxima_cobranca: timestamp with time zone (nullable)
//   status: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: users
//   id: uuid (not null)
//   organization_id: uuid (nullable)
//   email: text (not null)
//   nome: text (nullable)
//   role: text (nullable, default: 'profissional'::text)
//   telefone: text (nullable)
//   data_nascimento: date (nullable)
//   foto_url: text (nullable)
//   ativo: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: usuarios
//   id: uuid (not null)
//   email: text (not null)
//   status: text (not null, default: 'inativo'::text)
//   stripe_customer_id: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: vendas
//   id: uuid (not null, default: gen_random_uuid())
//   cliente_id: uuid (not null)
//   valor: numeric (not null, default: 0)
//   data_venda: date (not null, default: CURRENT_DATE)
//   descricao: text (nullable)
//   servico_id: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())

// --- CONSTRAINTS ---
// Table: agendamentos
//   FOREIGN KEY agendamentos_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   FOREIGN KEY agendamentos_paciente_id_fkey: FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
//   PRIMARY KEY agendamentos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY agendamentos_profissional_id_fkey: FOREIGN KEY (profissional_id) REFERENCES users(id) ON DELETE SET NULL
// Table: anamesis
//   FOREIGN KEY anamesis_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   FOREIGN KEY anamesis_patient_id_fkey: FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
//   PRIMARY KEY anamesis_pkey: PRIMARY KEY (id)
//   FOREIGN KEY anamesis_professional_id_fkey: FOREIGN KEY (professional_id) REFERENCES users(id) ON DELETE SET NULL
// Table: anamnese
//   FOREIGN KEY anamnese_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   FOREIGN KEY anamnese_paciente_id_fkey: FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
//   PRIMARY KEY anamnese_pkey: PRIMARY KEY (id)
//   FOREIGN KEY anamnese_profissional_id_fkey: FOREIGN KEY (profissional_id) REFERENCES users(id) ON DELETE SET NULL
// Table: anamneses
//   FOREIGN KEY anamneses_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   UNIQUE anamneses_cliente_id_key: UNIQUE (cliente_id)
//   PRIMARY KEY anamneses_pkey: PRIMARY KEY (id)
// Table: appointments
//   FOREIGN KEY appointments_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   FOREIGN KEY appointments_patient_id_fkey: FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
//   PRIMARY KEY appointments_pkey: PRIMARY KEY (id)
//   FOREIGN KEY appointments_professional_id_fkey: FOREIGN KEY (professional_id) REFERENCES users(id) ON DELETE SET NULL
// Table: clientes
//   PRIMARY KEY clientes_pkey: PRIMARY KEY (id)
//   CHECK clientes_status_check: CHECK ((status = ANY (ARRAY['Ativo'::text, 'Inativo'::text])))
// Table: creditos_gastos
//   FOREIGN KEY creditos_gastos_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   PRIMARY KEY creditos_gastos_pkey: PRIMARY KEY (id)
// Table: credits_spent
//   FOREIGN KEY credits_spent_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   PRIMARY KEY credits_spent_pkey: PRIMARY KEY (id)
//   FOREIGN KEY credits_spent_user_id_fkey: FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
// Table: exames
//   FOREIGN KEY exames_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   FOREIGN KEY exames_paciente_id_fkey: FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
//   PRIMARY KEY exames_pkey: PRIMARY KEY (id)
//   FOREIGN KEY exames_profissional_id_fkey: FOREIGN KEY (profissional_id) REFERENCES users(id) ON DELETE SET NULL
// Table: exames_biofisicos
//   FOREIGN KEY exames_biofisicos_cliente_id_fkey: FOREIGN KEY (paciente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY exames_biofisicos_pkey: PRIMARY KEY (id)
//   CHECK exames_biofisicos_status_check: CHECK ((status = ANY (ARRAY['Pendente'::text, 'Interpretado'::text])))
// Table: exames_bioquimicos
//   FOREIGN KEY exames_bioquimicos_paciente_id_fkey: FOREIGN KEY (paciente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY exames_bioquimicos_pkey: PRIMARY KEY (id)
//   CHECK exames_bioquimicos_status_check: CHECK ((status = ANY (ARRAY['Pendente'::text, 'Interpretado'::text])))
// Table: exams
//   FOREIGN KEY exams_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   FOREIGN KEY exams_patient_id_fkey: FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
//   PRIMARY KEY exams_pkey: PRIMARY KEY (id)
//   FOREIGN KEY exams_professional_id_fkey: FOREIGN KEY (professional_id) REFERENCES users(id) ON DELETE SET NULL
// Table: financeiro
//   FOREIGN KEY financeiro_agendamento_id_fkey: FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id) ON DELETE SET NULL
//   FOREIGN KEY financeiro_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   FOREIGN KEY financeiro_paciente_id_fkey: FOREIGN KEY (paciente_id) REFERENCES clientes(id) ON DELETE SET NULL
//   PRIMARY KEY financeiro_pkey: PRIMARY KEY (id)
//   CHECK financeiro_status_check: CHECK ((status = ANY (ARRAY['Pendente'::text, 'Pago'::text])))
//   CHECK financeiro_tipo_check: CHECK ((tipo = ANY (ARRAY['Receita'::text, 'Despesa'::text])))
// Table: financial
//   FOREIGN KEY financial_appointment_id_fkey: FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
//   FOREIGN KEY financial_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   FOREIGN KEY financial_patient_id_fkey: FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
//   PRIMARY KEY financial_pkey: PRIMARY KEY (id)
// Table: organizations
//   PRIMARY KEY organizations_pkey: PRIMARY KEY (id)
// Table: pacientes
//   FOREIGN KEY pacientes_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   PRIMARY KEY pacientes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY pacientes_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
// Table: patients
//   UNIQUE patients_cpf_key: UNIQUE (cpf)
//   FOREIGN KEY patients_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   PRIMARY KEY patients_pkey: PRIMARY KEY (id)
//   FOREIGN KEY patients_professional_id_fkey: FOREIGN KEY (professional_id) REFERENCES users(id) ON DELETE SET NULL
// Table: prescricoes
//   FOREIGN KEY prescricoes_cliente_id_fkey: FOREIGN KEY (paciente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   FOREIGN KEY prescricoes_exame_id_fkey: FOREIGN KEY (exame_id) REFERENCES exames(id) ON DELETE SET NULL
//   FOREIGN KEY prescricoes_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   PRIMARY KEY prescricoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY prescricoes_profissional_id_fkey: FOREIGN KEY (profissional_id) REFERENCES users(id) ON DELETE SET NULL
//   CHECK prescricoes_status_check: CHECK ((status = ANY (ARRAY['Rascunho'::text, 'Finalizada'::text])))
//   CHECK prescricoes_tipo_prescricao_check: CHECK ((tipo_prescricao = ANY (ARRAY['Suplementação'::text, 'Protocolo'::text, 'Recomendação'::text])))
// Table: prescriptions
//   FOREIGN KEY prescriptions_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   FOREIGN KEY prescriptions_patient_id_fkey: FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
//   PRIMARY KEY prescriptions_pkey: PRIMARY KEY (id)
//   FOREIGN KEY prescriptions_professional_id_fkey: FOREIGN KEY (professional_id) REFERENCES users(id) ON DELETE SET NULL
// Table: protocolos_limpeza
//   FOREIGN KEY protocolos_limpeza_cliente_id_fkey: FOREIGN KEY (paciente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY protocolos_limpeza_pkey: PRIMARY KEY (id)
//   CHECK protocolos_limpeza_status_check: CHECK ((status = ANY (ARRAY['Rascunho'::text, 'Ativo'::text, 'Concluído'::text])))
//   CHECK protocolos_limpeza_tipo_protocolo_check: CHECK ((tipo_protocolo = ANY (ARRAY['Termobiologia'::text, 'Desparasitação'::text, 'Detox'::text])))
// Table: recebimentos
//   PRIMARY KEY recebimentos_pkey: PRIMARY KEY (id)
//   CHECK recebimentos_status_check: CHECK ((status = ANY (ARRAY['Pendente'::text, 'Pago'::text])))
//   FOREIGN KEY recebimentos_venda_id_fkey: FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE
// Table: sessoes
//   FOREIGN KEY sessoes_cliente_id_fkey: FOREIGN KEY (paciente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY sessoes_pkey: PRIMARY KEY (id)
//   CHECK sessoes_status_check: CHECK ((status = ANY (ARRAY['Agendada'::text, 'Realizada'::text, 'Cancelada'::text])))
// Table: subscriptions
//   FOREIGN KEY subscriptions_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   PRIMARY KEY subscriptions_pkey: PRIMARY KEY (id)
// Table: users
//   FOREIGN KEY users_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   FOREIGN KEY users_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   PRIMARY KEY users_pkey: PRIMARY KEY (id)
// Table: usuarios
//   FOREIGN KEY usuarios_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY usuarios_pkey: PRIMARY KEY (id)
//   CHECK usuarios_status_check: CHECK ((status = ANY (ARRAY['ativo'::text, 'inativo'::text])))
// Table: vendas
//   FOREIGN KEY vendas_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY vendas_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: agendamentos
//   Policy "agendamentos_isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_current_user_org())
// Table: anamesis
//   Policy "Professionals can create anamesis" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "Professionals can update anamesis" (UPDATE, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "Professionals can view anamesis in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
// Table: anamnese
//   Policy "anamnese_isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_current_user_org())
// Table: anamneses
//   Policy "authenticated_delete_anamneses" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_anamneses" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_anamneses" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_anamneses" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: appointments
//   Policy "Professionals can create appointments" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "Professionals can update appointments" (UPDATE, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "Professionals can view appointments in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
// Table: clientes
//   Policy "authenticated_delete_clientes" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_clientes" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_clientes" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_clientes" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: creditos_gastos
//   Policy "creditos_isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_current_user_org())
// Table: credits_spent
//   Policy "Professionals can create credit records" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "Professionals can view credit spending in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
// Table: exames
//   Policy "exames_isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_current_user_org())
// Table: exames_biofisicos
//   Policy "authenticated_delete_exames_biofisicos" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_exames_biofisicos" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_exames_biofisicos" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_exames_biofisicos" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: exames_bioquimicos
//   Policy "authenticated_delete_exames_bioquimicos" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_exames_bioquimicos" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_exames_bioquimicos" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_exames_bioquimicos" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: exams
//   Policy "Professionals can create exams" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "Professionals can update exams" (UPDATE, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "Professionals can view exams in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
// Table: financeiro
//   Policy "authenticated_delete_financeiro" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_financeiro" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_financeiro" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_financeiro" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "financeiro_isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_current_user_org())
// Table: financial
//   Policy "Professionals can create financial records" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "Professionals can update financial records" (UPDATE, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "Professionals can view financial data in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
// Table: organizations
//   Policy "Admins can update their organization" (UPDATE, PERMISSIVE) roles={public}
//     USING: (id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "Admins can view their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "org_isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (id = get_current_user_org())
// Table: pacientes
//   Policy "pacientes_isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_current_user_org())
// Table: patients
//   Policy "Professionals can create patients" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "Professionals can update patients" (UPDATE, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "Professionals can view patients in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
// Table: prescricoes
//   Policy "authenticated_delete_prescricoes" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_prescricoes" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_prescricoes" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_prescricoes" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "prescricoes_isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_current_user_org())
// Table: prescriptions
//   Policy "Professionals can create prescriptions" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "Professionals can update prescriptions" (UPDATE, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "Professionals can view prescriptions in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
// Table: protocolos_limpeza
//   Policy "authenticated_delete_protocolos" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_protocolos" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_protocolos" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_protocolos" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: recebimentos
//   Policy "authenticated_delete_recebimentos" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_recebimentos" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_recebimentos" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_recebimentos" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: sessoes
//   Policy "authenticated_delete_sessoes" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_sessoes" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_sessoes" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_sessoes" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: subscriptions
//   Policy "Admins can update subscriptions" (UPDATE, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "Professionals can view subscriptions in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "subscriptions_isolation" (ALL, PERMISSIVE) roles={public}
//     USING: (organization_id = get_current_user_org())
// Table: users
//   Policy "Users can update their own profile" (UPDATE, PERMISSIVE) roles={public}
//     USING: (id = auth.uid())
//   Policy "Users can view users in their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (organization_id = ((auth.jwt() ->> 'organization_id'::text))::uuid)
//   Policy "users_isolation" (ALL, PERMISSIVE) roles={public}
//     USING: ((organization_id = get_current_user_org()) OR (id = auth.uid()))
// Table: usuarios
//   Policy "authenticated_select_usuarios" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
// Table: vendas
//   Policy "authenticated_delete_vendas" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_vendas" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_vendas" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_vendas" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true

// --- DATABASE FUNCTIONS ---
// FUNCTION auto_confirm_user()
//   CREATE OR REPLACE FUNCTION public.auto_confirm_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, NOW());
//     
//     -- Prevent GoTrue crashes due to NULLs in token columns
//     NEW.confirmation_token = COALESCE(NEW.confirmation_token, '');
//     NEW.recovery_token = COALESCE(NEW.recovery_token, '');
//     NEW.email_change_token_new = COALESCE(NEW.email_change_token_new, '');
//     NEW.email_change = COALESCE(NEW.email_change, '');
//     NEW.email_change_token_current = COALESCE(NEW.email_change_token_current, '');
//     NEW.phone_change = COALESCE(NEW.phone_change, '');
//     NEW.phone_change_token = COALESCE(NEW.phone_change_token, '');
//     NEW.reauthentication_token = COALESCE(NEW.reauthentication_token, '');
//     
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION get_current_user_org()
//   CREATE OR REPLACE FUNCTION public.get_current_user_org()
//    RETURNS uuid
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//       RETURN (SELECT organization_id FROM public.users WHERE id = auth.uid() LIMIT 1);
//   END;
//   $function$
//   
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.users (id, email, nome, role, organization_id)
//     VALUES (
//       NEW.id,
//       NEW.email,
//       NEW.raw_user_meta_data->>'nome',
//       COALESCE(NEW.raw_user_meta_data->>'role', 'paciente'),
//       NULLIF(NEW.raw_user_meta_data->>'organization_id', '')::uuid
//     );
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION handle_new_user_sync()
//   CREATE OR REPLACE FUNCTION public.handle_new_user_sync()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.usuarios (id, email, status)
//     VALUES (NEW.id, NEW.email, 'inativo')
//     ON CONFLICT (id) DO NOTHING;
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION update_anamneses_modtime()
//   CREATE OR REPLACE FUNCTION public.update_anamneses_modtime()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       NEW.updated_at = NOW();
//       RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION update_clientes_modtime()
//   CREATE OR REPLACE FUNCTION public.update_clientes_modtime()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       NEW.updated_at = NOW();
//       RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION update_exames_biofisicos_modtime()
//   CREATE OR REPLACE FUNCTION public.update_exames_biofisicos_modtime()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       NEW.updated_at = NOW();
//       RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION update_exames_bioquimicos_modtime()
//   CREATE OR REPLACE FUNCTION public.update_exames_bioquimicos_modtime()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       NEW.updated_at = NOW();
//       RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION update_financeiro_modtime()
//   CREATE OR REPLACE FUNCTION public.update_financeiro_modtime()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       NEW.updated_at = NOW();
//       RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION update_prescricoes_modtime()
//   CREATE OR REPLACE FUNCTION public.update_prescricoes_modtime()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       NEW.updated_at = NOW();
//       RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION update_protocolos_limpeza_modtime()
//   CREATE OR REPLACE FUNCTION public.update_protocolos_limpeza_modtime()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     NEW.updated_at = NOW();
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION update_sessoes_modtime()
//   CREATE OR REPLACE FUNCTION public.update_sessoes_modtime()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       NEW.updated_at = NOW();
//       RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION update_vendas_modtime()
//   CREATE OR REPLACE FUNCTION public.update_vendas_modtime()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       NEW.updated_at = NOW();
//       RETURN NEW;
//   END;
//   $function$
//   

// --- TRIGGERS ---
// Table: anamneses
//   trigger_update_anamneses_modtime: CREATE TRIGGER trigger_update_anamneses_modtime BEFORE UPDATE ON public.anamneses FOR EACH ROW EXECUTE FUNCTION update_anamneses_modtime()
// Table: clientes
//   trigger_update_clientes_modtime: CREATE TRIGGER trigger_update_clientes_modtime BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION update_clientes_modtime()
// Table: exames_biofisicos
//   trigger_update_exames_biofisicos_modtime: CREATE TRIGGER trigger_update_exames_biofisicos_modtime BEFORE UPDATE ON public.exames_biofisicos FOR EACH ROW EXECUTE FUNCTION update_exames_biofisicos_modtime()
// Table: exames_bioquimicos
//   trigger_update_exames_bioquimicos_modtime: CREATE TRIGGER trigger_update_exames_bioquimicos_modtime BEFORE UPDATE ON public.exames_bioquimicos FOR EACH ROW EXECUTE FUNCTION update_exames_bioquimicos_modtime()
// Table: financeiro
//   trigger_update_financeiro_modtime: CREATE TRIGGER trigger_update_financeiro_modtime BEFORE UPDATE ON public.financeiro FOR EACH ROW EXECUTE FUNCTION update_financeiro_modtime()
// Table: prescricoes
//   trigger_update_prescricoes_modtime: CREATE TRIGGER trigger_update_prescricoes_modtime BEFORE UPDATE ON public.prescricoes FOR EACH ROW EXECUTE FUNCTION update_prescricoes_modtime()
// Table: protocolos_limpeza
//   trigger_update_protocolos_limpeza_modtime: CREATE TRIGGER trigger_update_protocolos_limpeza_modtime BEFORE UPDATE ON public.protocolos_limpeza FOR EACH ROW EXECUTE FUNCTION update_protocolos_limpeza_modtime()
// Table: sessoes
//   trigger_update_sessoes_modtime: CREATE TRIGGER trigger_update_sessoes_modtime BEFORE UPDATE ON public.sessoes FOR EACH ROW EXECUTE FUNCTION update_sessoes_modtime()
// Table: vendas
//   trigger_update_vendas_modtime: CREATE TRIGGER trigger_update_vendas_modtime BEFORE UPDATE ON public.vendas FOR EACH ROW EXECUTE FUNCTION update_vendas_modtime()

// --- INDEXES ---
// Table: agendamentos
//   CREATE INDEX idx_agendamentos_org_id ON public.agendamentos USING btree (organization_id)
//   CREATE INDEX idx_agendamentos_paciente_id ON public.agendamentos USING btree (paciente_id)
//   CREATE INDEX idx_agendamentos_profissional_id ON public.agendamentos USING btree (profissional_id)
// Table: anamesis
//   CREATE INDEX idx_anamesis_organization_id ON public.anamesis USING btree (organization_id)
//   CREATE INDEX idx_anamesis_patient_id ON public.anamesis USING btree (patient_id)
// Table: anamnese
//   CREATE INDEX idx_anamnese_org_id ON public.anamnese USING btree (organization_id)
//   CREATE INDEX idx_anamnese_paciente_id ON public.anamnese USING btree (paciente_id)
//   CREATE INDEX idx_anamnese_profissional_id ON public.anamnese USING btree (profissional_id)
// Table: anamneses
//   CREATE UNIQUE INDEX anamneses_cliente_id_key ON public.anamneses USING btree (cliente_id)
// Table: appointments
//   CREATE INDEX idx_appointments_organization_id ON public.appointments USING btree (organization_id)
//   CREATE INDEX idx_appointments_patient_id ON public.appointments USING btree (patient_id)
// Table: creditos_gastos
//   CREATE INDEX idx_creditos_gastos_org_id ON public.creditos_gastos USING btree (organization_id)
// Table: credits_spent
//   CREATE INDEX idx_credits_spent_organization_id ON public.credits_spent USING btree (organization_id)
// Table: exames
//   CREATE INDEX idx_exames_org_id ON public.exames USING btree (organization_id)
//   CREATE INDEX idx_exames_paciente_id ON public.exames USING btree (paciente_id)
//   CREATE INDEX idx_exames_profissional_id ON public.exames USING btree (profissional_id)
// Table: exams
//   CREATE INDEX idx_exams_organization_id ON public.exams USING btree (organization_id)
//   CREATE INDEX idx_exams_patient_id ON public.exams USING btree (patient_id)
// Table: financeiro
//   CREATE INDEX idx_financeiro_agendamento_id ON public.financeiro USING btree (agendamento_id)
//   CREATE INDEX idx_financeiro_org_id ON public.financeiro USING btree (organization_id)
//   CREATE INDEX idx_financeiro_paciente_id ON public.financeiro USING btree (paciente_id)
// Table: financial
//   CREATE INDEX idx_financial_organization_id ON public.financial USING btree (organization_id)
// Table: pacientes
//   CREATE INDEX idx_pacientes_org_id ON public.pacientes USING btree (organization_id)
//   CREATE INDEX idx_pacientes_user_id ON public.pacientes USING btree (user_id)
// Table: patients
//   CREATE INDEX idx_patients_organization_id ON public.patients USING btree (organization_id)
//   CREATE INDEX idx_patients_professional_id ON public.patients USING btree (professional_id)
//   CREATE UNIQUE INDEX patients_cpf_key ON public.patients USING btree (cpf)
// Table: prescricoes
//   CREATE INDEX idx_prescricoes_org_id ON public.prescricoes USING btree (organization_id)
//   CREATE INDEX idx_prescricoes_paciente_id ON public.prescricoes USING btree (paciente_id)
//   CREATE INDEX idx_prescricoes_profissional_id ON public.prescricoes USING btree (profissional_id)
// Table: prescriptions
//   CREATE INDEX idx_prescriptions_organization_id ON public.prescriptions USING btree (organization_id)
//   CREATE INDEX idx_prescriptions_patient_id ON public.prescriptions USING btree (patient_id)
// Table: subscriptions
//   CREATE INDEX idx_subscriptions_org_id ON public.subscriptions USING btree (organization_id)
//   CREATE INDEX idx_subscriptions_organization_id ON public.subscriptions USING btree (organization_id)
// Table: users
//   CREATE INDEX idx_users_org_id ON public.users USING btree (organization_id)
//   CREATE INDEX idx_users_organization_id ON public.users USING btree (organization_id)

