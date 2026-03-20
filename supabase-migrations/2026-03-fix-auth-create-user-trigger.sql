-- Hotfix: Fix auth user creation trigger
-- Root cause fixed: prior trigger attempted to insert `email` into public.profiles,
-- but profiles table has no email column.

BEGIN;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger AS $$
DECLARE
  new_role text;
  new_name text;
BEGIN
  new_role := COALESCE(NEW.raw_user_meta_data->>'role', NEW.raw_app_meta_data->>'role', 'content_manager');
  new_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));

  -- profiles has: id, name, role, avatar, created_at (no email column)
  INSERT INTO public.profiles (id, name, role, created_at)
  VALUES (NEW.id, new_name, new_role, NOW())
  ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name,
        role = EXCLUDED.role;

  -- users mirror table keeps email
  INSERT INTO public.users (id, email, name, role, created_at)
  VALUES (NEW.id, NEW.email, new_name, new_role, NOW())
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        name = EXCLUDED.name,
        role = EXCLUDED.role;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Keep one INSERT trigger path for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_to_users ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

COMMIT;
