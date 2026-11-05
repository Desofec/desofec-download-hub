-- Explicit account snapshots; no automatic upload of browser drafts.
begin;

create table if not exists public.pilot_projects (
  user_id uuid not null references auth.users (id) on delete cascade,
  id uuid not null,
  version integer not null check (version > 0),
  document jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id),
  check (octet_length(document::text) <= 1100000)
);

alter table public.pilot_projects enable row level security;
revoke all on public.pilot_projects from public, anon, authenticated;
grant select on public.pilot_projects to authenticated;

drop policy if exists "Owners read private pilot projects" on public.pilot_projects;
create policy "Owners read private pilot projects" on public.pilot_projects
  for select to authenticated using ((select auth.uid()) = user_id);

create or replace function public.save_pilot_project(_id uuid, _document jsonb, _expected_version integer)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  _user uuid := auth.uid();
  _version integer;
begin
  if _user is null then raise exception 'Sign in to save an account project'; end if;
  if _id is null or _expected_version is null or _expected_version < 0
    or _document is null or jsonb_typeof(_document) <> 'object'
    or octet_length(_document::text) > 1100000 then
    raise exception 'Invalid project data';
  end if;
  if (_document->>'version') is distinct from '1'
    or (_document->>'id') is distinct from _id::text
    or coalesce(_document->>'pathId', '') not in (
      'ai-automation-services', 'ai-content-services', 'ai-cad-services',
      'micro-saas-validation', 'ai-education-services')
    or jsonb_typeof(_document->'title') is distinct from 'string'
    or length(trim(_document->>'title')) not between 1 and 120
    or jsonb_typeof(_document->'brief') is distinct from 'object'
    or jsonb_typeof(_document->'completed') is distinct from 'array'
    or not (_document ? 'proposal') or not (_document ? 'results') then
    raise exception 'Invalid project data';
  end if;
  if jsonb_typeof(_document->'brief'->'objective') is distinct from 'string'
    or jsonb_typeof(_document->'brief'->'scope') is distinct from 'string'
    or jsonb_typeof(_document->'brief'->'review') is distinct from 'string'
    or length(_document->'brief'->>'objective') > 2000
    or length(_document->'brief'->>'scope') > 2000
    or length(_document->'brief'->>'review') > 2000
    or jsonb_array_length(_document->'completed') > 5
    or exists (
      select 1 from jsonb_array_elements(_document->'completed') item
      where jsonb_typeof(item) <> 'string'
        or item #>> '{}' not in ('brief', 'scope', 'evidence', 'review', 'handover')
    )
    or (select count(distinct item) from jsonb_array_elements(_document->'completed') item)
      <> jsonb_array_length(_document->'completed')
    or jsonb_typeof(_document->'proposal') not in ('object', 'null')
    or jsonb_typeof(_document->'results') not in ('object', 'null') then
    raise exception 'Invalid project data';
  end if;

  -- Serialises quota checks and compare-and-swap writes for this owner.
  perform pg_advisory_xact_lock(hashtextextended(_user::text, 0));
  select version into _version from public.pilot_projects where user_id = _user and id = _id;
  if coalesce(_version, 0) <> _expected_version then
    raise exception 'Account project changed. Load its latest copy before saving';
  end if;
  if _version is null then
    if (select count(*) from public.pilot_projects where user_id = _user) >= 10 then
      raise exception 'Account project limit reached';
    end if;
    insert into public.pilot_projects (user_id, id, version, document)
      values (_user, _id, 1, _document);
    return 1;
  end if;
  update public.pilot_projects set document = _document, version = _version + 1, updated_at = now()
    where user_id = _user and id = _id;
  return _version + 1;
end;
$$;

create or replace function public.delete_pilot_project(_id uuid, _expected_version integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  _user uuid := auth.uid();
begin
  if _user is null then raise exception 'Sign in to delete an account project'; end if;
  perform pg_advisory_xact_lock(hashtextextended(_user::text, 0));
  delete from public.pilot_projects
    where user_id = _user and id = _id and version = _expected_version;
  if not found then raise exception 'Account project changed or was deleted. Refresh the account list'; end if;
end;
$$;

revoke all on function public.save_pilot_project(uuid, jsonb, integer) from public, anon;
revoke all on function public.delete_pilot_project(uuid, integer) from public, anon;
grant execute on function public.save_pilot_project(uuid, jsonb, integer) to authenticated;
grant execute on function public.delete_pilot_project(uuid, integer) to authenticated;

commit;
