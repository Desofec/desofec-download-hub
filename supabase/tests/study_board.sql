-- Run only against an isolated test database after migrations 0001, 0008 and 0009.
-- All fixtures are rolled back. Never run this as a production smoke test.
begin;

insert into auth.users (id) values
  ('10000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000003'),
  ('10000000-0000-0000-0000-000000000004'),
  ('10000000-0000-0000-0000-000000000005');
insert into public.goals (id, name, description, badge) values ('study-test', 'Test', 'Test', 'Test');
insert into public.learning_workspaces (id, name, created_by) values
  ('20000000-0000-0000-0000-000000000001', 'Test group', '10000000-0000-0000-0000-000000000001');

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000001', true);
select public.create_study_post('20000000-0000-0000-0000-000000000001', 'study-test', 'Owner', 'Let us learn');

do $$
begin
  if (select count(*) from public.list_study_posts('study-test') where mine) <> 1 then
    raise exception 'Owner cannot see their study card';
  end if;
  begin
    perform public.create_study_post('20000000-0000-0000-0000-000000000001', 'study-test', 'Owner', 'Duplicate');
    raise exception 'Duplicate goal accepted';
  exception when raise_exception then
    if sqlerrm <> 'You already have a study post for this goal' then raise; end if;
  end;
end $$;

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000002', true);
do $$
declare post_id uuid;
begin
  select id into strict post_id from public.list_study_posts('study-test');
  perform public.request_to_join_study_post(post_id, 'Learner', 'Happy to join');
  if (select my_request_status from public.list_study_posts('study-test')) <> 'pending' then
    raise exception 'Request was not recorded';
  end if;
  perform public.delete_study_post(post_id);
  if (select count(*) from public.list_study_posts('study-test')) <> 1 then
    raise exception 'Non-owner deleted a card';
  end if;
end $$;

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000001', true);
do $$
declare request_id uuid;
begin
  select id into strict request_id from public.list_study_requests();
  perform public.respond_to_study_request(request_id, true);
end $$;

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000002', true);
do $$
begin
  if not public.is_workspace_member('20000000-0000-0000-0000-000000000001') then
    raise exception 'Approval did not create membership';
  end if;
  if (select joined_workspace_id from public.list_study_posts('study-test')) is distinct from
      '20000000-0000-0000-0000-000000000001'::uuid then
    raise exception 'Approved requester cannot open the workspace';
  end if;
end $$;

-- A declined request must not grant membership.
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000003', true);
select public.request_to_join_study_post(id, 'Another learner', '') from public.list_study_posts('study-test');
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000001', true);
select public.respond_to_study_request(id, false) from public.list_study_requests();
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000003', true);
do $$
begin
  if public.is_workspace_member('20000000-0000-0000-0000-000000000001') then
    raise exception 'Declined requester gained membership';
  end if;
end $$;

-- Three distinct reports hide a card from other learners but not its owner.
select public.report_study_post(id, 'Spam') from public.list_study_posts('study-test');
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000004', true);
select public.report_study_post(id, 'Spam') from public.list_study_posts('study-test');
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000005', true);
select public.report_study_post(id, 'Spam') from public.list_study_posts('study-test');
do $$
begin
  if exists (select 1 from public.list_study_posts('study-test')) then
    raise exception 'Reported card remains visible to another learner';
  end if;
end $$;

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000001', true);
select public.delete_study_post(id) from public.list_study_posts('study-test');
do $$
begin
  if exists (select 1 from public.list_study_posts('study-test')) then
    raise exception 'Owner could not remove card';
  end if;
end $$;
rollback;
