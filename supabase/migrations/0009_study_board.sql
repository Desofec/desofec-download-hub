-- Study-group board: people post an opt-in "study with me" card for a goal, linked to a
-- workspace they own. Others ask to join and the poster approves. No emails are exposed.

create table if not exists public.study_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  workspace_id uuid not null references public.learning_workspaces (id) on delete cascade,
  goal_id text not null references public.goals (id) on delete cascade,
  display_name text not null check (
    char_length(trim(display_name)) between 2 and 30
    and position('@' in display_name) = 0
    and lower(display_name) !~ 'https?://|www\.'
  ),
  note text not null default '' check (
    char_length(note) <= 200
    and position('@' in note) = 0
    and lower(note) !~ 'https?://|www\.'
  ),
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 days',
  unique (user_id, goal_id)
);

create table if not exists public.study_requests (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.study_posts (id) on delete cascade,
  requester_id uuid not null references auth.users (id) on delete cascade,
  display_name text not null check (
    char_length(trim(display_name)) between 2 and 30
    and position('@' in display_name) = 0
    and lower(display_name) !~ 'https?://|www\.'
  ),
  message text not null default '' check (
    char_length(message) <= 200
    and position('@' in message) = 0
    and lower(message) !~ 'https?://|www\.'
  ),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  created_at timestamptz not null default now(),
  unique (post_id, requester_id)
);

create table if not exists public.study_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.study_posts (id) on delete cascade,
  reporter_id uuid not null references auth.users (id) on delete cascade,
  reason text not null check (char_length(trim(reason)) between 3 and 60),
  created_at timestamptz not null default now(),
  unique (post_id, reporter_id)
);

-- All access goes through the functions below. RLS is on with no policies, so direct
-- table access is denied for everyone except the database owner.
alter table public.study_posts enable row level security;
alter table public.study_requests enable row level security;
alter table public.study_reports enable row level security;
revoke all on public.study_posts, public.study_requests, public.study_reports from anon, authenticated;

create or replace function public.list_study_posts(_goal_id text default null)
returns table (
  id uuid,
  goal_id text,
  display_name text,
  note text,
  created_at timestamptz,
  mine boolean,
  my_request_status text,
  joined_workspace_id uuid
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.id,
    p.goal_id,
    p.display_name,
    p.note,
    p.created_at,
    p.user_id = (select auth.uid()) as mine,
    r.status as my_request_status,
    case when r.status = 'approved' then p.workspace_id else null end as joined_workspace_id
  from public.study_posts p
  left join public.study_requests r
    on r.post_id = p.id and r.requester_id = (select auth.uid())
  where (select auth.uid()) is not null
    and p.expires_at > now()
    and (p.hidden = false or p.user_id = (select auth.uid()))
    and (_goal_id is null or p.goal_id = _goal_id)
  order by p.created_at desc
  limit 50;
$$;

create or replace function public.create_study_post(
  _workspace_id uuid,
  _goal_id text,
  _display_name text,
  _note text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_id uuid;
begin
  if auth.uid() is null or not public.is_workspace_owner(_workspace_id) then
    raise exception 'Choose a workspace that you own';
  end if;

  delete from public.study_posts where user_id = auth.uid() and expires_at <= now();

  if (select count(*) from public.study_posts where user_id = auth.uid()) >= 3 then
    raise exception 'You can have at most 3 active study posts';
  end if;

  insert into public.study_posts (user_id, workspace_id, goal_id, display_name, note)
  values (auth.uid(), _workspace_id, _goal_id, trim(_display_name), trim(coalesce(_note, '')))
  returning id into new_id;

  return new_id;
exception
  when unique_violation then
    raise exception 'You already have a study post for this goal';
end;
$$;

create or replace function public.delete_study_post(_post_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.study_posts where id = _post_id and user_id = auth.uid();
$$;

create or replace function public.request_to_join_study_post(
  _post_id uuid,
  _display_name text,
  _message text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target public.study_posts%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Sign in first';
  end if;

  select * into target
  from public.study_posts
  where id = _post_id and expires_at > now() and hidden = false;

  if not found then
    raise exception 'This study post is no longer available';
  end if;

  if target.user_id = auth.uid() or public.is_workspace_member(target.workspace_id) then
    raise exception 'You are already part of this group';
  end if;

  if (select count(*) from public.study_requests
      where requester_id = auth.uid() and status = 'pending') >= 10 then
    raise exception 'You have too many pending requests';
  end if;

  insert into public.study_requests (post_id, requester_id, display_name, message)
  values (_post_id, auth.uid(), trim(_display_name), trim(coalesce(_message, '')));
exception
  when unique_violation then
    raise exception 'You already asked to join this group';
end;
$$;

create or replace function public.list_study_requests()
returns table (
  id uuid,
  post_id uuid,
  goal_id text,
  display_name text,
  message text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select r.id, r.post_id, p.goal_id, r.display_name, r.message, r.created_at
  from public.study_requests r
  join public.study_posts p on p.id = r.post_id
  where p.user_id = (select auth.uid())
    and r.status = 'pending'
  order by r.created_at asc
  limit 50;
$$;

create or replace function public.respond_to_study_request(_request_id uuid, _approve boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  request public.study_requests%rowtype;
  target public.study_posts%rowtype;
begin
  select * into request from public.study_requests where id = _request_id and status = 'pending' for update;
  if not found then
    raise exception 'This request is no longer pending';
  end if;

  select * into target from public.study_posts where id = request.post_id and user_id = auth.uid();
  if not found or not public.is_workspace_owner(target.workspace_id) then
    raise exception 'Only the poster can answer this request';
  end if;

  if _approve then
    insert into public.workspace_members (workspace_id, user_id, role)
    values (target.workspace_id, request.requester_id, 'member')
    on conflict (workspace_id, user_id) do nothing;
  end if;

  update public.study_requests
  set status = case when _approve then 'approved' else 'declined' end
  where id = request.id;
end;
$$;

create or replace function public.report_study_post(_post_id uuid, _reason text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in first';
  end if;

  insert into public.study_reports (post_id, reporter_id, reason)
  values (_post_id, auth.uid(), trim(_reason))
  on conflict (post_id, reporter_id) do nothing;

  -- Three different reporters hide a post until the owner of the project reviews it.
  update public.study_posts
  set hidden = true
  where id = _post_id
    and (select count(*) from public.study_reports where post_id = _post_id) >= 3;
end;
$$;

revoke all on function public.list_study_posts(text) from public, anon;
revoke all on function public.create_study_post(uuid, text, text, text) from public, anon;
revoke all on function public.delete_study_post(uuid) from public, anon;
revoke all on function public.request_to_join_study_post(uuid, text, text) from public, anon;
revoke all on function public.list_study_requests() from public, anon;
revoke all on function public.respond_to_study_request(uuid, boolean) from public, anon;
revoke all on function public.report_study_post(uuid, text) from public, anon;
grant execute on function public.list_study_posts(text) to authenticated;
grant execute on function public.create_study_post(uuid, text, text, text) to authenticated;
grant execute on function public.delete_study_post(uuid) to authenticated;
grant execute on function public.request_to_join_study_post(uuid, text, text) to authenticated;
grant execute on function public.list_study_requests() to authenticated;
grant execute on function public.respond_to_study_request(uuid, boolean) to authenticated;
grant execute on function public.report_study_post(uuid, text) to authenticated;
