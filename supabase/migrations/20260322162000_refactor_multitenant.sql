-- Migration: Refatoração para Multi-Tenant com organization_id e RLS
-- Adiciona organization_id e FK para as tabelas principais

-- Garante que a tabela organizations existe
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

-- Adiciona as colunas organization_id
ALTER TABLE public.pacientes ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE public.anamnese ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE public.exames ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE public.prescricoes ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE public.financeiro ADD COLUMN IF NOT EXISTS organization_id UUID;

-- Adiciona Constraints (se não existirem)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pacientes_organization_id_fkey') THEN
        ALTER TABLE public.pacientes ADD CONSTRAINT pacientes_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'anamnese_organization_id_fkey') THEN
        ALTER TABLE public.anamnese ADD CONSTRAINT anamnese_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exames_organization_id_fkey') THEN
        ALTER TABLE public.exames ADD CONSTRAINT exames_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'prescricoes_organization_id_fkey') THEN
        ALTER TABLE public.prescricoes ADD CONSTRAINT prescricoes_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agendamentos_organization_id_fkey') THEN
        ALTER TABLE public.agendamentos ADD CONSTRAINT agendamentos_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'financeiro_organization_id_fkey') THEN
        ALTER TABLE public.financeiro ADD CONSTRAINT financeiro_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Função auxiliar para RLS baseada na organization do usuário logado
CREATE OR REPLACE FUNCTION public.get_current_user_org()
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT organization_id FROM public.users WHERE id = auth.uid() LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Habilita RLS e recria as políticas
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
