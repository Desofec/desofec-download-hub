-- Allow tutorial progress in the existing per-user progress table.
-- item_id is the learning path id and completed_steps are tutorial step positions.
alter table public.user_progress drop constraint if exists user_progress_item_type_check;

alter table public.user_progress
  add constraint user_progress_item_type_check
  check (item_type in ('path', 'pack', 'tutorial'));
