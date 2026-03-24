create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  company text,
  role text,
  workflow_focus text[] default '{}',
  preferred_tools text[] default '{}',
  primary_goal text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan_name text not null default 'Free',
  preferred_model text not null default 'groq',
  groq_key_hint text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_settings
  alter column preferred_model set default 'groq';

alter table public.user_settings
  add column if not exists groq_key_hint text;

alter table public.user_settings
  drop column if exists openai_key_hint;

alter table public.user_settings
  drop column if exists anthropic_key_hint;

create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  prompt text not null,
  trigger_type text not null default 'manual',
  provider_mode text not null default 'auto',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  workflow_name text not null,
  status text not null default 'completed',
  summary text,
  output jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_runs enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "settings_select_own" on public.user_settings;
drop policy if exists "settings_insert_own" on public.user_settings;
drop policy if exists "settings_update_own" on public.user_settings;
create policy "settings_select_own" on public.user_settings
  for select using (auth.uid() = user_id);
create policy "settings_insert_own" on public.user_settings
  for insert with check (auth.uid() = user_id);
create policy "settings_update_own" on public.user_settings
  for update using (auth.uid() = user_id);

drop policy if exists "workflows_select_own" on public.workflows;
drop policy if exists "workflows_insert_own" on public.workflows;
drop policy if exists "workflows_update_own" on public.workflows;
drop policy if exists "workflows_delete_own" on public.workflows;
create policy "workflows_select_own" on public.workflows
  for select using (auth.uid() = user_id);
create policy "workflows_insert_own" on public.workflows
  for insert with check (auth.uid() = user_id);
create policy "workflows_update_own" on public.workflows
  for update using (auth.uid() = user_id);
create policy "workflows_delete_own" on public.workflows
  for delete using (auth.uid() = user_id);

drop policy if exists "runs_select_own" on public.workflow_runs;
drop policy if exists "runs_insert_own" on public.workflow_runs;
create policy "runs_select_own" on public.workflow_runs
  for select using (auth.uid() = user_id);
create policy "runs_insert_own" on public.workflow_runs
  for insert with check (auth.uid() = user_id);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute procedure public.handle_updated_at();

drop trigger if exists user_settings_updated_at on public.user_settings;
create trigger user_settings_updated_at
before update on public.user_settings
for each row execute procedure public.handle_updated_at();

drop trigger if exists workflows_updated_at on public.workflows;
create trigger workflows_updated_at
before update on public.workflows
for each row execute procedure public.handle_updated_at();
