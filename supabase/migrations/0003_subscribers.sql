create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(email) between 5 and 254),
  source text not null default 'website',
  created_at timestamptz not null default now()
);

create unique index if not exists subscribers_email_key on public.subscribers (lower(email));

alter table public.subscribers enable row level security;

-- Visitors can only add their own signup. Nobody can read the list with the public key.
drop policy if exists "Public can subscribe" on public.subscribers;
create policy "Public can subscribe" on public.subscribers
  for insert to anon, authenticated
  with check (char_length(email) between 5 and 254);

revoke all on public.subscribers from anon, authenticated;
grant insert on public.subscribers to anon, authenticated;
