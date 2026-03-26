-- Fix foreign key constraint if it incorrectly points to 'clientes' instead of 'pacientes'
ALTER TABLE IF EXISTS public.financeiro DROP CONSTRAINT IF EXISTS financeiro_paciente_id_fkey;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pacientes') THEN
    BEGIN
      ALTER TABLE public.financeiro ADD CONSTRAINT financeiro_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;
END $$;

DO $$
DECLARE
  org_id uuid;
  prof_id uuid;
  new_paciente_id uuid;
  i int;
BEGIN
  -- Get first organization and professional
  SELECT id INTO org_id FROM organizations LIMIT 1;
  SELECT id INTO prof_id FROM users WHERE role = 'profissional' LIMIT 1;

  IF org_id IS NULL THEN
    org_id := gen_random_uuid();
    INSERT INTO organizations (id, nome_clinica) VALUES (org_id, 'Clínica Padrão') ON CONFLICT DO NOTHING;
  END IF;

  IF prof_id IS NULL THEN
    prof_id := gen_random_uuid();
    INSERT INTO users (id, organization_id, email, role, nome) 
    VALUES (prof_id, org_id, 'profissional@seed.com', 'profissional', 'Profissional Migrado') ON CONFLICT DO NOTHING;
  END IF;

  -- Seed 24 patients
  FOR i IN 1..24 LOOP
    new_paciente_id := gen_random_uuid();
    
    INSERT INTO pacientes (id, organization_id, nome, email, telefone, cpf, status)
    VALUES (
      new_paciente_id, 
      org_id, 
      'Paciente Migrado ' || i, 
      'paciente' || i || '@migracao.com', 
      '119999900' || LPAD(i::text, 2, '0'), 
      '000111222' || LPAD(i::text, 2, '0'), 
      'ativo'
    ) ON CONFLICT DO NOTHING;

    INSERT INTO anamnese (id, organization_id, paciente_id, profissional_id, queixa_principal)
    VALUES (gen_random_uuid(), org_id, new_paciente_id, prof_id, 'Queixa principal migrada do P1 - Paciente ' || i) ON CONFLICT DO NOTHING;

    INSERT INTO exames (id, organization_id, paciente_id, profissional_id, tipo_exame, status_interpretacao)
    VALUES (gen_random_uuid(), org_id, new_paciente_id, prof_id, 'Exame de Rotina', 'Pendente') ON CONFLICT DO NOTHING;

    INSERT INTO agendamentos (id, organization_id, paciente_id, profissional_id, tipo_procedimento, status, data_hora)
    VALUES (gen_random_uuid(), org_id, new_paciente_id, prof_id, 'Consulta Inicial', 'agendado', NOW() + (i || ' days')::interval) ON CONFLICT DO NOTHING;

    INSERT INTO financeiro (id, organization_id, paciente_id, descricao, valor, tipo, status, data_lancamento)
    VALUES (gen_random_uuid(), org_id, new_paciente_id, 'Consulta P1 - Paciente ' || i, 350.00, 'Receita', 'Pago', CURRENT_DATE) ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
