'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { useTr } from '@/components/tr';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

type Workspace = { id: string; name: string; created_at: string };

export function WorkspacesPanel() {
  const tr = useTr();
  const { session, ready } = useAuth();
  const userId = session?.user.id;
  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const { data, error } = await client
      .from('learning_workspaces')
      .select('id, name, created_at')
      .order('created_at', { ascending: false });
    if (error) {
      setMessage(tr('Could not load your workspaces. Please try again.'));
      setWorkspaces([]);
      return;
    }
    setWorkspaces(data ?? []);
  }, [tr]);

  useEffect(() => {
    if (!userId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [userId, load]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client || !userId) return;
    setPending(true);
    setMessage('');
    const { error } = await client.from('learning_workspaces').insert({ name: name.trim(), created_by: userId });
    if (error) {
      setMessage(tr('Could not create the workspace. Use a name of 2 to 80 characters.'));
    } else {
      setName('');
      await load();
    }
    setPending(false);
  }

  if (!ready) return <p role="status">{tr('Checking your sign-in…')}</p>;

  if (!session?.user) {
    return (
      <div className="account-panel">
        <p>{tr('Sign in to create a private workspace and learn together with friends, classmates or a team.')}</p>
        <Link className="btn btn-primary" href="/account">{tr('Sign in')}</Link>
      </div>
    );
  }

  return (
    <div className="workspace-stack">
      <form className="account-panel account-form" onSubmit={create}>
        <label htmlFor="workspace-name">{tr('Workspace name')}</label>
        <input
          id="workspace-name"
          required
          minLength={2}
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? tr('Creating…') : tr('Create workspace')}
        </button>
      </form>
      {message && <p role="status">{message}</p>}
      <h2>{tr('Your workspaces')}</h2>
      {workspaces === null && <p role="status">{tr('Loading…')}</p>}
      {workspaces?.length === 0 && <p>{tr('You have no workspaces yet. Create your first one above.')}</p>}
      <ul className="workspace-list">
        {workspaces?.map((workspace) => (
          <li key={workspace.id}>
            <Link href={`/workspaces/view?id=${workspace.id}`}>{workspace.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
