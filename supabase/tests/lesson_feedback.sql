-- Isolated database only, after 0001_init.sql and 0010_lesson_feedback.sql.
-- Fixtures and votes are rolled back; never use this as a live smoke test.
begin;
insert into auth.users (id) values
  ('11000000-0000-0000-0000-000000000001'),
  ('11000000-0000-0000-0000-000000000002');
insert into public.goals (id, name, description, badge) values ('feedback-test', 'Test', 'Test', 'Test');
insert into public.paths (id, title, level, description, badge, goal_id)
values ('feedback-test', 'Test', 'Beginner', 'Test', 'Test', 'feedback-test');

set local role authenticated;
select set_config('request.jwt.claim.sub', '11000000-0000-0000-0000-000000000001', true);
select public.save_lesson_feedback('feedback-test', true);
select public.save_lesson_feedback('feedback-test', false);
select public.save_lesson_feedback('first-website-challenge', true);
do $$
begin
  if (select count(*) from public.lesson_feedback where lesson_id = 'feedback-test') <> 1
      or (select helpful from public.lesson_feedback where lesson_id = 'feedback-test') is distinct from false then
    raise exception 'Changing a vote created a duplicate or lost the false value';
  end if;
  begin
    perform public.save_lesson_feedback('not-a-real-lesson', true);
    raise exception 'Unknown lesson accepted';
  exception when raise_exception then
    if sqlerrm <> 'Choose an existing lesson' then raise; end if;
  end;
  begin
    perform public.save_lesson_feedback(null, true);
    raise exception 'Null lesson accepted';
  exception when raise_exception then
    if sqlerrm <> 'Choose an existing lesson' then raise; end if;
  end;
  begin
    perform public.save_lesson_feedback('feedback-test', null);
    raise exception 'Null vote accepted';
  exception when raise_exception then
    if sqlerrm <> 'Choose helpful or not helpful' then raise; end if;
  end;
  begin
    insert into public.lesson_feedback (user_id, lesson_id, helpful)
    values ('11000000-0000-0000-0000-000000000002', 'feedback-test', true);
    raise exception 'Direct vote insertion accepted';
  exception when insufficient_privilege then null;
  end;
end $$;

select set_config('request.jwt.claim.sub', '11000000-0000-0000-0000-000000000002', true);
do $$
begin
  if exists (select 1 from public.lesson_feedback) then
    raise exception 'Another learner can read private votes';
  end if;
  delete from public.lesson_feedback;
end $$;
select public.save_lesson_feedback('feedback-test', true);

select set_config('request.jwt.claim.sub', '11000000-0000-0000-0000-000000000001', true);
do $$
begin
  if (select count(*) from public.lesson_feedback) <> 2 then
    raise exception 'Another learner removed private votes';
  end if;
  delete from public.lesson_feedback where lesson_id = 'feedback-test';
  if exists (select 1 from public.lesson_feedback where lesson_id = 'feedback-test') then
    raise exception 'Learner cannot remove own vote';
  end if;
end $$;

select set_config('request.jwt.claim.sub', '', true);
do $$
begin
  begin
    perform public.save_lesson_feedback('feedback-test', true);
    raise exception 'Missing session accepted';
  exception when raise_exception then
    if sqlerrm <> 'Sign in to leave lesson feedback' then raise; end if;
  end;
end $$;

set local role anon;
do $$
begin
  begin
    perform public.save_lesson_feedback('feedback-test', true);
    raise exception 'Anonymous voting accepted';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.lesson_feedback;
    raise exception 'Anonymous vote reading accepted';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

delete from auth.users where id = '11000000-0000-0000-0000-000000000002';
do $$
begin
  if exists (select 1 from public.lesson_feedback where user_id = '11000000-0000-0000-0000-000000000002') then
    raise exception 'Deleted account left feedback behind';
  end if;
end $$;
rollback;
