-- Reconstructed from application code (repo had no migrations).
-- Source: src/services/entries/*, src/lib/types/Entry.type.ts,
--         src/components/financial/transaction-form.tsx, src/components/reports/*
--
-- Financial model: a single `entries` table. Sign of `amount` encodes the type
-- (amount > 0 => income, amount < 0 => expense). `date` is stored as an ISO
-- string because the client filters it with `.like('date', 'YYYY-MM%')`.

create extension if not exists "pgcrypto";

create table if not exists public.entries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  amount       numeric(14, 2) not null default 0,
  description  text not null default '',
  category     text not null default '',
  notes        text,
  times        text,
  is_completed boolean not null default true,
  date         text not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz
);

create index if not exists entries_user_id_idx   on public.entries (user_id);
create index if not exists entries_user_date_idx on public.entries (user_id, date);

alter table public.entries enable row level security;

drop policy if exists "Users select own entries" on public.entries;
drop policy if exists "Users insert own entries" on public.entries;
drop policy if exists "Users update own entries" on public.entries;
drop policy if exists "Users delete own entries" on public.entries;

create policy "Users select own entries"
  on public.entries for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users insert own entries"
  on public.entries for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users update own entries"
  on public.entries for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own entries"
  on public.entries for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.entries to authenticated;

-- Per-user monthly aggregation consumed by src/services/entries/useGetMonthlyEntrySums.ts
-- security_invoker => the caller's RLS on public.entries applies, so each user
-- only sees their own totals.
drop view if exists public.monthly_income_expense_summary;

create view public.monthly_income_expense_summary
  with (security_invoker = on) as
select
  (substring(e.date from 1 for 4))::int                       as year,
  (substring(e.date from 6 for 2))::int                       as month,
  coalesce(sum(e.amount)  filter (where e.amount > 0), 0)     as total_income,
  coalesce(sum(-e.amount) filter (where e.amount < 0), 0)     as total_expense
from public.entries e
group by 1, 2
order by 1, 2;

grant select on public.monthly_income_expense_summary to authenticated;
