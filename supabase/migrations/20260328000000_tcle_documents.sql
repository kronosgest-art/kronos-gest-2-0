CREATE TABLE IF NOT EXISTS public.tcle_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    profissional_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    conteudo TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tcle_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tcle_isolation" ON public.tcle_documents;
CREATE POLICY "tcle_isolation" ON public.tcle_documents
  FOR ALL TO public
  USING (organization_id = get_current_user_org());

CREATE INDEX IF NOT EXISTS idx_tcle_paciente_id ON public.tcle_documents(paciente_id);
