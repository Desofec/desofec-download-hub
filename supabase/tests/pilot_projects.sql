-- Isolated database only, after migrations 0011 and 0012.
-- Fixtures and helper functions are rolled back; never run against live data.
begin;
insert into auth.users (id) values
  ('33333333-3333-4333-8333-333333333333'),
  ('44444444-4444-4444-8444-444444444444');

create function public._test_pilot_document(_id uuid) returns jsonb language sql immutable as $$
  select jsonb_build_object('version', 1, 'id', _id, 'pathId', 'ai-content-services',
    'title', 'Fictional practice', 'brief', jsonb_build_object('objective', '', 'scope', '', 'review', ''),
    'completed', '[]'::jsonb, 'proposal', null, 'results', null)
$$;
create function public._test_pilot_error(_statement text, _message text) returns void language plpgsql as $$
begin
  begin
    execute _statement;
  exception when others then
    if position(_message in sqlerrm) = 0 then raise; end if;
    return;
  end;
  raise exception 'Expected failure: %', _statement;
end $$;
grant execute on function public._test_pilot_document(uuid), public._test_pilot_error(text, text) to authenticated, anon;

set local role authenticated;
select set_config('request.jwt.claim.sub', '', true);
select public._test_pilot_error(
  $q$select public.save_pilot_project('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', public._test_pilot_document('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'), 0)$q$,
  'Sign in');

select set_config('request.jwt.claim.sub', '33333333-3333-4333-8333-333333333333', true);
do $$
declare _id uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
begin
  assert public.save_pilot_project(_id, public._test_pilot_document(_id), 0) = 1;
  assert public.save_pilot_project(_id, public._test_pilot_document(_id), 1) = 2;
  assert (select count(*) from public.pilot_projects) = 1;
end $$;
select public._test_pilot_error(
  $q$select public.save_pilot_project('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', public._test_pilot_document('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'), 1)$q$,
  'Account project changed');
select public._test_pilot_error(
  $q$select public.delete_pilot_project('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 1)$q$,
  'Account project changed');
select public._test_pilot_error('delete from public.pilot_projects', 'permission denied');
select public._test_pilot_error('update public.pilot_projects set version = 99', 'permission denied');
select public._test_pilot_error('insert into public.pilot_projects select * from public.pilot_projects', 'permission denied');

do $$
declare _bad jsonb;
begin
  for _bad in select value from jsonb_array_elements(
    '[{}, {"id":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb"}, {"title":""}, {"pathId":"other"},
      {"brief":{}}, {"completed":["approved"]}, {"completed":["review","review"]},
      {"proposal":[]}, {"results":[]}]'::jsonb
  ) loop
    -- An empty object is tested as a whole document; other objects override fields.
    perform public._test_pilot_error(format(
      'select public.save_pilot_project(%L, %L::jsonb, 2)',
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      case when _bad = '{}'::jsonb then _bad else
        public._test_pilot_document('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa') || _bad end),
      'Invalid project data');
  end loop;
  perform public._test_pilot_error(format(
    'select public.save_pilot_project(%L, %L::jsonb, 2)',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    public._test_pilot_document('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa') || jsonb_build_object('extra', repeat('x', 1100001))),
    'Invalid project data');
end $$;

select set_config('request.jwt.claim.sub', '44444444-4444-4444-8444-444444444444', true);
do $$ begin assert (select count(*) from public.pilot_projects) = 0; end $$;
select public._test_pilot_error(
  $q$select public.delete_pilot_project('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 2)$q$,
  'Account project changed');
do $$ begin
  assert public.save_pilot_project('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    public._test_pilot_document('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'), 0) = 1;
end $$;

-- Existing owner-private JSON snapshots preserve workbook revisions without a schema migration.
do $$
declare
  _id uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  _workbook jsonb := '{
    "version":1,"items":[{"id":"item-1","revisions":[
      {"number":1,"title":"Fictional draft v1","body":"Original practice text","savedAt":"2026-11-06T01:30:00.000Z"},
      {"number":2,"title":"Fictional draft v2","body":"Revised practice text","savedAt":"2026-11-06T01:31:00.000Z"}
    ],"links":[{"testId":"test-1","revision":1,"name":"Fictional check","input":"Original draft","expected":"Unknown claims flagged"}]}]
  }'::jsonb;
begin
  assert public.save_pilot_project(_id,
    public._test_pilot_document(_id) || jsonb_build_object('workbook', _workbook), 1) = 2;
  assert (select document->'workbook' from public.pilot_projects where id = _id) = _workbook;
  assert (select document->'workbook'->'items'->0->'revisions'->0->>'body'
    from public.pilot_projects where id = _id) = 'Original practice text';
  assert (select document->'workbook'->'items'->0->'links'->0->>'revision'
    from public.pilot_projects where id = _id) = '1';
  assert public.save_pilot_project(_id,
    public._test_pilot_document(_id) || jsonb_build_object('workbook', _workbook,
      'reviewCentre', jsonb_build_object('version', 1, 'reviews', jsonb_build_array(jsonb_build_object(
        'itemId', 'item-1', 'source', _workbook->'items'->0->'revisions'->0,
        'savedAt', '2026-11-06T01:45:00.000Z', 'checks', jsonb_build_array(
          jsonb_build_object('id', 'facts', 'status', 'needs-work', 'notes', 'Unknown price',
            'task', 'Remove price', 'resolution', '', 'done', false),
          jsonb_build_object('id', 'copy', 'status', 'pending', 'notes', '', 'task', '', 'resolution', '', 'done', false),
          jsonb_build_object('id', 'access', 'status', 'pending', 'notes', '', 'task', '', 'resolution', '', 'done', false),
          jsonb_build_object('id', 'revision', 'status', 'pending', 'notes', '', 'task', '', 'resolution', '', 'done', false),
          jsonb_build_object('id', 'approval', 'status', 'blocked', 'notes', 'Owner review unavailable',
            'task', '', 'resolution', '', 'done', false)
        )
      )))), 2) = 3;
  assert (select document->'reviewCentre'->'reviews'->0->'source'->>'body'
    from public.pilot_projects where id = _id) = 'Original practice text';
end $$;

-- The video track retains text-only reviews under the same owner/version rules.
do $$
declare
  _id uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  _document jsonb;
begin
  select document into _document from public.pilot_projects where id = _id;
  _document := _document || '{"pathId":"ai-video-business"}'::jsonb;
  _document := jsonb_set(_document, '{reviewCentre,reviews,0,checks}', (
    select jsonb_agg(jsonb_build_object(
      'id', id, 'status', 'pending', 'notes', '', 'task', '', 'resolution', '', 'done', false
    ) order by position)
    from unnest(array['facts', 'exports', 'captions', 'rights', 'revision', 'costs', 'approval'])
      with ordinality as checks(id, position)
  ));
  assert public.save_pilot_project(_id, _document, 3) = 4;
  assert (select document->>'pathId' from public.pilot_projects where id = _id) = 'ai-video-business';
  assert (select document->'reviewCentre'->'reviews'->0->'source'->>'body'
    from public.pilot_projects where id = _id) = 'Original practice text';
  perform public._test_pilot_error(format(
    'select public.save_pilot_project(%L, %L::jsonb, 3)', _id, _document),
    'Account project changed');
end $$;

select set_config('request.jwt.claim.sub', '33333333-3333-4333-8333-333333333333', true);
do $$
declare _id uuid;
begin
  assert (select version from public.pilot_projects) = 2;
  for index in 2..10 loop
    _id := ('aaaaaaaa-aaaa-4aaa-8aaa-' || lpad(index::text, 12, '0'))::uuid;
    perform public.save_pilot_project(_id, public._test_pilot_document(_id), 0);
  end loop;
  assert (select count(*) from public.pilot_projects) = 10;
end $$;
select public._test_pilot_error(
  $q$select public.save_pilot_project('aaaaaaaa-aaaa-4aaa-8aaa-000000000011', public._test_pilot_document('aaaaaaaa-aaaa-4aaa-8aaa-000000000011'), 0)$q$,
  'limit reached');
select public.delete_pilot_project('aaaaaaaa-aaaa-4aaa-8aaa-000000000010', 1);
do $$ begin
  assert public.save_pilot_project('aaaaaaaa-aaaa-4aaa-8aaa-000000000011',
    public._test_pilot_document('aaaaaaaa-aaaa-4aaa-8aaa-000000000011'), 0) = 1;
end $$;

set local role anon;
select public._test_pilot_error('select * from public.pilot_projects', 'permission denied');
select public._test_pilot_error(
  $q$select public.save_pilot_project('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', public._test_pilot_document('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'), 0)$q$,
  'permission denied');
select public._test_pilot_error(
  $q$select public.delete_pilot_project('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 1)$q$,
  'permission denied');
reset role;

delete from auth.users where id = '33333333-3333-4333-8333-333333333333';
do $$ begin
  assert not exists (select 1 from public.pilot_projects where user_id = '33333333-3333-4333-8333-333333333333');
  assert (select count(*) from public.pilot_projects where user_id = '44444444-4444-4444-8444-444444444444') = 1;
end $$;
rollback;
