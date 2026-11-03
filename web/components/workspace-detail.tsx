'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { useTr } from '@/components/tr';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { createInviteToken, INVITE_DAYS, itemTypeLabels, type ItemType, type WorkspaceItem } from '@/lib/workspaces';

type Shared = { item_type: ItemType; item_id: string; shared_by: string };
type Invitation = { id: string; email: string; expires_at: string; accepted_at: string | null };
type Detail = {
  name: string;
  isOwner: boolean;
  memberCount: number;
  shared: Shared[];
  invitations: Invitation[];
};

const itemTypes = Object.keys(itemTypeLabels) as ItemType[];

export function WorkspaceDetail({ items }: { items: WorkspaceItem[] }) {
  const tr = useTr();
  const workspaceId = useSearchParams().get('id') ?? '';
  const { session, ready } = useAuth();
  const userId = session?.user.id;
  const [detail, setDetail] = useState<Detail | null | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [shareType, setShareType] = useState<ItemType>('path');
  const [shareId, setShareId] = useState('');
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!client || !userId || !workspaceId) return;
    const [workspace, members, shared, invitations] = await Promise.all([
      client.from('learning_workspaces').select('name').eq('id', workspaceId).maybeSingle(),
      client.from('workspace_members').select('user_id, role').eq('workspace_id', workspaceId),
      client.from('workspace_shared_items').select('item_type, item_id, shared_by').eq('workspace_id', workspaceId),
      client
        .from('workspace_invitations')
        .select('id, email, expires_at, accepted_at')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })
    ]);
    if (workspace.error || !workspace.data) {
      setDetail(null);
      return;
    }
    const memberRows = members.data ?? [];
    setDetail({
      name: workspace.data.name,
      isOwner: memberRows.some((member) => member.user_id === userId && member.role === 'owner'),
      memberCount: memberRows.length,
      shared: shared.data ?? [],
      invitations: invitations.data ?? []
    });
  }, [userId, workspaceId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const choices = items.filter((item) => item.type === shareType);
  const selectedId = choices.some((item) => item.id === shareId) ? shareId : (choices[0]?.id ?? '');

  async function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client) return;
    setPending(true);
    setMessage('');
    setInviteLink('');
    const { token, hash } = await createInviteToken();
    const expires = new Date(Date.now() + INVITE_DAYS * 24 * 60 * 60 * 1000 - 60_000).toISOString();
    const { error } = await client.rpc('create_workspace_invitation', {
      _workspace_id: workspaceId,
      _email: inviteEmail.trim(),
      _token_hash: hash,
      _expires_at: expires
    });
    if (error) {
      setMessage(tr('Could not create the invitation. Check the email address and try again.'));
    } else {
      // The token sits in the URL fragment so it is never sent to our server.
      setInviteLink(`${window.location.origin}/workspaces/join#token=${token}`);
      setInviteEmail('');
      await load();
    }
    setPending(false);
  }

  async function share() {
    const client = getSupabaseBrowserClient();
    if (!client || !userId || !selectedId) return;
    setMessage('');
    const { error } = await client.from('workspace_shared_items').upsert(
      { workspace_id: workspaceId, item_type: shareType, item_id: selectedId, shared_by: userId },
      { onConflict: 'workspace_id,item_type,item_id', ignoreDuplicates: true }
    );
    if (error) setMessage(tr('Could not share that item. Please try again.'));
    await load();
  }

  async function unshare(item: Shared) {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    setMessage('');
    const { error } = await client
      .from('workspace_shared_items')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('item_type', item.item_type)
      .eq('item_id', item.item_id);
    if (error) setMessage(tr('Could not remove that item. Please try again.'));
    await load();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setMessage(tr('Invitation link copied.'));
    } catch {
      setMessage(tr('Copy the link manually.'));
    }
  }

  if (!ready || (userId && detail === undefined)) return <p role="status">{tr('Loading…')}</p>;

  if (!userId) {
    return (
      <div className="account-panel">
        <p>{tr('Sign in to open this workspace.')}</p>
        <Link className="btn btn-primary" href="/account">{tr('Sign in')}</Link>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="account-panel">
        <p>{tr('This workspace was not found, or you are not a member.')}</p>
        <Link href="/workspaces">{tr('Back to workspaces')}</Link>
      </div>
    );
  }

  const lookup = new Map(items.map((item) => [`${item.type}:${item.id}`, item]));

  return (
    <div className="workspace-stack">
      <h1>{detail.name}</h1>
      <p>{tr('{count} members', { count: detail.memberCount })}</p>
      <p className="account-note">
        {tr('Only items you share here are visible to members. Personal progress stays private.')}
      </p>
      {message && <p role="status">{message}</p>}

      <h2>{tr('Shared learning')}</h2>
      {detail.shared.length === 0 && <p>{tr('Nothing shared yet. Share a path, pack, tutorial or tool below.')}</p>}
      <ul className="workspace-list">
        {detail.shared.map((entry) => {
          const item = lookup.get(`${entry.item_type}:${entry.item_id}`);
          if (!item) return null;
          const canRemove = detail.isOwner || entry.shared_by === userId;
          return (
            <li key={`${entry.item_type}:${entry.item_id}`}>
              <span className="workspace-kind">{tr(itemTypeLabels[entry.item_type])}</span>
              <Link href={item.href}>{item.title}</Link>
              {canRemove && (
                <button className="btn btn-secondary" type="button" onClick={() => unshare(entry)}>
                  {tr('Remove')}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <div className="account-panel account-form">
        <label htmlFor="share-type">{tr('Type')}</label>
        <select id="share-type" value={shareType} onChange={(event) => setShareType(event.target.value as ItemType)}>
          {itemTypes.map((type) => (
            <option key={type} value={type}>{tr(itemTypeLabels[type])}</option>
          ))}
        </select>
        <label htmlFor="share-item">{tr('Item')}</label>
        <select id="share-item" value={selectedId} onChange={(event) => setShareId(event.target.value)}>
          {choices.map((item) => (
            <option key={item.id} value={item.id}>{item.title}</option>
          ))}
        </select>
        <button className="btn btn-primary" type="button" onClick={share} disabled={!selectedId}>
          {tr('Share with workspace')}
        </button>
      </div>

      {detail.isOwner && (
        <>
          <h2>{tr('Invite someone')}</h2>
          <form className="account-panel account-form" onSubmit={invite}>
            <label htmlFor="invite-email">{tr('Email address')}</label>
            <input
              id="invite-email"
              type="email"
              required
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={pending}>
              {pending ? tr('Creating…') : tr('Create invitation link')}
            </button>
            <p className="account-note">
              {tr('The link works once, for this email address only, and expires in {days} days. Send it privately.', {
                days: INVITE_DAYS
              })}
            </p>
          </form>
          {inviteLink && (
            <div className="account-panel">
              <input readOnly aria-label={tr('Invitation link')} value={inviteLink} onFocus={(event) => event.target.select()} />
              <button className="btn btn-secondary" type="button" onClick={copyLink}>{tr('Copy link')}</button>
            </div>
          )}
          {detail.invitations.length > 0 && (
            <ul className="workspace-list">
              {detail.invitations.map((invitation) => (
                <li key={invitation.id}>
                  <span>{invitation.email}</span>
                  <span className="workspace-kind">
                    {invitation.accepted_at
                      ? tr('Accepted')
                      : new Date(invitation.expires_at) < new Date()
                        ? tr('Expired')
                        : tr('Pending')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      <Link href="/workspaces">{tr('Back to workspaces')}</Link>
    </div>
  );
}
