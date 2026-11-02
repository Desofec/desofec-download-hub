'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { useTr } from '@/components/tr';

export function AccountPanel() {
  const tr = useTr();
  const { session, ready } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('error_description=')) {
      window.history.replaceState(null, '', window.location.pathname);
      const timer = window.setTimeout(
        () => setMessage(tr('That sign-in link could not be used. Request a new link and try again.')),
        0
      );
      return () => window.clearTimeout(timer);
    }
  }, [tr]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(tr(''));
    const client = getSupabaseBrowserClient();
    if (!client) {
      setMessage(tr('Sign-in is not configured yet. Please try again later.'));
      setPending(false);
      return;
    }

    try {
      const { error } = await client.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/account` }
      });
      setMessage(error ? tr('Could not send the sign-in link. Please try again.') : tr('Check your email for your secure sign-in link.'));
    } catch {
      setMessage(tr('Could not send the sign-in link. Please try again.'));
    }
    setPending(false);
  }

  async function signOut() {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    try {
      const { error } = await client.auth.signOut();
      setMessage(error ? tr('Could not sign out. Please try again.') : tr('You are signed out. Progress remains on this device.'));
    } catch {
      setMessage(tr('Could not sign out. Please try again.'));
    }
  }

  if (!ready) return <p role="status">{tr('Checking your sign-in…')}</p>;

  if (session?.user) {
    return (
      <div className="account-panel">
        <p>
          {tr('Signed in as')} <strong>{session.user.email}</strong>.{' '}
          {tr('Your path and checklist progress syncs to your account.')}
        </p>
        <p>{tr('Progress already saved on this device stays available after you sign out.')}</p>
        <button className="btn btn-secondary" type="button" onClick={signOut}>
          {tr('Sign out')}
        </button>
        {message && <p role="status">{message}</p>}
      </div>
    );
  }

  return (
    <div className="account-panel">
      <p>{tr('Sign in with a secure email link to sync learning-path and starter-pack progress across your devices. No password needed.')}</p>
      <form className="account-form" onSubmit={signIn}>
        <label htmlFor="account-email">{tr('Email address')}</label>
        <input
          id="account-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? tr('Sending…') : tr('Email me a sign-in link')}
        </button>
      </form>
      {message && <p role="status">{message}</p>}
      <p className="account-note">{tr('Signing in is optional; progress still saves on this device without an account.')}</p>
      <Link href="/paths">{tr('Browse learning paths')}</Link>
    </div>
  );
}
