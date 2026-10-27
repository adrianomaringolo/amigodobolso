-- Adds per-user entry totals to the admin users list: how many entries the
-- user has registered and when they registered the latest one (created_at,
-- i.e. when it was launched, not the entry's own `date`).
-- The return type changes, so the function has to be dropped and recreated.

drop function if exists public.admin_list_users();

create function public.admin_list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  provider text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  entries_count bigint,
  last_entry_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    raise exception 'Not authorized';
  end if;

  return query
  select
    u.id,
    u.email::text,
    coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'),
    u.raw_app_meta_data ->> 'provider',
    u.created_at,
    u.last_sign_in_at,
    coalesce(e.entries_count, 0),
    e.last_entry_at
  from auth.users u
  left join (
    select
      en.user_id,
      count(*) as entries_count,
      max(en.created_at) as last_entry_at
    from public.entries en
    group by en.user_id
  ) e on e.user_id = u.id
  order by u.created_at desc;
end;
$$;

revoke all on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;
