DO $$
DECLARE
  v_org_id uuid;
  v_user_id uuid;
BEGIN
  -- 1. Ensure at least one organization exists
  IF NOT EXISTS (SELECT 1 FROM public.organizations) THEN
    INSERT INTO public.organizations (nome_clinica, status, valor_mensal)
    VALUES ('Clínica Integrativa Kronos', 'ativo', 0)
    RETURNING id INTO v_org_id;
  ELSE
    SELECT id INTO v_org_id FROM public.organizations LIMIT 1;
  END IF;

  -- 2. Seed the requested user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'morgana@kronosgest.com.br') THEN
    v_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'morgana@kronosgest.com.br',
      crypt('Teste@123456', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      jsonb_build_object('nome', 'Morgana', 'role', 'profissional', 'organization_id', v_org_id),
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    -- Ensure public.users is updated correctly (idempotent)
    INSERT INTO public.users (id, email, nome, role, organization_id, ativo)
    VALUES (v_user_id, 'morgana@kronosgest.com.br', 'Morgana', 'profissional', v_org_id, true)
    ON CONFLICT (id) DO UPDATE 
    SET organization_id = EXCLUDED.organization_id, 
        nome = EXCLUDED.nome,
        role = EXCLUDED.role;
  END IF;
END $$;
