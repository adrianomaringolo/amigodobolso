-- Links the installments of a split expense ("Celular (3/10)") so editing or
-- deleting one can also reach the ones after it. Until now each installment
-- was an independent row and only the "(n/N)" suffix in the description tied
-- them together.
--
--   installment_group  — same uuid on every installment of one purchase
--   installment_number — 1-based position inside the group

alter table public.entries
  add column if not exists installment_group uuid,
  add column if not exists installment_number smallint;

create index if not exists entries_user_installment_group_idx
  on public.entries (user_id, installment_group)
  where installment_group is not null;

-- ---------------------------------------------------------------------------
-- Backfill existing installments.
--
-- The form created every installment of a purchase with the same created_at,
-- so (user, times, description without suffix, created_at) identifies a
-- purchase exactly. Editing an installment used to overwrite created_at, so
-- edited ones are matched afterwards by (user, times, base description) when
-- there is exactly one group they can belong to.
-- ---------------------------------------------------------------------------

create temp table _installments as
select
  e.id,
  e.user_id,
  e.times,
  e.created_at,
  (regexp_match(e.description, '\((\d+)/\d+\)\s*$'))[1]::smallint as n,
  regexp_replace(e.description, '\s*\(\d+/\d+\)\s*$', '')          as base,
  null::uuid                                                        as grp
from public.entries e
where e.installment_group is null
  and e.times ~ '^\d+$'
  and e.times::int > 1
  and e.description ~ '\(\d+/\d+\)\s*$';

-- 1. installments created together
with batches as (
  select user_id, times, base, created_at, gen_random_uuid() as grp
  from _installments
  group by user_id, times, base, created_at
  having count(*) > 1
)
update _installments i
set grp = b.grp
from batches b
where i.user_id = b.user_id
  and i.times = b.times
  and i.base = b.base
  and i.created_at = b.created_at;

-- 2. edited installments: join the only group missing their number
with groups as (
  select distinct user_id, times, base, grp from _installments where grp is not null
),
candidates as (
  select o.id, g.grp
  from _installments o
  join groups g
    on g.user_id = o.user_id and g.times = o.times and g.base = o.base
  where o.grp is null
    and not exists (select 1 from _installments x where x.grp = g.grp and x.n = o.n)
    -- another orphan competing for the same slot => ambiguous, leave both alone
    and not exists (
      select 1 from _installments y
      where y.grp is null and y.id <> o.id
        and y.user_id = o.user_id and y.times = o.times and y.base = o.base and y.n = o.n
    )
),
single_match as (
  select id, min(grp::text)::uuid as grp
  from candidates
  group by id
  having count(*) = 1
)
update _installments i
set grp = s.grp
from single_match s
where i.id = s.id;

update public.entries e
set installment_group  = i.grp,
    installment_number = i.n
from _installments i
where e.id = i.id;

drop table _installments;
