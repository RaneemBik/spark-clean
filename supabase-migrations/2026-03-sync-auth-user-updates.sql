-- Migration: keep public.profiles and public.users in sync when auth.users is UPDATED
-- Adds a trigger that updates profile/user rows when auth.users metadata (including role) changes.

BEGIN;

-- Function to sync changes from auth.users to public.profiles and public.users
CREATE OR REPLACE FUNCTION public.handle_update_auth_user()
RETURNS trigger AS $$
BEGIN
  -- If email changed, update mirror table
  UPDATE public.users
  SET email = COALESCE(NEW.email, OLD.email),
      name  = COALESCE(NEW.raw_user_meta_data->>'name', COALESCE(OLD.raw_user_meta_data->>'name', NEW.email)),
      role  = COALESCE(NEW.raw_user_meta_data->>'role', COALESCE(OLD.raw_user_meta_data->>'role', 'content_manager'))
  WHERE id = NEW.id;

  -- If profile exists, update it
  UPDATE public.profiles
  SET name = COALESCE(NEW.raw_user_meta_data->>'name', COALESCE(OLD.raw_user_meta_data->>'name', split_part(NEW.email,'@',1))),
      role = COALESCE(NEW.raw_user_meta_data->>'role', COALESCE(OLD.raw_user_meta_data->>'role', 'content_manager'))
  WHERE id = NEW.id;

  -- If rows don't exist, insert them (idempotent)
  INSERT INTO public.users (id, email, name, role, created_at)
  SELECT NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)), COALESCE(NEW.raw_user_meta_data->>'role', 'content_manager'), now()
  WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id);

  INSERT INTO public.profiles (id, name, role, created_at)
  SELECT NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)), COALESCE(NEW.raw_user_meta_data->>'role', 'content_manager'), now()
  WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for UPDATE on auth.users
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_update_auth_user();

COMMIT;

-- USAGE NOTES ---------------------------------------------------------------
-- 1) Apply this migration in Supabase SQL editor to ensure role changes
--    saved in auth.users.user_metadata (or changes performed via Admin API)
--    will be reflected in your `public.users` and `public.profiles` mirror tables.
-- 2) If you already changed a role manually, run:
--    UPDATE public.users SET role = 'communications' WHERE email = 'user@example.com';
--    UPDATE public.profiles SET role = 'communications' WHERE id = (SELECT id FROM public.users WHERE email = 'user@example.com');
-- 3) After applying, changing the user's `user_metadata.role` via Admin API
--    or updating `auth.users` will sync automatically so login checks see the new role.
