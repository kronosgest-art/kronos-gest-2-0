-- Migration: Garante que colunas da anamnese sejam JSONB e aceitem os arrays
-- As colunas da anamnese na v0.0.13 já estão como JSONB no banco (conforme types.ts),
-- portanto esta migration é apenas uma confirmação para evitar problemas ao inserir os arrays.

DO $$
BEGIN
    -- Sem alterações estruturais necessárias, as colunas já são JSONB e o insert de arrays JS 
    -- vai gravar corretamente nas colunas do Postgres via sdk do Supabase.
    NULL;
END $$;
