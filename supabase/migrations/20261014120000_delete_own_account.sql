-- Lets a signed-in user delete their own account from the profile page.
-- Removing the auth.users row cascades to public.entries (tags included)
-- and public.article_reads via their "on delete cascade" foreign keys.
-- security definer => runs with the owner's rights, but only ever touches
-- the caller's own row (auth.uid()).

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
