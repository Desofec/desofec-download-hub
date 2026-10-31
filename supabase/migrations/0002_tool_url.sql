-- Adds the official website link for each tool. Safe to re-run.
alter table public.tools add column if not exists url text not null default '';
