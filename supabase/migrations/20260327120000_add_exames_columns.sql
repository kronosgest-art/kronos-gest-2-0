ALTER TABLE public.exames
ADD COLUMN IF NOT EXISTS dados_extraidos TEXT,
ADD COLUMN IF NOT EXISTS interpretacao TEXT,
ADD COLUMN IF NOT EXISTS sugestao_receita JSONB;
