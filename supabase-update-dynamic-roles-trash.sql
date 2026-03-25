-- ============================================================
-- SparkClean DB Update: Dynamic Roles + Trash Restore
-- Run in Supabase SQL Editor for existing databases
-- Date: 2026-03-25
-- ============================================================

-- 1) Allow dynamic role names (remove fixed role checks)
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.users drop constraint if exists users_role_check;

-- 2) Add soft-delete flags for content that supports trash/restore
alter table public.projects add column if not exists is_trashed boolean not null default false;
alter table public.blog_posts add column if not exists is_trashed boolean not null default false;
alter table public.news_items add column if not exists is_trashed boolean not null default false;

-- Expand status checks to include trashed
alter table public.blog_posts drop constraint if exists blog_posts_status_check;
alter table public.blog_posts add constraint blog_posts_status_check
  check (status in ('published','draft','trashed'));

alter table public.news_items drop constraint if exists news_items_status_check;
alter table public.news_items add constraint news_items_status_check
  check (status in ('published','draft','trashed'));

-- 3) Dynamic role model
create extension if not exists "uuid-ossp";

create table if not exists public.permissions (
  name        text primary key,
  description text not null,
  created_at  timestamptz default now()
);

create table if not exists public.roles (
  id          uuid primary key default uuid_generate_v4(),
  name        text unique not null,
  label       text not null,
  created_at  timestamptz default now()
);

create table if not exists public.role_permissions (
  role_name       text not null references public.roles(name) on delete cascade,
  permission_name text not null references public.permissions(name) on delete cascade,
  created_at      timestamptz default now(),
  primary key (role_name, permission_name)
);

insert into public.permissions (name, description) values
  ('manage_users', 'Manage users and roles'),
  ('edit_home', 'Edit Home page'),
  ('edit_about', 'Edit About page'),
  ('edit_services', 'Edit Services page'),
  ('edit_projects', 'Create/update/delete projects'),
  ('edit_blog', 'Create/update/delete blog posts'),
  ('edit_news', 'Create/update/delete news items'),
  ('reply_messages', 'Reply to contact and appointment messages'),
  ('view_contact_submissions', 'View contact submissions'),
  ('view_appointments', 'View appointments'),
  ('view_project_submissions', 'View project submissions'),
  ('manage_settings', 'Manage settings')
on conflict (name) do nothing;

insert into public.roles (name, label) values
  ('super_admin', 'Super Admin'),
  ('content_manager', 'Content Manager'),
  ('communications', 'Communications')
on conflict (name) do nothing;

insert into public.role_permissions (role_name, permission_name) values
  ('super_admin', 'manage_users'),
  ('super_admin', 'edit_home'),
  ('super_admin', 'edit_about'),
  ('super_admin', 'edit_services'),
  ('super_admin', 'edit_projects'),
  ('super_admin', 'edit_blog'),
  ('super_admin', 'edit_news'),
  ('super_admin', 'view_contact_submissions'),
  ('super_admin', 'view_project_submissions'),
  ('super_admin', 'view_appointments'),
  ('super_admin', 'reply_messages'),
  ('super_admin', 'manage_settings'),
  ('content_manager', 'edit_home'),
  ('content_manager', 'edit_about'),
  ('content_manager', 'edit_services'),
  ('content_manager', 'edit_projects'),
  ('content_manager', 'edit_blog'),
  ('content_manager', 'edit_news'),
  ('communications', 'view_contact_submissions'),
  ('communications', 'view_appointments'),
  ('communications', 'reply_messages')
on conflict do nothing;

-- 4) Update public-read RLS policies to hide trashed content
drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects" on public.projects
  for select using (published = true and is_trashed = false);

drop policy if exists "Public can read blogs" on public.blog_posts;
create policy "Public can read blogs" on public.blog_posts
  for select using (status = 'published' and is_trashed = false);

drop policy if exists "Public can read news" on public.news_items;
create policy "Public can read news" on public.news_items
  for select using (status = 'published' and is_trashed = false);

-- 5) Read access for role metadata (for dashboard role UI)
alter table public.permissions enable row level security;
drop policy if exists "Auth can read permissions" on public.permissions;
create policy "Auth can read permissions" on public.permissions
  for select using (auth.role() = 'authenticated');

alter table public.roles enable row level security;
drop policy if exists "Auth can read roles" on public.roles;
create policy "Auth can read roles" on public.roles
  for select using (auth.role() = 'authenticated');
drop policy if exists "Auth can manage roles" on public.roles;
create policy "Auth can manage roles" on public.roles
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

alter table public.role_permissions enable row level security;
drop policy if exists "Auth can read role permissions" on public.role_permissions;
create policy "Auth can read role permissions" on public.role_permissions
  for select using (auth.role() = 'authenticated');
drop policy if exists "Auth can manage role permissions" on public.role_permissions;
create policy "Auth can manage role permissions" on public.role_permissions
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
