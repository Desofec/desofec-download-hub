-- Isolated database only, after 0011_pilot_projects.sql.
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
