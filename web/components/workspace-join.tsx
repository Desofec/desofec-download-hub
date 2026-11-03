'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { useTr } from '@/components/tr';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { hashInviteToken } from '@/lib/workspaces';

export function WorkspaceJoin() {
  const tr = useTr();
  const router = useRouter();
  const { session, ready } = useAuth();
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);

  async function accept() {
    const token = new URLSearchParams(window.location.hash.slice(1)).get('token') ?? '';
    const client = getSupabaseBrowserClient();
    if (!client || !/^[a-f0-9]{64}$/.test(token)) {
      setMessage(tr('This invitation link is not valid.'));
      return;
    }
    setPending(true);
    setMessage('');
    const { data, error } = await client.rpc('accept_workspace_invitation', {
      _token_hash: await hashInviteToken(token)
    });
    if (error || !data) {
      setMessage(tr('This invitation is invalid, expired, already used, or for a different email address.'));
      setPending(false);
      return;
    }
    window.history.replaceState(null, '', window.location.pathname);
    router.push(`/workspaces/view?id=${data}`);
  }

  if (!ready) return <p role="status">{tr('Checking your sign-in…')}</p>;

  if (!session?.user) {
    return (
      <div className="account-panel">
        <p>{tr('Sign in with the email address that received the invitation, then open the invitation link again.')}</p>
        <Link className="btn btn-primary" href="/account">{tr('Sign in')}</Link>
      </div>
    );
  }

  return (
    <div className="account-panel">
      <p>{tr('Signed in as')} <strong>{session.user.email}</strong>.</p>
      <button className="btn btn-primary" type="button" onClick={accept} disabled={pending}>
        {pending ? tr('Joining…') : tr('Join workspace')}
      </button>
      {message && <p role="status">{message}</p>}
    </div>
  );
}
