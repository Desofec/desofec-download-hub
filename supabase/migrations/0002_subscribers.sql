create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint subscribers_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254)
);

create unique index if not exists subscribers_email_lower_key on public.subscribers (lower(email));

alter table public.subscribers enable row level security;

-- Visitors can sign up but can never read the list back.
drop policy if exists "Public insert subscribers" on public.subscribers;
create policy "Public insert subscribers" on public.subscribers
  for insert to anon, authenticated with check (true);
