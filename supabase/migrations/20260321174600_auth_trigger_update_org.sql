-- Update trigger to also handle organization_id if provided in metadata during signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, nome, role, organization_id)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'nome',
    COALESCE(NEW.raw_user_meta_data->>'role', 'paciente'),
    NULLIF(NEW.raw_user_meta_data->>'organization_id', '')::uuid
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
