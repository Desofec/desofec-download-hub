'use server';

import { createClient } from '@supabase/supabase-js';

export type SubscribeState = { status: 'idle' | 'success' | 'error'; message: string };

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (formData.get('website')) return { status: 'success', message: 'Thanks! You are on the list.' };
  if (!EMAIL.test(email) || email.length > 254) {
    return { status: 'error', message: 'Please enter a valid email address.' };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { status: 'error', message: 'Sign-up is not available right now.' };

  const { error } = await createClient(url, key, { auth: { persistSession: false } })
    .from('subscribers')
    .insert({ email });

  // 23505 = already subscribed; treat as success so emails can't be probed.
  if (error && error.code !== '23505') {
    return { status: 'error', message: 'Something went wrong. Please try again later.' };
  }
  return { status: 'success', message: 'Thanks! You are on the list.' };
}
