-- Adiciona colunas necessárias à tabela pacientes para o formulário completo
ALTER TABLE public.pacientes ADD COLUMN IF NOT EXISTS cpf text;
ALTER TABLE public.pacientes ADD COLUMN IF NOT EXISTS endereco text;
ALTER TABLE public.pacientes ADD COLUMN IF NOT EXISTS cidade text;
ALTER TABLE public.pacientes ADD COLUMN IF NOT EXISTS estado text;
ALTER TABLE public.pacientes ADD COLUMN IF NOT EXISTS profissao text;
ALTER TABLE public.pacientes ADD COLUMN IF NOT EXISTS alergias text;
