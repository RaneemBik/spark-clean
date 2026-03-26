-- PostgreSQL schema for SparkClean (Supabase-compatible)
-- Includes table definitions, indexes, constraints and enables RLS on all tables.
-- Run this in Supabase SQL Editor. Adjust RLS policies as needed for your app.

-- Required extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Roles & Permissions
CREATE TABLE IF NOT EXISTS public.roles (
  id bigserial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  label text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.permissions (
  name text PRIMARY KEY,
  description text
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_name text NOT NULL,
  permission_name text NOT NULL,
  PRIMARY KEY (role_name, permission_name),
  FOREIGN KEY (role_name) REFERENCES public.roles(name) ON DELETE CASCADE,
  FOREIGN KEY (permission_name) REFERENCES public.permissions(name) ON DELETE CASCADE
);

-- Invitations (admin-created invite records)
CREATE TABLE IF NOT EXISTS public.invitations (
  id bigserial PRIMARY KEY,
  email text NOT NULL,
  name text,
  role text,
  token text NOT NULL UNIQUE,
  expires_at timestamptz,
  used boolean DEFAULT false,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Mirror of auth.users for convenience/lookups
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  name text,
  role text,
  created_at timestamptz DEFAULT now()
);

-- Profiles table (mirror / application profile data)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  name text,
  role text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Content tables
CREATE TABLE IF NOT EXISTS public.home_content (
  id integer PRIMARY KEY,
  badge text,
  hero_title text,
  hero_gradient text,
  hero_subtitle text,
  hero_cta text,
  hero_image text,
  why_title text,
  why_subtitle text,
  why_image text,
  why_point1_title text,
  why_point1_desc text,
  why_point2_title text,
  why_point2_desc text,
  why_point3_title text,
  why_point3_desc text,
  meta_title text,
  meta_desc text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.about_content (
  id integer PRIMARY KEY,
  heading text,
  subheading text,
  story_p1 text,
  story_p2 text,
  story_p3 text,
  story_image text,
  values jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.services (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text,
  price_note text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer DEFAULT 0,
  published boolean DEFAULT true,
  is_trashed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id serial PRIMARY KEY,
  slug text UNIQUE,
  title text NOT NULL,
  category text,
  location text,
  client_type text,
  completion_date text,
  image text,
  summary text,
  details text,
  before_after_notes text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  published boolean DEFAULT true,
  is_trashed boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id serial PRIMARY KEY,
  slug text UNIQUE,
  title text NOT NULL,
  category text,
  excerpt text,
  content text,
  author text,
  image text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text DEFAULT 'draft',
  is_trashed boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.news_items (
  id serial PRIMARY KEY,
  slug text UNIQUE,
  title text NOT NULL,
  summary text,
  content text,
  image text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text DEFAULT 'draft',
  is_trashed boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id serial PRIMARY KEY,
  first_name text,
  last_name text,
  email text,
  phone text,
  subject text,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_submissions (
  id serial PRIMARY KEY,
  project_id integer REFERENCES public.projects(id) ON DELETE SET NULL,
  project_title text,
  name text,
  email text,
  phone text,
  service text,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.appointments (
  id serial PRIMARY KEY,
  service_id integer REFERENCES public.services(id) ON DELETE SET NULL,
  name text,
  email text,
  phone text,
  location text,
  appointment_start timestamptz,
  appointment_end timestamptz,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_published_at ON public.news_items (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_start ON public.appointments (appointment_start);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- Enable Row Level Security on all tables (policies must be added separately)
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- NOTE: Supabase requires explicit RLS policies to allow reads/writes for users/service role.
-- For local development you may need to create permissive policies or run with a SERVICE_ROLE key.
