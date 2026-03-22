-- Create invitations table for invite-based user onboarding
create table if not exists public.invitations (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  name text,
  role text not null,
  token text not null unique,
  expires_at timestamptz not null,
  used boolean default false,
  created_at timestamptz default now(),
  used_at timestamptz
);

create index if not exists idx_invitations_token on public.invitations(token);
