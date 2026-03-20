-- Migration: add `communications` role + sync auth.users -> public.profiles
-- Makes it possible for Super Admin to create users with role metadata
-- and have `profiles.role` populated automatically. Also adds simple
-- RLS policies so users with role = 'communications' can SELECT
-- contact_submissions and appointments.

BEGIN;

-- 1) Update allowed role values on profiles and users tables
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('super_admin','content_manager','communications'));

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('super_admin','content_manager','communications'));

-- 2) Create function to sync auth.users -> public.profiles
--    If the auth user has user metadata like {"role":"communications"}
--    that role will be used. Otherwise default to 'content_manager'.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger AS $$
DECLARE
  new_role text;
  new_name text;
BEGIN
  -- Look in both raw_user_meta_data and raw_app_meta_data for compatibility
  new_role := COALESCE(NEW.raw_user_meta_data->>'role', NEW.raw_app_meta_data->>'role', 'content_manager');
  new_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));

  INSERT INTO public.profiles (id, name, role, created_at)
  VALUES (NEW.id, new_name, new_role, NOW())
  ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name,
        role = EXCLUDED.role;

  INSERT INTO public.users (id, email, name, role, created_at)
  VALUES (NEW.id, NEW.email, new_name, new_role, NOW())
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        name = EXCLUDED.name,
        role = EXCLUDED.role;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove any old trigger and create the new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_to_users ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- 3) Row Level Security: enable RLS and add policies for communications role
--    These policies allow users whose profile role = 'communications' to
--    SELECT rows from these tables. Adjust to your needs.

-- Contact submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'communications_select_contact_submissions'
      AND tablename = 'contact_submissions'
  ) THEN
    EXECUTE 'CREATE POLICY communications_select_contact_submissions
      ON public.contact_submissions
      FOR SELECT
      USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = ''communications'')';
  END IF;
END$$;

-- Appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'communications_select_appointments'
      AND tablename = 'appointments'
  ) THEN
    EXECUTE 'CREATE POLICY communications_select_appointments
      ON public.appointments
      FOR SELECT
      USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = ''communications'')';
  END IF;
END$$;

COMMIT;

-- USAGE NOTES ---------------------------------------------------------------
-- 1) Apply this SQL in your Supabase project's SQL editor (SQL > New Query).
-- 2) How Super Admin should create a user that becomes a 'communications' user:
--    - When creating via Supabase Admin API or dashboard, include user_metadata
--      with the `role` key, e.g. user_metadata: {"role":"communications"}
--    - If no role metadata is provided, the profile will default to 'content_manager'.

-- Example: update an existing profile to communications:
--   UPDATE public.profiles SET role = 'communications' WHERE email = 'user@example.com';

-- Example: set role metadata when creating via Supabase Admin REST API (curl):
--   curl -X POST 'https://<project>.supabase.co/auth/v1/admin/users'
--     -H "apikey: <SERVICE_ROLE_KEY>" -H "Authorization: Bearer <SERVICE_ROLE_KEY>"
--     -H 'Content-Type: application/json'
--     -d '{"email":"user@example.com","password":"Str0ngP@ss","user_metadata":{"role":"communications"}}'

-- After applying the migration:
-- - When Super Admin creates a user with user_metadata.role = 'communications',
--   the `profiles.role` will be set to 'communications' automatically and that
--   user (after login) will satisfy the small RLS policies above and be able
--   to SELECT contact_submissions and appointments.
