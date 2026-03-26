DO $$
BEGIN
  -- Remover registros de financeiro associados aos pacientes fictícios ou que tenham descrição fictícia
  DELETE FROM public.financeiro
  WHERE paciente_id IN (SELECT id FROM public.pacientes WHERE nome LIKE 'Paciente Migrado%')
     OR descricao LIKE 'Consulta P1 - Paciente %';

  -- Remover agendamentos vinculados a pacientes fictícios
  DELETE FROM public.agendamentos
  WHERE paciente_id IN (SELECT id FROM public.pacientes WHERE nome LIKE 'Paciente Migrado%');

  -- Remover exames vinculados a pacientes fictícios
  DELETE FROM public.exames
  WHERE paciente_id IN (SELECT id FROM public.pacientes WHERE nome LIKE 'Paciente Migrado%');

  -- Remover anamneses vinculadas a pacientes fictícios
  DELETE FROM public.anamnese
  WHERE paciente_id IN (SELECT id FROM public.pacientes WHERE nome LIKE 'Paciente Migrado%');

  -- Remover os próprios pacientes fictícios
  DELETE FROM public.pacientes
  WHERE nome LIKE 'Paciente Migrado%';
END $$;
