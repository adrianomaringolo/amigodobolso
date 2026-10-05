-- Reading progress for the Centro Educacional: which articles each user has
-- marked as read. Slugs look like "financas-101/01-para-onde-vai-o-dinheiro".

create table if not exists public.article_reads (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  article_slug text not null,
  read_at      timestamptz not null default now(),
  unique (user_id, article_slug)
);

create index if not exists article_reads_user_idx
  on public.article_reads (user_id, read_at desc);

alter table public.article_reads enable row level security;

drop policy if exists "Users select own reads" on public.article_reads;
drop policy if exists "Users insert own reads" on public.article_reads;
drop policy if exists "Users update own reads" on public.article_reads;
drop policy if exists "Users delete own reads" on public.article_reads;

create policy "Users select own reads"
  on public.article_reads for select to authenticated
  using (auth.uid() = user_id);

create policy "Users insert own reads"
  on public.article_reads for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users update own reads"
  on public.article_reads for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users delete own reads"
  on public.article_reads for delete to authenticated
  using (auth.uid() = user_id);
