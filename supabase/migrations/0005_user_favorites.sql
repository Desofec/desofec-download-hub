create table if not exists public.user_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  tool_id text not null check (char_length(tool_id) between 1 and 100),
  created_at timestamptz not null default now(),
  primary key (user_id, tool_id)
);

alter table public.user_favorites enable row level security;

drop policy if exists "Users can read their own favorites" on public.user_favorites;
create policy "Users can read their own favorites" on public.user_favorites
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can insert their own favorites" on public.user_favorites;
create policy "Users can insert their own favorites" on public.user_favorites
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own favorites" on public.user_favorites;
create policy "Users can delete their own favorites" on public.user_favorites
  for delete to authenticated using (auth.uid() = user_id);

revoke all on public.user_favorites from anon, authenticated;
grant select, insert, delete on public.user_favorites to authenticated;
