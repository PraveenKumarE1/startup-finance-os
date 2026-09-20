-- ─────────────────────────────────────────────────────────
-- StartupFinance OS — Supabase Schema
-- Run this in the Supabase SQL editor after creating a project.
-- ─────────────────────────────────────────────────────────

-- Core: profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'founder' check (role in ('founder','admin','member','viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Core: startups
create table startups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  description text,
  industry text,
  stage text not null default 'idea'
    check (stage in ('idea','pre-seed','seed','series-a','series-b','growth')),
  founded_date date,
  website text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table startups enable row level security;

-- Memberships (many-to-many users <-> startups)
create table startup_members (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references startups (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('founder','admin','member','viewer')),
  created_at timestamptz not null default now(),
  unique (startup_id, user_id)
);

alter table startup_members enable row level security;

-- Module: investors (fundraising CRM)
create table investors (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references startups (id) on delete cascade,
  name text not null,
  firm text,
  email text,
  linkedin text,
  twitter text,
  type text not null default 'vc'
    check (type in ('angel','vc','corporate','accelerator','fund')),
  stage_focus text[] default '{}',
  check_size_min numeric,
  check_size_max numeric,
  portfolio_companies text[] default '{}',
  status text not null default 'prospect'
    check (status in ('prospect','contacted','meeting','due-diligence','term-sheet','invested','passed')),
  last_contact date,
  next_followup date,
  notes text,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index investors_startup_idx on investors (startup_id);
alter table investors enable row level security;

-- Module: fundraising rounds
create table fundraising_rounds (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references startups (id) on delete cascade,
  name text not null,
  target_amount numeric not null default 0,
  raised_amount numeric not null default 0,
  currency text not null default 'USD',
  valuation_pre numeric,
  valuation_post numeric,
  instrument text not null default 'safe'
    check (instrument in ('equity','safe','convertible-note','token')),
  status text not null default 'planning'
    check (status in ('planning','active','closed','paused')),
  opened_date date,
  closed_date date,
  investor_ids uuid[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table fundraising_rounds enable row level security;

-- Module: financial projections
create table financial_projections (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references startups (id) on delete cascade,
  name text not null,
  scenario text not null default 'base'
    check (scenario in ('conservative','base','aggressive')),
  months int not null default 12,
  starting_cash numeric not null default 0,
  monthly_data jsonb not null default '[]',
  assumptions jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table financial_projections enable row level security;

-- Module: cap table
create table cap_table_entries (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references startups (id) on delete cascade,
  name text not null,
  entity_type text not null
    check (entity_type in ('founder','employee','advisor','investor','pool')),
  shares bigint not null default 0,
  share_class text not null default 'common'
    check (share_class in ('common','preferred','options')),
  percentage numeric not null default 0,
  cost_basis numeric,
  vesting_start date,
  vesting_months int,
  cliff_months int default 0,
  invested_amount numeric,
  valuation_cap numeric,
  discount numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table cap_table_entries enable row level security;

-- Module: metric snapshots
create table metric_snapshots (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references startups (id) on delete cascade,
  date date not null,
  mrr numeric default 0,
  arr numeric default 0,
  revenue numeric default 0,
  customers int default 0,
  new_customers int default 0,
  churned_customers int default 0,
  churn_rate numeric default 0,
  cac numeric default 0,
  ltv numeric default 0,
  ltv_cac_ratio numeric default 0,
  gross_margin numeric default 0,
  burn_rate numeric default 0,
  runway_months numeric default 0,
  cash_balance numeric default 0,
  headcount int default 0,
  unique (startup_id, date),
  created_at timestamptz not null default now()
);

alter table metric_snapshots enable row level security;

-- Module: investor updates
create table investor_updates (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references startups (id) on delete cascade,
  title text not null,
  period_start date,
  period_end date,
  highlights text[] default '{}',
  challenges text[] default '{}',
  asks text[] default '{}',
  metrics jsonb not null default '{}',
  financials jsonb not null default '{}',
  status text not null default 'draft' check (status in ('draft','sent')),
  sent_at timestamptz,
  recipient_ids uuid[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table investor_updates enable row level security;

-- ─────────────────────────────────────────────────────────
-- Row Level Security policies (helpers)
-- Each user only sees data for startups they belong to.
-- ─────────────────────────────────────────────────────────

create or replace function current_startup_ids() returns uuid[]
language sql security definer set search_path = public as $$
  select coalesce(array_agg(startup_id), '{}')
  from startup_members
  where user_id = auth.uid();
$$;

create policy "view own profile" on profiles
  for select using (auth.uid() = id);
create policy "update own profile" on profiles
  for update using (auth.uid() = id);

create policy "view member startups" on startups
  for select using (id = any (current_startup_ids()));
create policy "insert owned startup" on startups
  for insert with check (created_by = auth.uid());

create policy "view module data" on investors
  for select using (startup_id = any (current_startup_ids()));
create policy "write module data" on investors
  for all using (startup_id = any (current_startup_ids()));

create policy "view module data" on fundraising_rounds
  for select using (startup_id = any (current_startup_ids()));
create policy "write module data" on fundraising_rounds
  for all using (startup_id = any (current_startup_ids()));

create policy "view module data" on financial_projections
  for select using (startup_id = any (current_startup_ids()));
create policy "write module data" on financial_projections
  for all using (startup_id = any (current_startup_ids()));

create policy "view module data" on cap_table_entries
  for select using (startup_id = any (current_startup_ids()));
create policy "write module data" on cap_table_entries
  for all using (startup_id = any (current_startup_ids()));

create policy "view module data" on metric_snapshots
  for select using (startup_id = any (current_startup_ids()));
create policy "write module data" on metric_snapshots
  for all using (startup_id = any (current_startup_ids()));

create policy "view module data" on investor_updates
  for select using (startup_id = any (current_startup_ids()));
create policy "write module data" on investor_updates
  for all using (startup_id = any (current_startup_ids()));

-- ─────────────────────────────────────────────────────────
-- Optional: auto-create a "created_at" trigger helper
-- ─────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();
create trigger trg_startups_updated before update on startups
  for each row execute function set_updated_at();
create trigger trg_investors_updated before update on investors
  for each row execute function set_updated_at();
create trigger trg_fundraising_rounds_updated before update on fundraising_rounds
  for each row execute function set_updated_at();
create trigger trg_financial_projections_updated before update on financial_projections
  for each row execute function set_updated_at();
create trigger trg_cap_table_entries_updated before update on cap_table_entries
  for each row execute function set_updated_at();
create trigger trg_investor_updates_updated before update on investor_updates
  for each row execute function set_updated_at();