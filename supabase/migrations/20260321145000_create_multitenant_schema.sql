-- Migration to create the new multi-tenant schema for KronosGest

-- 1. organizations
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_clinica TEXT NOT NULL,
    cnpj_cpf TEXT,
    email_responsavel TEXT,
    plano_assinatura TEXT,
    data_inicio_assinatura TIMESTAMPTZ,
    data_proxima_cobranca TIMESTAMPTZ,
    status TEXT DEFAULT 'ativo',
    gastos_creditos_mes NUMERIC DEFAULT 0,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    valor_mensal NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    nome TEXT,
    role TEXT DEFAULT 'profissional',
    telefone TEXT,
    data_nascimento DATE,
    foto_url TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. pacientes
CREATE TABLE IF NOT EXISTS public.pacientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    data_nascimento DATE,
    peso NUMERIC,
    altura NUMERIC,
    imc NUMERIC,
    circunferencia_cintura NUMERIC,
    circunferencia_quadril NUMERIC,
    razao_cintura_quadril NUMERIC,
    foto_url TEXT,
    status TEXT DEFAULT 'ativo',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. anamnese
CREATE TABLE IF NOT EXISTS public.anamnese (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
    profissional_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    sexo_biologico TEXT,
    identidade_genero TEXT,
    profissao TEXT,
    queixa_principal TEXT,
    objetivos_tratamento TEXT,
    doencas_diagnosticadas JSONB DEFAULT '[]'::jsonb,
    medicamentos_uso JSONB DEFAULT '[]'::jsonb,
    suplementos_uso JSONB DEFAULT '[]'::jsonb,
    cirurgias_internacoes TEXT,
    alergias_sensibilidades JSONB DEFAULT '[]'::jsonb,
    historico_familiar JSONB DEFAULT '[]'::jsonb,
    cardiovascular JSONB DEFAULT '{}'::jsonb,
    gastrointestinal JSONB DEFAULT '{}'::jsonb,
    hepatica JSONB DEFAULT '{}'::jsonb,
    pancreatica JSONB DEFAULT '{}'::jsonb,
    renal JSONB DEFAULT '{}'::jsonb,
    pulmonar JSONB DEFAULT '{}'::jsonb,
    nervosa JSONB DEFAULT '{}'::jsonb,
    ossea_articular JSONB DEFAULT '{}'::jsonb,
    endocrina JSONB DEFAULT '{}'::jsonb,
    imunologica JSONB DEFAULT '{}'::jsonb,
    alimentacao_descricao TEXT,
    frequencia_ultraprocessados TEXT,
    frequencia_acucares TEXT,
    frequencia_farinaceos TEXT,
    frequencia_frituras TEXT,
    frequencia_carnes_vermelhas TEXT,
    frequencia_peixes TEXT,
    porcoes_frutas TEXT,
    porcoes_vegetais TEXT,
    consome_laticinios BOOLEAN,
    consome_gluten BOOLEAN,
    restricoes_alimentares TEXT,
    consumo_agua_litros NUMERIC,
    bebidas_acucaradas TEXT,
    consumo_cafe TEXT,
    horas_sono NUMERIC,
    dificuldade_sono JSONB DEFAULT '[]'::jsonb,
    nivel_estresse TEXT,
    fontes_estresse JSONB DEFAULT '[]'::jsonb,
    problemas_saude_mental JSONB DEFAULT '[]'::jsonb,
    hobbies_relaxantes TEXT,
    pratica_atividade_fisica BOOLEAN,
    tipo_atividade_fisica TEXT,
    frequencia_atividade TEXT,
    duracao_atividade TEXT,
    tabagismo TEXT,
    consumo_alcool TEXT,
    exposicao_quimicos BOOLEAN,
    moradia_poluicao BOOLEAN,
    usa_cosmeticos_quimicos BOOLEAN,
    usa_panelas_aluminio BOOLEAN,
    pele_problemas JSONB DEFAULT '[]'::jsonb,
    tipo_pele TEXT,
    rotina_cuidados_pele TEXT,
    cabelo_problemas JSONB DEFAULT '[]'::jsonb,
    unhas_problemas JSONB DEFAULT '[]'::jsonb,
    corporal_problemas JSONB DEFAULT '[]'::jsonb,
    olhos_problemas JSONB DEFAULT '[]'::jsonb,
    observacoes_profissional TEXT,
    termo_consentimento_aceito BOOLEAN DEFAULT false,
    data_termo_consentimento TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. exames
CREATE TABLE IF NOT EXISTS public.exames (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
    profissional_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    tipo_exame TEXT,
    data_exame DATE,
    arquivo_pdf_url TEXT,
    arquivo_pdf_nome TEXT,
    tamanho_arquivo NUMERIC,
    interpretacao_ia TEXT,
    status_interpretacao TEXT DEFAULT 'pendente',
    data_interpretacao TIMESTAMPTZ,
    sistemas_alterados JSONB DEFAULT '[]'::jsonb,
    ativos_alterados JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. prescricoes (Safely adding to existing table or creating new)
CREATE TABLE IF NOT EXISTS public.prescricoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);
ALTER TABLE public.prescricoes ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.prescricoes ADD COLUMN IF NOT EXISTS paciente_id UUID;
ALTER TABLE public.prescricoes ADD COLUMN IF NOT EXISTS exame_id UUID REFERENCES public.exames(id) ON DELETE SET NULL;
ALTER TABLE public.prescricoes ADD COLUMN IF NOT EXISTS profissional_id UUID REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.prescricoes ADD COLUMN IF NOT EXISTS tipo_prescricao TEXT;
ALTER TABLE public.prescricoes ADD COLUMN IF NOT EXISTS descricao TEXT;
ALTER TABLE public.prescricoes ADD COLUMN IF NOT EXISTS ativos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.prescricoes ADD COLUMN IF NOT EXISTS gerada_por_ia BOOLEAN DEFAULT false;
ALTER TABLE public.prescricoes ADD COLUMN IF NOT EXISTS data_geracao_ia TIMESTAMPTZ;
ALTER TABLE public.prescricoes ADD COLUMN IF NOT EXISTS pdf_url TEXT;
ALTER TABLE public.prescricoes ADD COLUMN IF NOT EXISTS data_geracao_pdf TIMESTAMPTZ;
ALTER TABLE public.prescricoes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'rascunho';

-- 7. agendamentos
CREATE TABLE IF NOT EXISTS public.agendamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
    profissional_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    tipo_procedimento TEXT,
    data_hora TIMESTAMPTZ,
    duracao_minutos INTEGER,
    numero_sessoes INTEGER,
    status TEXT DEFAULT 'agendado',
    motivo_cancelamento TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. financeiro (Safely adding to existing table or creating new)
CREATE TABLE IF NOT EXISTS public.financeiro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);
ALTER TABLE public.financeiro ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.financeiro ADD COLUMN IF NOT EXISTS paciente_id UUID;
ALTER TABLE public.financeiro ADD COLUMN IF NOT EXISTS tipo_lancamento TEXT;
ALTER TABLE public.financeiro ADD COLUMN IF NOT EXISTS descricao TEXT;
ALTER TABLE public.financeiro ADD COLUMN IF NOT EXISTS valor NUMERIC DEFAULT 0;
ALTER TABLE public.financeiro ADD COLUMN IF NOT EXISTS forma_pagamento TEXT;
ALTER TABLE public.financeiro ADD COLUMN IF NOT EXISTS data_lancamento DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.financeiro ADD COLUMN IF NOT EXISTS agendamento_id UUID REFERENCES public.agendamentos(id) ON DELETE SET NULL;

-- 9. creditos_gastos
CREATE TABLE IF NOT EXISTS public.creditos_gastos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    tipo_operacao TEXT,
    creditos_gastos NUMERIC,
    descricao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT,
    plano TEXT,
    valor_mensal NUMERIC,
    data_inicio TIMESTAMPTZ,
    data_proxima_cobranca TIMESTAMPTZ,
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_org_id ON public.users(organization_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_org_id ON public.pacientes(organization_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_user_id ON public.pacientes(user_id);
CREATE INDEX IF NOT EXISTS idx_anamnese_org_id ON public.anamnese(organization_id);
CREATE INDEX IF NOT EXISTS idx_anamnese_paciente_id ON public.anamnese(paciente_id);
CREATE INDEX IF NOT EXISTS idx_anamnese_profissional_id ON public.anamnese(profissional_id);
CREATE INDEX IF NOT EXISTS idx_exames_org_id ON public.exames(organization_id);
CREATE INDEX IF NOT EXISTS idx_exames_paciente_id ON public.exames(paciente_id);
CREATE INDEX IF NOT EXISTS idx_exames_profissional_id ON public.exames(profissional_id);
CREATE INDEX IF NOT EXISTS idx_prescricoes_org_id ON public.prescricoes(organization_id);
CREATE INDEX IF NOT EXISTS idx_prescricoes_paciente_id ON public.prescricoes(paciente_id);
CREATE INDEX IF NOT EXISTS idx_prescricoes_profissional_id ON public.prescricoes(profissional_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_org_id ON public.agendamentos(organization_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_paciente_id ON public.agendamentos(paciente_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_profissional_id ON public.agendamentos(profissional_id);
CREATE INDEX IF NOT EXISTS idx_financeiro_org_id ON public.financeiro(organization_id);
CREATE INDEX IF NOT EXISTS idx_financeiro_paciente_id ON public.financeiro(paciente_id);
CREATE INDEX IF NOT EXISTS idx_financeiro_agendamento_id ON public.financeiro(agendamento_id);
CREATE INDEX IF NOT EXISTS idx_creditos_gastos_org_id ON public.creditos_gastos(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_org_id ON public.subscriptions(organization_id);

-- Secure function to get current user's organization
CREATE OR REPLACE FUNCTION public.get_current_user_org()
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT organization_id FROM public.users WHERE id = auth.uid() LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enable RLS and setup policies for Multi-tenant isolation
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "org_isolation" ON public.organizations;
CREATE POLICY "org_isolation" ON public.organizations FOR ALL USING (id = public.get_current_user_org());

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_isolation" ON public.users;
CREATE POLICY "users_isolation" ON public.users FOR ALL USING (organization_id = public.get_current_user_org() OR id = auth.uid());

ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pacientes_isolation" ON public.pacientes;
CREATE POLICY "pacientes_isolation" ON public.pacientes FOR ALL USING (organization_id = public.get_current_user_org());

ALTER TABLE public.anamnese ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anamnese_isolation" ON public.anamnese;
CREATE POLICY "anamnese_isolation" ON public.anamnese FOR ALL USING (organization_id = public.get_current_user_org());

ALTER TABLE public.exames ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "exames_isolation" ON public.exames;
CREATE POLICY "exames_isolation" ON public.exames FOR ALL USING (organization_id = public.get_current_user_org());

ALTER TABLE public.prescricoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "prescricoes_isolation" ON public.prescricoes;
CREATE POLICY "prescricoes_isolation" ON public.prescricoes FOR ALL USING (organization_id = public.get_current_user_org());

ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "agendamentos_isolation" ON public.agendamentos;
CREATE POLICY "agendamentos_isolation" ON public.agendamentos FOR ALL USING (organization_id = public.get_current_user_org());

ALTER TABLE public.financeiro ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "financeiro_isolation" ON public.financeiro;
CREATE POLICY "financeiro_isolation" ON public.financeiro FOR ALL USING (organization_id = public.get_current_user_org());

ALTER TABLE public.creditos_gastos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "creditos_isolation" ON public.creditos_gastos;
CREATE POLICY "creditos_isolation" ON public.creditos_gastos FOR ALL USING (organization_id = public.get_current_user_org());

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "subscriptions_isolation" ON public.subscriptions;
CREATE POLICY "subscriptions_isolation" ON public.subscriptions FOR ALL USING (organization_id = public.get_current_user_org());
