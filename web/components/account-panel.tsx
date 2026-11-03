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

  async function signInWithGoogle() {
    setPending(true);
    setMessage('');
    const client = getSupabaseBrowserClient();
    if (!client) {
      setMessage(tr('Sign-in is not configured yet. Please try again later.'));
      setPending(false);
      return;
    }

    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/account` }
      });
      if (error) {
        setMessage(tr('Could not start Google sign-in. Please try again.'));
        setPending(false);
      }
    } catch {
      setMessage(tr('Could not start Google sign-in. Please try again.'));
      setPending(false);
    }
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
      <p>{tr('Sign in with Google or a secure email link to sync learning-path and starter-pack progress across your devices. No password needed.')}</p>
      <button className="btn btn-secondary google-button" type="button" onClick={signInWithGoogle} disabled={pending}>
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
          <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
        </svg>
        {tr('Continue with Google')}
      </button>
      <p className="account-note">{tr('or use an email link')}</p>
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
