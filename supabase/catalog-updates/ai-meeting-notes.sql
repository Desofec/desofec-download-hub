-- Review this targeted update and obtain authorization before applying it to an
-- existing database. It inserts only the new path, kit and recommendation link.
-- Existing matching rows keep their positions; conflicting rows abort the transaction.
begin;

lock table public.starter_packs, public.paths, public.recommendation_starters
  in share row exclusive mode;

do $catalog_update$
declare
  _pack public.starter_packs%rowtype;
  _path public.paths%rowtype;
begin
  _pack.id := 'ai-meeting-notes-kit';
  _pack.title := 'AI Meeting Notes and Follow-Up Kit';
  _pack.description := 'A privacy plan, fictional source notes, action register and private follow-up with source checks.';
  _pack.level := 'Beginner';
  _pack.file_path := 'downloads/ai-meeting-notes-kit.md';

  _path.id := 'ai-meeting-notes';
  _path.title := 'AI Meeting Notes and Follow-Up';
  _path.level := 'Beginner';
  _path.description := 'Turn fictional meeting notes into checked summaries, action items and a private follow-up while respecting consent and privacy.';
  _path.badge := 'AI';
  _path.goal_id := 'ai-productivity';
  _path.steps := array[
    'Plan notice, permissions and privacy',
    'Create a source-linked meeting summary',
    'Track actions and unresolved decisions',
    'Verify and prepare a private follow-up'
  ]::text[];

  if not exists (select 1 from public.goals where id = _path.goal_id) then
    raise exception 'Missing ai-productivity goal; review the catalog before applying this update';
  end if;
  if not exists (select 1 from public.recommendations where goal_id = _path.goal_id) then
    raise exception 'Missing ai-productivity recommendation; review the catalog before applying this update';
  end if;

  insert into public.starter_packs (id, title, description, level, file_path, position)
  values (_pack.id, _pack.title, _pack.description, _pack.level, _pack.file_path,
    (select coalesce(max(position), -1) + 1 from public.starter_packs))
  on conflict (id) do nothing;

  if not exists (
    select 1 from public.starter_packs as pack
    where pack.id = _pack.id
      and row(pack.title, pack.description, pack.level, pack.file_path)
        is not distinct from row(_pack.title, _pack.description, _pack.level, _pack.file_path)
  ) then
    raise exception 'Existing meeting notes kit differs; review it before applying this update';
  end if;

  insert into public.paths (id, title, level, description, badge, goal_id, steps, position)
  values (_path.id, _path.title, _path.level, _path.description, _path.badge, _path.goal_id, _path.steps,
    (select coalesce(max(position), -1) + 1 from public.paths))
  on conflict (id) do nothing;

  if not exists (
    select 1 from public.paths as path
    where path.id = _path.id
      and row(path.title, path.level, path.description, path.badge, path.goal_id, path.steps)
        is not distinct from row(_path.title, _path.level, _path.description, _path.badge, _path.goal_id, _path.steps)
  ) then
    raise exception 'Existing meeting notes path differs; review it before applying this update';
  end if;

  insert into public.recommendation_starters (goal_id, pack_id, position)
  values (_path.goal_id, _pack.id,
    (select coalesce(max(position), -1) + 1
      from public.recommendation_starters where goal_id = _path.goal_id))
  on conflict (goal_id, pack_id) do nothing;
end
$catalog_update$;

commit;
