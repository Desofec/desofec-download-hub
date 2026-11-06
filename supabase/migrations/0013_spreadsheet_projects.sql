-- Extend the existing private snapshot RPC without changing quotas or ownership.
begin;
do $$
declare
  _definition text := pg_get_functiondef('public.save_pilot_project(uuid,jsonb,integer)'::regprocedure);
  _old text := '''ai-education-services'', ''ai-video-business'')';
  _new text := '''ai-education-services'', ''ai-video-business'', ''ai-spreadsheets'')';
begin
  if position(_new in _definition) > 0 then return; end if;
  if position(_old in _definition) = 0 then
    raise exception 'Unexpected save_pilot_project definition; apply migration 0012 first and review the allowlist';
  end if;
  execute replace(_definition, _old, _new);
end $$;
revoke all on function public.save_pilot_project(uuid, jsonb, integer) from public, anon;
grant execute on function public.save_pilot_project(uuid, jsonb, integer) to authenticated;
commit;
