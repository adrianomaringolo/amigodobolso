-- Free-form tags on entries + a per-user view of every tag already used
-- (feeds the tag autocomplete in the transaction form).

alter table public.entries
  add column if not exists tags text[] not null default '{}';

-- GIN index so tag filters / "array-contains" stay fast
create index if not exists entries_tags_gin_idx on public.entries using gin (tags);

-- Every distinct tag a user has created, with how many entries use it.
-- security_invoker => the caller's RLS on public.entries applies, so each
-- user only sees their own tags.
drop view if exists public.user_tags;

create view public.user_tags
  with (security_invoker = on) as
select
  e.user_id,
  t.tag,
  count(*) as uses
from public.entries e
cross join lateral unnest(e.tags) as t(tag)
where t.tag <> ''
group by e.user_id, t.tag;

grant select on public.user_tags to authenticated;
