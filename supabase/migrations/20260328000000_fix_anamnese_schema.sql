DO $$
BEGIN
  -- Corrige a tabela anamnese adicionando as colunas necessárias para o formulário
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'anamnese') THEN
    CREATE TABLE public.anamnese (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      paciente_id UUID,
      profissional_id UUID REFERENCES auth.users(id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;

  -- Adicionando colunas de forma segura (idempotente)
  ALTER TABLE public.anamnese ADD COLUMN IF NOT EXISTS altura NUMERIC;
  ALTER TABLE public.anamnese ADD COLUMN IF NOT EXISTS peso NUMERIC;
  ALTER TABLE public.anamnese ADD COLUMN IF NOT EXISTS queixa_principal TEXT;
  ALTER TABLE public.anamnese ADD COLUMN IF NOT EXISTS hma TEXT;
  ALTER TABLE public.anamnese ADD COLUMN IF NOT EXISTS hmp TEXT;
  ALTER TABLE public.anamnese ADD COLUMN IF NOT EXISTS habitos TEXT;

  -- Garantir politicas basicas de RLS para anamnese
  ALTER TABLE public.anamnese ENABLE ROW LEVEL SECURITY;
  
  DROP POLICY IF EXISTS "Profissional pode gerenciar anamneses" ON public.anamnese;
  CREATE POLICY "Profissional pode gerenciar anamneses" ON public.anamnese
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

END $$;

-- Força a recarga do schema cache do PostgREST para reconhecer a nova coluna "altura"
NOTIFY pgrst, 'reload schema';
