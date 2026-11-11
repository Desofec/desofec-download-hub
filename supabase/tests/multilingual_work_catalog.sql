-- Run only against a disposable, empty database named multilingual_catalog_update_test,
-- after migrations 0001, 0004 and 0007. This test commits fixtures.
\set ON_ERROR_STOP on

do $test$
begin
  if current_database() <> 'multilingual_catalog_update_test' then
    raise exception 'This test requires the disposable multilingual_catalog_update_test database';
  end if;
  if exists (select 1 from public.goals)
    or exists (select 1 from public.starter_packs)
    or exists (select 1 from public.paths)
    or exists (select 1 from public.user_progress) then
    raise exception 'This test requires an empty catalog and progress table';
  end if;
end
$test$;

insert into public.goals (id, name, description, badge, position) values
  ('ai-productivity', 'Existing productivity', 'Preserve this edited description', 'AI', 12),
  ('other-goal', 'Other goal', 'Preserve this goal', 'Other', 50);
insert into public.tools (id, name, category, skill, description, badge, position) values
  ('existing-tool', 'Existing tool', 'Other', 'Beginner', 'Preserve this tool', 'Other', 9);
insert into public.recommendations (goal_id, title, summary, steps) values
  ('ai-productivity', 'Existing recommendation', 'Preserve this summary', array['Existing step']),
  ('other-goal', 'Other recommendation', 'Preserve this too', array['Other step']);
insert into public.starter_packs (id, title, description, level, file_path, position) values
  ('existing-productivity-kit', 'Existing kit', 'Keep this kit', 'Beginner', 'downloads/existing.md', 10),
  ('other-kit', 'Other kit', 'Keep this kit too', 'Beginner', 'downloads/other.md', 40);
insert into public.paths (id, title, level, description, badge, goal_id, steps, position) values
  ('existing-path', 'Existing path', 'Beginner', 'Keep this path', 'AI', 'ai-productivity', array['Existing step'], 20);
insert into public.recommendation_tools (goal_id, tool_id, position) values
  ('ai-productivity', 'existing-tool', 4);
insert into public.recommendation_starters (goal_id, pack_id, position) values
  ('ai-productivity', 'existing-productivity-kit', 7),
  ('other-goal', 'other-kit', 15);
insert into auth.users (id) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
insert into public.user_progress (user_id, item_type, item_id, completed_steps, updated_at) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'path', 'existing-path', array[0, 2], '2026-01-01 00:00:00+00'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'tutorial', 'ai-multilingual-work', array[1, 3], '2026-01-01 00:00:00+00');

create temp table multilingual_catalog_before as
  select 'goals' as name, coalesce(jsonb_agg(to_jsonb(g) order by g.id), '[]'::jsonb) as contents from public.goals g
  union all select 'tools', coalesce(jsonb_agg(to_jsonb(t) order by t.id), '[]'::jsonb) from public.tools t
  union all select 'starter_packs', coalesce(jsonb_agg(to_jsonb(p) order by p.id), '[]'::jsonb) from public.starter_packs p
  union all select 'paths', coalesce(jsonb_agg(to_jsonb(p) order by p.id), '[]'::jsonb) from public.paths p
  union all select 'recommendations', coalesce(jsonb_agg(to_jsonb(r) order by r.goal_id), '[]'::jsonb) from public.recommendations r
  union all select 'recommendation_tools', coalesce(jsonb_agg(to_jsonb(r) order by r.goal_id, r.tool_id), '[]'::jsonb) from public.recommendation_tools r
  union all select 'recommendation_starters', coalesce(jsonb_agg(to_jsonb(r) order by r.goal_id, r.pack_id), '[]'::jsonb) from public.recommendation_starters r
  union all select 'user_progress', coalesce(jsonb_agg(to_jsonb(p) order by p.user_id, p.item_type, p.item_id), '[]'::jsonb) from public.user_progress p;

\ir ../catalog-updates/ai-multilingual-work.sql
\ir ../catalog-updates/ai-multilingual-work.sql

create temp table multilingual_catalog_after as
  select 'goals' as name, coalesce(jsonb_agg(to_jsonb(g) order by g.id), '[]'::jsonb) as contents from public.goals g
  union all select 'tools', coalesce(jsonb_agg(to_jsonb(t) order by t.id), '[]'::jsonb) from public.tools t
  union all select 'starter_packs', coalesce(jsonb_agg(to_jsonb(p) order by p.id), '[]'::jsonb)
    from public.starter_packs p where p.id <> 'ai-multilingual-work-kit'
  union all select 'paths', coalesce(jsonb_agg(to_jsonb(p) order by p.id), '[]'::jsonb)
    from public.paths p where p.id <> 'ai-multilingual-work'
  union all select 'recommendations', coalesce(jsonb_agg(to_jsonb(r) order by r.goal_id), '[]'::jsonb) from public.recommendations r
  union all select 'recommendation_tools', coalesce(jsonb_agg(to_jsonb(r) order by r.goal_id, r.tool_id), '[]'::jsonb) from public.recommendation_tools r
  union all select 'recommendation_starters', coalesce(jsonb_agg(to_jsonb(r) order by r.goal_id, r.pack_id), '[]'::jsonb)
    from public.recommendation_starters r
    where (r.goal_id, r.pack_id) <> ('ai-productivity', 'ai-multilingual-work-kit')
  union all select 'user_progress', coalesce(jsonb_agg(to_jsonb(p) order by p.user_id, p.item_type, p.item_id), '[]'::jsonb) from public.user_progress p;

do $test$
begin
  if exists (select * from multilingual_catalog_before except select * from multilingual_catalog_after)
    or exists (select * from multilingual_catalog_after except select * from multilingual_catalog_before) then
    raise exception 'The catalog update changed existing records or learner progress';
  end if;
  if not exists (
    select 1 from public.starter_packs
    where id = 'ai-multilingual-work-kit'
      and file_path = 'downloads/ai-multilingual-work-kit.md' and position = 41
  ) then
    raise exception 'The new kit was not appended as expected';
  end if;
  if not exists (
    select 1 from public.paths
    where id = 'ai-multilingual-work' and goal_id = 'ai-productivity' and position = 21
      and steps = array[
        'Define the audience and source',
        'Check permission and protect private information',
        'Translate with a glossary and compare every segment',
        'Correct changed facts and record an honest review'
      ]::text[]
  ) then
    raise exception 'The new path was not appended as expected';
  end if;
  if not exists (
    select 1 from public.recommendation_starters
    where goal_id = 'ai-productivity' and pack_id = 'ai-multilingual-work-kit' and position = 8
  ) then
    raise exception 'The new recommendation link was not appended as expected';
  end if;
end
$test$;
