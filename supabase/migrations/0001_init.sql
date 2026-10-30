-- Desofec AI Studio catalog schema.
-- Content is public read-only; writes require the service role (bypasses RLS).

create table if not exists public.goals (
  id text primary key,
  name text not null,
  description text not null,
  badge text not null,
  position integer not null default 0
);

create table if not exists public.tools (
  id text primary key,
  name text not null,
  category text not null,
  skill text not null,
  description text not null,
  badge text not null,
  position integer not null default 0
);

create table if not exists public.starter_packs (
  id text primary key,
  title text not null,
  description text not null,
  level text not null,
  file_path text not null,
  position integer not null default 0
);

create table if not exists public.paths (
  id text primary key,
  title text not null,
  level text not null,
  description text not null,
  badge text not null,
  goal_id text not null references public.goals (id) on delete restrict,
  steps text[] not null default '{}',
  position integer not null default 0
);

create table if not exists public.recommendations (
  goal_id text primary key references public.goals (id) on delete cascade,
  title text not null,
  summary text not null,
  steps text[] not null default '{}'
);

create table if not exists public.recommendation_tools (
  goal_id text not null references public.recommendations (goal_id) on delete cascade,
  tool_id text not null references public.tools (id) on delete cascade,
  position integer not null default 0,
  primary key (goal_id, tool_id)
);

create table if not exists public.recommendation_starters (
  goal_id text not null references public.recommendations (goal_id) on delete cascade,
  pack_id text not null references public.starter_packs (id) on delete cascade,
  position integer not null default 0,
  primary key (goal_id, pack_id)
);

create index if not exists paths_goal_id_idx on public.paths (goal_id);
create index if not exists recommendation_tools_tool_id_idx on public.recommendation_tools (tool_id);
create index if not exists recommendation_starters_pack_id_idx on public.recommendation_starters (pack_id);

alter table public.goals enable row level security;
alter table public.tools enable row level security;
alter table public.starter_packs enable row level security;
alter table public.paths enable row level security;
alter table public.recommendations enable row level security;
alter table public.recommendation_tools enable row level security;
alter table public.recommendation_starters enable row level security;

create policy "Public read goals" on public.goals
  for select to anon, authenticated using (true);
create policy "Public read tools" on public.tools
  for select to anon, authenticated using (true);
create policy "Public read starter packs" on public.starter_packs
  for select to anon, authenticated using (true);
create policy "Public read paths" on public.paths
  for select to anon, authenticated using (true);
create policy "Public read recommendations" on public.recommendations
  for select to anon, authenticated using (true);
create policy "Public read recommendation tools" on public.recommendation_tools
  for select to anon, authenticated using (true);
create policy "Public read recommendation starters" on public.recommendation_starters
  for select to anon, authenticated using (true);
