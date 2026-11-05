-- Private, changeable helpful/not-helpful votes; no free-text or public voter lists.
begin;

create table if not exists public.lesson_feedback (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null check (lesson_id ~ '^[a-z0-9][a-z0-9-]{0,99}$'),
  helpful boolean not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.lesson_feedback enable row level security;
revoke all on public.lesson_feedback from public, anon, authenticated;
grant select, delete on public.lesson_feedback to authenticated;

drop policy if exists "Learners can read their own feedback" on public.lesson_feedback;
create policy "Learners can read their own feedback" on public.lesson_feedback
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Learners can remove their own feedback" on public.lesson_feedback;
create policy "Learners can remove their own feedback" on public.lesson_feedback
  for delete to authenticated using ((select auth.uid()) = user_id);

create or replace function public.save_lesson_feedback(_lesson_id text, _helpful boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in to leave lesson feedback';
  end if;
  if _helpful is null then
    raise exception 'Choose helpful or not helpful';
  end if;
  if _lesson_id is null or not (
    exists (select 1 from public.paths where id = _lesson_id)
    or _lesson_id = 'first-website-challenge'
  ) then
    raise exception 'Choose an existing lesson';
  end if;

  insert into public.lesson_feedback (user_id, lesson_id, helpful)
  values (auth.uid(), _lesson_id, _helpful)
  on conflict (user_id, lesson_id)
  do update set helpful = excluded.helpful, updated_at = now();
end;
$$;

revoke all on function public.save_lesson_feedback(text, boolean) from public, anon;
grant execute on function public.save_lesson_feedback(text, boolean) to authenticated;

commit;
