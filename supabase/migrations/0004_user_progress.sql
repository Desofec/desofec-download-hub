create table if not exists public.user_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  item_type text not null check (item_type in ('path', 'pack')),
  item_id text not null,
  completed_steps integer[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, item_type, item_id),
  check (array_position(completed_steps, null) is null),
  check (0 <= all(completed_steps) and 1000 >= all(completed_steps))
);

alter table public.user_progress enable row level security;

drop policy if exists "Users can read their own progress" on public.user_progress;
create policy "Users can read their own progress" on public.user_progress
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can insert their own progress" on public.user_progress;
create policy "Users can insert their own progress" on public.user_progress
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can update their own progress" on public.user_progress;
create policy "Users can update their own progress" on public.user_progress
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

revoke all on public.user_progress from anon, authenticated;
grant select, insert, update on public.user_progress to authenticated;
