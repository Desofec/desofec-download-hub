create table if not exists public.learning_workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 80),
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.learning_workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.workspace_invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.learning_workspaces (id) on delete cascade,
  email text not null check (char_length(trim(email)) between 3 and 320),
  token_hash text not null unique check (token_hash ~ '^[a-f0-9]{64}$'),
  role text not null default 'member' check (role = 'member'),
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  accepted_at timestamptz
);

create table if not exists public.workspace_shared_items (
  workspace_id uuid not null references public.learning_workspaces (id) on delete cascade,
  item_type text not null check (item_type in ('path', 'pack', 'tutorial', 'tool')),
  item_id text not null check (char_length(trim(item_id)) between 1 and 100),
  shared_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (workspace_id, item_type, item_id)
);

create or replace function public.is_workspace_member(_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = _workspace_id
      and user_id = (select auth.uid())
  );
$$;

create or replace function public.is_workspace_owner(_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = _workspace_id
      and user_id = (select auth.uid())
      and role = 'owner'
  );
$$;

create or replace function public.add_workspace_creator_as_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new.id, new.created_by, 'owner');
  return new;
end;
$$;

drop trigger if exists add_workspace_creator_as_owner on public.learning_workspaces;
create trigger add_workspace_creator_as_owner
  after insert on public.learning_workspaces
  for each row execute function public.add_workspace_creator_as_owner();

create or replace function public.create_workspace_invitation(
  _workspace_id uuid,
  _email text,
  _token_hash text,
  _expires_at timestamptz
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_workspace_owner(_workspace_id) then
    raise exception 'Only workspace owners can invite members';
  end if;

  if char_length(trim(_email)) not between 3 and 320
    or position('@' in trim(_email)) < 2
    or position('.' in split_part(trim(_email), '@', 2)) < 2
  then
    raise exception 'Enter a valid email address';
  end if;

  if _token_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid invitation token';
  end if;

  if _expires_at <= now() or _expires_at > now() + interval '7 days' then
    raise exception 'Invitation expiry must be within the next 7 days';
  end if;

  insert into public.workspace_invitations (
    workspace_id, email, token_hash, created_by, expires_at
  )
  values (
    _workspace_id, lower(trim(_email)), lower(_token_hash), auth.uid(), _expires_at
  );
end;
$$;

create or replace function public.accept_workspace_invitation(_token_hash text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  invitation public.workspace_invitations%rowtype;
  account_email text;
  email_confirmed_at timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Sign in before accepting a workspace invitation';
  end if;

  select lower(email), auth.users.email_confirmed_at
  into account_email, email_confirmed_at
  from auth.users
  where id = auth.uid();

  if account_email is null or email_confirmed_at is null then
    raise exception 'Your account must have a verified email address';
  end if;

  select *
  into invitation
  from public.workspace_invitations
  where token_hash = lower(_token_hash)
    and accepted_at is null
    and expires_at > now()
    and lower(email) = account_email
  for update;

  if not found then
    raise exception 'Invitation is invalid, expired, already used, or for another email address';
  end if;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (invitation.workspace_id, auth.uid(), invitation.role)
  on conflict (workspace_id, user_id) do nothing;

  update public.workspace_invitations
  set accepted_at = now()
  where id = invitation.id;

  return invitation.workspace_id;
end;
$$;

alter table public.learning_workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_invitations enable row level security;
alter table public.workspace_shared_items enable row level security;

drop policy if exists "Workspace members can read their workspaces" on public.learning_workspaces;
create policy "Workspace members can read their workspaces" on public.learning_workspaces
  for select to authenticated using (public.is_workspace_member(id));

drop policy if exists "Authenticated users can create workspaces" on public.learning_workspaces;
create policy "Authenticated users can create workspaces" on public.learning_workspaces
  for insert to authenticated with check (created_by = (select auth.uid()));

drop policy if exists "Workspace owners can rename workspaces" on public.learning_workspaces;
create policy "Workspace owners can rename workspaces" on public.learning_workspaces
  for update to authenticated
  using (public.is_workspace_owner(id))
  with check (public.is_workspace_owner(id) and created_by = (select auth.uid()));

drop policy if exists "Workspace owners can delete workspaces" on public.learning_workspaces;
create policy "Workspace owners can delete workspaces" on public.learning_workspaces
  for delete to authenticated using (public.is_workspace_owner(id));

drop policy if exists "Workspace members can read membership" on public.workspace_members;
create policy "Workspace members can read membership" on public.workspace_members
  for select to authenticated using (public.is_workspace_member(workspace_id));

drop policy if exists "Owners and invitees can read invitations" on public.workspace_invitations;
create policy "Owners and invitees can read invitations" on public.workspace_invitations
  for select to authenticated
  using (
    public.is_workspace_owner(workspace_id)
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

drop policy if exists "Workspace members can read shared items" on public.workspace_shared_items;
create policy "Workspace members can read shared items" on public.workspace_shared_items
  for select to authenticated using (public.is_workspace_member(workspace_id));

drop policy if exists "Workspace members can share catalog items" on public.workspace_shared_items;
create policy "Workspace members can share catalog items" on public.workspace_shared_items
  for insert to authenticated
  with check (public.is_workspace_member(workspace_id) and shared_by = (select auth.uid()));

drop policy if exists "Owners and sharers can remove shared items" on public.workspace_shared_items;
create policy "Owners and sharers can remove shared items" on public.workspace_shared_items
  for delete to authenticated
  using (public.is_workspace_owner(workspace_id) or shared_by = (select auth.uid()));

revoke all on public.learning_workspaces, public.workspace_members,
  public.workspace_invitations, public.workspace_shared_items from anon, authenticated;
grant select, insert, update, delete on public.learning_workspaces to authenticated;
grant select on public.workspace_members to authenticated;
grant select on public.workspace_invitations to authenticated;
grant select, insert, delete on public.workspace_shared_items to authenticated;

revoke all on function public.is_workspace_member(uuid) from public, anon;
revoke all on function public.is_workspace_owner(uuid) from public, anon;
revoke all on function public.add_workspace_creator_as_owner() from public, anon, authenticated;
revoke all on function public.create_workspace_invitation(uuid, text, text, timestamptz) from public, anon;
revoke all on function public.accept_workspace_invitation(text) from public, anon;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.is_workspace_owner(uuid) to authenticated;
grant execute on function public.create_workspace_invitation(uuid, text, text, timestamptz) to authenticated;
grant execute on function public.accept_workspace_invitation(text) to authenticated;
