'use server';

import { createClient } from '@supabase/supabase-js';

export type SubscribeState = { status: 'idle' | 'success' | 'error'; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(_previous: SubscribeState, formData: FormData): Promise<SubscribeState> {
  // Hidden field that real visitors never fill in; bots do.
  if (formData.get('company')) {
    return { status: 'success', message: "You're on the list. Thank you!" };
  }

  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();

  if (email.length < 5 || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return { status: 'error', message: 'Signups are not available right now. Please try again later.' };
  }

  const { error } = await createClient(url, key, { auth: { persistSession: false } })
    .from('subscribers')
    .insert({ email, source: 'home' });

  // 23505 = already subscribed; treat as success so emails can't be probed.
  if (error && error.code !== '23505') {
    return { status: 'error', message: 'Something went wrong. Please try again.' };
  }

  return { status: 'success', message: "You're on the list. Thank you!" };
}
