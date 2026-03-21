-- Set up trigger to automatically create a profile in public.users when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, nome, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'nome',
    COALESCE(NEW.raw_user_meta_data->>'role', 'paciente')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed an initial admin user and organization for testing
DO $$
DECLARE
  admin_uid uuid := gen_random_uuid();
  org_uid uuid := gen_random_uuid();
BEGIN
  -- Create an initial organization if not exists
  INSERT INTO public.organizations (id, nome_clinica, status)
  VALUES (org_uid, 'Clínica Kronos Gest', 'ativo')
  ON CONFLICT DO NOTHING;

  -- Seed admin user (idempotent: skip if email already exists)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dra.morganavieira@gmail.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      admin_uid,
      '00000000-0000-0000-0000-000000000000',
      'dra.morganavieira@gmail.com',
      crypt('KronosAdmin123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"nome": "Dra. Morgana Vieira", "role": "admin"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, -- phone MUST be NULL due to unique constraint
      '', '', ''
    );

    -- The trigger automatically creates the row in public.users.
    -- We just need to update its organization_id to link it properly.
    UPDATE public.users SET organization_id = org_uid WHERE id = admin_uid;
  END IF;
END $$;
