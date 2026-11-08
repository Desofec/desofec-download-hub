'use server';

import { createHash, randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

export type NewsletterActionState = { status: 'idle' | 'success' | 'error'; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_PATTERN = /^[a-f0-9]{64}$/;
const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.desofec.com').replace(/\/+$/, '');
}

async function sendNewsletterEmail(email: string, confirmationToken: string, unsubscribeToken: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const replyTo = (process.env.NEWSLETTER_REPLY_TO_EMAIL ?? 'support@desofec.com').trim();
  if (replyTo.length < 5 || replyTo.length > 254 || !EMAIL_PATTERN.test(replyTo)) {
    console.error('Newsletter reply-to address is invalid.');
    return false;
  }

  const confirmationUrl = new URL('/newsletter/confirm', getSiteUrl());
  confirmationUrl.searchParams.set('token', confirmationToken);
  const unsubscribeUrl = new URL('/newsletter/unsubscribe', getSiteUrl());
  unsubscribeUrl.searchParams.set('token', unsubscribeToken);
  const from = process.env.NEWSLETTER_FROM_EMAIL || 'Desofec AI Studio <noreply@desofec.com>';
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [email],
      reply_to: replyTo,
      subject: 'Confirm your Desofec AI Studio newsletter subscription',
      html: `<p>Thanks for signing up for Desofec AI Studio updates.</p><p><a href="${confirmationUrl}">Confirm my subscription</a></p><p>If you did not request this, you can <a href="${unsubscribeUrl}">cancel this request</a>.</p>`,
      text: `Thanks for signing up for Desofec AI Studio updates.\n\nConfirm your subscription: ${confirmationUrl}\n\nIf you did not request this, cancel this request: ${unsubscribeUrl}`
    })
  });

  if (!response.ok) console.error('Newsletter confirmation email failed:', response.status);
  return response.ok;
}

export async function subscribe(
  _previous: NewsletterActionState,
  formData: FormData
): Promise<NewsletterActionState> {
  // Hidden field that real visitors never fill in; bots do.
  if (formData.get('company')) {
    return { status: 'success', message: 'If you signed up, check your inbox for a confirmation link.' };
  }

  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();

  if (email.length < 5 || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' };
  }

  const client = getAdminClient();
  if (!client || !process.env.RESEND_API_KEY) {
    return { status: 'error', message: 'Something went wrong. Please try again.' };
  }

  const { data: existing, error: lookupError } = await client
    .from('subscribers')
    .select('id, confirmed_at, unsubscribed_at, confirmation_sent_at')
    .eq('email', email)
    .maybeSingle();
  if (lookupError) {
    console.error('Newsletter subscriber lookup failed:', lookupError.message);
    return { status: 'error', message: 'Something went wrong. Please try again.' };
  }

  if (existing?.confirmed_at && !existing.unsubscribed_at) {
    return { status: 'success', message: 'If this address can be subscribed, check your inbox for instructions.' };
  }

  if (
    existing?.confirmation_sent_at &&
    Date.now() - Date.parse(existing.confirmation_sent_at) < 15 * 60 * 1000
  ) {
    return { status: 'success', message: 'Check your inbox for a link to confirm your subscription.' };
  }

  const confirmationToken = randomBytes(32).toString('hex');
  const unsubscribeToken = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + TOKEN_LIFETIME_MS).toISOString();
  const subscriber = {
    email,
    source: 'home',
    confirmed_at: null,
    confirmation_token_hash: hashToken(confirmationToken),
    confirmation_expires_at: expiresAt,
    unsubscribe_token_hash: hashToken(unsubscribeToken),
    unsubscribed_at: null
  };
  const { error: saveError } = existing
    ? await client.from('subscribers').update(subscriber).eq('id', existing.id)
    : await client.from('subscribers').insert(subscriber);

  if (saveError) {
    console.error('Newsletter subscriber save failed:', saveError.message);
    return { status: 'error', message: 'Something went wrong. Please try again.' };
  }

  try {
    if (!(await sendNewsletterEmail(email, confirmationToken, unsubscribeToken))) {
      return { status: 'error', message: 'We could not send the confirmation email. Please try again later.' };
    }
  } catch (error) {
    console.error('Newsletter confirmation email request failed:', error);
    return { status: 'error', message: 'We could not send the confirmation email. Please try again later.' };
  }

  const { error: timestampError } = await client
    .from('subscribers')
    .update({ confirmation_sent_at: new Date().toISOString() })
    .eq('email', email);
  if (timestampError) {
    console.error('Newsletter send timestamp update failed:', timestampError.message);
  }

  return { status: 'success', message: 'Check your inbox for a link to confirm your subscription.' };
}

export async function confirmNewsletter(
  _previous: NewsletterActionState,
  formData: FormData
): Promise<NewsletterActionState> {
  const token = String(formData.get('token') ?? '');
  const client = getAdminClient();
  if (!client) return { status: 'error', message: 'Confirmation is unavailable right now. Please try again later.' };
  if (!TOKEN_PATTERN.test(token)) return { status: 'error', message: 'This confirmation link is invalid or expired.' };

  const tokenHash = hashToken(token);
  const { data, error } = await client
    .from('subscribers')
    .select('id')
    .eq('confirmation_token_hash', tokenHash)
    .gt('confirmation_expires_at', new Date().toISOString())
    .maybeSingle();
  if (error || !data) {
    if (error) console.error('Newsletter confirmation lookup failed:', error.message);
    return { status: 'error', message: 'This confirmation link is invalid or expired.' };
  }

  const { data: updated, error: updateError } = await client
    .from('subscribers')
    .update({
      confirmed_at: new Date().toISOString(),
      confirmation_token_hash: null,
      confirmation_expires_at: null
    })
    .eq('id', data.id)
    .eq('confirmation_token_hash', tokenHash)
    .select('id')
    .maybeSingle();
  if (updateError || !updated) {
    if (updateError) console.error('Newsletter confirmation update failed:', updateError.message);
    return { status: 'error', message: 'This confirmation link is invalid or expired.' };
  }

  return { status: 'success', message: 'Your subscription is confirmed. Welcome!' };
}

export async function unsubscribeNewsletter(
  _previous: NewsletterActionState,
  formData: FormData
): Promise<NewsletterActionState> {
  const token = String(formData.get('token') ?? '');
  const client = getAdminClient();
  if (!client) return { status: 'error', message: 'Unsubscribe is unavailable right now. Please try again later.' };
  if (!TOKEN_PATTERN.test(token)) return { status: 'error', message: 'This unsubscribe link is invalid.' };

  const { data, error } = await client
    .from('subscribers')
    .update({
      unsubscribed_at: new Date().toISOString(),
      confirmation_token_hash: null,
      confirmation_expires_at: null,
      unsubscribe_token_hash: null
    })
    .eq('unsubscribe_token_hash', hashToken(token))
    .select('id')
    .maybeSingle();
  if (error) {
    console.error('Newsletter unsubscribe failed:', error.message);
    return { status: 'error', message: 'We could not process your request. Please try again later.' };
  }

  return {
    status: 'success',
    message: data ? 'You have been unsubscribed.' : 'This link is invalid or has already been used.'
  };
}
