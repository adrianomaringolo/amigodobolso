-- Lets an admin list the registered users on the /admin page.
-- auth.users is not reachable through the API, so this security definer
-- function exposes only the columns the page needs, and only when the
-- caller's JWT carries app_metadata.role = 'admin' (same claim the
-- middleware checks).

create or replace function public.admin_list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  provider text,
  created_at timestamptz,
  last_sign_in_at timestamptz
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
    u.last_sign_in_at
  from auth.users u
  order by u.created_at desc;
end;
$$;

revoke all on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;
