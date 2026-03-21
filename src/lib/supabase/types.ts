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
      financeiro: {
        Row: {
          created_at: string
          data_lancamento: string
          descricao: string
          id: string
          paciente_id: string | null
          status: string
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          created_at?: string
          data_lancamento?: string
          descricao: string
          id?: string
          paciente_id?: string | null
          status?: string
          tipo: string
          updated_at?: string
          valor?: number
        }
        Update: {
          created_at?: string
          data_lancamento?: string
          descricao?: string
          id?: string
          paciente_id?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      prescricoes: {
        Row: {
          created_at: string | null
          data_prescricao: string
          dosagem: string | null
          duracao: string | null
          editado_pelo_profissional: boolean | null
          frequencia: string | null
          gerado_por_ia: boolean | null
          id: string
          itens_prescricao: Json | null
          observacoes: string | null
          paciente_id: string
          status: string | null
          tipo_prescricao: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_prescricao: string
          dosagem?: string | null
          duracao?: string | null
          editado_pelo_profissional?: boolean | null
          frequencia?: string | null
          gerado_por_ia?: boolean | null
          id?: string
          itens_prescricao?: Json | null
          observacoes?: string | null
          paciente_id: string
          status?: string | null
          tipo_prescricao: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_prescricao?: string
          dosagem?: string | null
          duracao?: string | null
          editado_pelo_profissional?: boolean | null
          frequencia?: string | null
          gerado_por_ia?: boolean | null
          id?: string
          itens_prescricao?: Json | null
          observacoes?: string | null
          paciente_id?: string
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
      [_ in never]: never
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
// Table: anamneses
//   FOREIGN KEY anamneses_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   UNIQUE anamneses_cliente_id_key: UNIQUE (cliente_id)
//   PRIMARY KEY anamneses_pkey: PRIMARY KEY (id)
// Table: clientes
//   PRIMARY KEY clientes_pkey: PRIMARY KEY (id)
//   CHECK clientes_status_check: CHECK ((status = ANY (ARRAY['Ativo'::text, 'Inativo'::text])))
// Table: exames_biofisicos
//   FOREIGN KEY exames_biofisicos_cliente_id_fkey: FOREIGN KEY (paciente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY exames_biofisicos_pkey: PRIMARY KEY (id)
//   CHECK exames_biofisicos_status_check: CHECK ((status = ANY (ARRAY['Pendente'::text, 'Interpretado'::text])))
// Table: exames_bioquimicos
//   FOREIGN KEY exames_bioquimicos_paciente_id_fkey: FOREIGN KEY (paciente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY exames_bioquimicos_pkey: PRIMARY KEY (id)
//   CHECK exames_bioquimicos_status_check: CHECK ((status = ANY (ARRAY['Pendente'::text, 'Interpretado'::text])))
// Table: financeiro
//   FOREIGN KEY financeiro_paciente_id_fkey: FOREIGN KEY (paciente_id) REFERENCES clientes(id) ON DELETE SET NULL
//   PRIMARY KEY financeiro_pkey: PRIMARY KEY (id)
//   CHECK financeiro_status_check: CHECK ((status = ANY (ARRAY['Pendente'::text, 'Pago'::text])))
//   CHECK financeiro_tipo_check: CHECK ((tipo = ANY (ARRAY['Receita'::text, 'Despesa'::text])))
// Table: prescricoes
//   FOREIGN KEY prescricoes_cliente_id_fkey: FOREIGN KEY (paciente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY prescricoes_pkey: PRIMARY KEY (id)
//   CHECK prescricoes_status_check: CHECK ((status = ANY (ARRAY['Rascunho'::text, 'Finalizada'::text])))
//   CHECK prescricoes_tipo_prescricao_check: CHECK ((tipo_prescricao = ANY (ARRAY['Suplementação'::text, 'Protocolo'::text, 'Recomendação'::text])))
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
// Table: usuarios
//   FOREIGN KEY usuarios_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY usuarios_pkey: PRIMARY KEY (id)
//   CHECK usuarios_status_check: CHECK ((status = ANY (ARRAY['ativo'::text, 'inativo'::text])))
// Table: vendas
//   FOREIGN KEY vendas_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY vendas_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
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
// Table: anamneses
//   CREATE UNIQUE INDEX anamneses_cliente_id_key ON public.anamneses USING btree (cliente_id)

