-- Set up auto-confirmation for new users to bypass email sending issues
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS trigger AS $$
BEGIN
  NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, NOW());
  
  -- Prevent GoTrue crashes due to NULLs in token columns
  NEW.confirmation_token = COALESCE(NEW.confirmation_token, '');
  NEW.recovery_token = COALESCE(NEW.recovery_token, '');
  NEW.email_change_token_new = COALESCE(NEW.email_change_token_new, '');
  NEW.email_change = COALESCE(NEW.email_change, '');
  NEW.email_change_token_current = COALESCE(NEW.email_change_token_current, '');
  NEW.phone_change = COALESCE(NEW.phone_change, '');
  NEW.phone_change_token = COALESCE(NEW.phone_change_token, '');
  NEW.reauthentication_token = COALESCE(NEW.reauthentication_token, '');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;
CREATE TRIGGER auto_confirm_user_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();

-- Confirm any existing unconfirmed users
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;
