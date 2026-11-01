alter table public.subscribers
  add column if not exists confirmed_at timestamptz,
  add column if not exists confirmation_token_hash text,
  add column if not exists confirmation_expires_at timestamptz,
  add column if not exists confirmation_sent_at timestamptz,
  add column if not exists unsubscribe_token_hash text,
  add column if not exists unsubscribed_at timestamptz;

create unique index if not exists subscribers_confirmation_token_hash_key
  on public.subscribers (confirmation_token_hash)
  where confirmation_token_hash is not null;

create unique index if not exists subscribers_unsubscribe_token_hash_key
  on public.subscribers (unsubscribe_token_hash)
  where unsubscribe_token_hash is not null;

drop policy if exists "Public can subscribe" on public.subscribers;
revoke all on public.subscribers from anon, authenticated;
