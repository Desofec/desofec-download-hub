'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { useTr } from '@/components/tr';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { isStudyPost, isStudyRequest, studyRows, type StudyPost, type StudyRequest } from '@/lib/study-board-data';

type Goal = { id: string; name: string };
type Workspace = { id: string; name: string };

const reportReasons = ['Spam', 'Personal information', 'Unkind or unsafe', 'Other'];

function ReportButton({ postId, onDone }: { postId: string; onDone: (text: string) => void }) {
  const tr = useTr();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(reportReasons[0]);
  const [pending, setPending] = useState(false);

  async function send() {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    setPending(true);
    try {
      const { error } = await client.rpc('report_study_post', { _post_id: postId, _reason: reason });
      if (error) throw error;
      setOpen(false);
      onDone(tr('Thank you. We will review this post.'));
    } catch (error) {
      console.error('Unable to report study post:', error);
      onDone(tr('Could not send the report. Please try again.'));
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <button className="link-button" type="button" onClick={() => setOpen(true)}>
        {tr('Report')}
      </button>
    );
  }

  return (
    <span className="study-report">
      <label className="sr-only" htmlFor={`reason-${postId}`}>{tr('Reason')}</label>
      <select id={`reason-${postId}`} value={reason} onChange={(event) => setReason(event.target.value)}>
        {reportReasons.map((item) => (
          <option key={item} value={item}>{tr(item)}</option>
        ))}
      </select>
      <button className="btn btn-secondary" type="button" disabled={pending} onClick={send}>{tr('Send report')}</button>
    </span>
  );
}

export function StudyBoard({ goals }: { goals: Goal[] }) {
  const tr = useTr();
  const { session, ready } = useAuth();
  if (!ready) return <p role="status">{tr('Checking your sign-in…')}</p>;
  if (!session?.user) {
    return (
      <div className="account-panel">
        <p>{tr('Sign in to see the study board, post a card or ask to join a group.')}</p>
        <Link className="btn btn-primary" href="/account">{tr('Sign in')}</Link>
      </div>
    );
  }
  return <SignedInStudyBoard key={session.user.id} userId={session.user.id} goals={goals} />;
}

function SignedInStudyBoard({ goals, userId }: { goals: Goal[]; userId: string }) {
  const tr = useTr();
  const goalName = (id: string) => tr(goals.find((goal) => goal.id === id)?.name ?? id);
  const loadSequence = useRef(0);

  const [filter, setFilter] = useState('');
  const [posts, setPosts] = useState<StudyPost[] | null>(null);
  const [requests, setRequests] = useState<StudyRequest[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [message, setMessage] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [postGoal, setPostGoal] = useState(goals[0]?.id ?? '');
  const [postWorkspace, setPostWorkspace] = useState('');
  const [note, setNote] = useState('');
  const [askingId, setAskingId] = useState<string | null>(null);
  const [askText, setAskText] = useState('');
  const [pending, setPending] = useState(false);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const sequence = ++loadSequence.current;
    setLoadError('');
    setPosts(null);
    try {
      const [list, incoming, owned] = await Promise.all([
        client.rpc('list_study_posts', { _goal_id: filter || null }),
        client.rpc('list_study_requests'),
        client.from('learning_workspaces').select('id, name').eq('created_by', userId).order('created_at', { ascending: false })
      ]);
      if (sequence !== loadSequence.current) return;
      const error = list.error ?? incoming.error ?? owned.error;
      if (error) {
        console.error('Unable to load study board:', error);
        setLoadError(tr(error.code === 'PGRST202' || error.code === '42P01'
          ? 'Study groups are not set up yet. The site owner needs to apply the study board migration.'
          : 'Could not load the study board. Please try again.'));
        return;
      }
      const loadedPosts = studyRows(list.data, isStudyPost);
      const loadedRequests = studyRows(incoming.data, isStudyRequest);
      setPosts(loadedPosts);
      setRequests(loadedRequests);
      setWorkspaces(owned.data ?? []);
    } catch (error) {
      if (sequence !== loadSequence.current) return;
      console.error('Unable to load study board:', error);
      setLoadError(tr('Could not load the study board. Please try again.'));
    }
  }, [filter, tr, userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    return () => { loadSequence.current += 1; };
  }, [load]);

  async function run(action: () => PromiseLike<{ error: unknown }>, failure: string, success?: string) {
    setPending(true);
    setMessage('');
    try {
      const { error } = await action();
      if (error) throw error;
      setMessage(success ?? '');
      await load();
      return true;
    } catch (error) {
      console.error('Unable to update study board:', error);
      setMessage(failure);
      return false;
    } finally {
      setPending(false);
    }
  }

  async function createPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const workspaceId = postWorkspace || workspaces[0]?.id;
    if (!workspaceId) return;
    const ok = await run(
      () => client.rpc('create_study_post', { _workspace_id: workspaceId, _goal_id: postGoal, _display_name: displayName, _note: note }),
      tr('Could not post. Check your name, avoid emails and links, and remember you can post once per goal.'),
      tr('Your study post is live for 30 days.')
    );
    if (ok) setNote('');
  }

  async function ask(event: FormEvent<HTMLFormElement>, postId: string) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const ok = await run(
      () => client.rpc('request_to_join_study_post', { _post_id: postId, _display_name: displayName, _message: askText }),
      tr('Could not send your request. Check your name, avoid emails and links, and try again.'),
      tr('Request sent. You will see it here once it is answered.')
    );
    if (ok) {
      setAskingId(null);
      setAskText('');
    }
  }

  if (loadError) {
    return (
      <div className="account-panel">
        <p role="alert">{loadError}</p>
        <button className="btn btn-secondary" type="button" onClick={() => void load()}>{tr('Try again')}</button>
      </div>
    );
  }

  if (posts === null) return <p role="status">{tr('Loading…')}</p>;

  const nameOk = displayName.trim().length >= 2;

  return (
    <div className="workspace-stack">
      <div className="account-panel">
        <p>
          {tr('Be kind and stay safe: use a nickname, do not share your email, phone or links, and never share passwords. Approving someone gives them access to the items shared in that workspace.')}
        </p>
        <label htmlFor="study-name">{tr('Your nickname (2 to 30 characters)')}</label>
        <input id="study-name" maxLength={30} value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
      </div>

      {message && <p role="status">{message}</p>}

      {requests.length > 0 && (
        <div className="account-panel">
          <h2>{tr('People asking to join your groups')}</h2>
          <ul className="workspace-list">
            {requests.map((request) => (
              <li key={request.id}>
                <strong>{request.display_name}</strong> · {goalName(request.goal_id)}
                {request.message && <p>{request.message}</p>}
                <div className="study-actions">
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={pending}
                    onClick={() => run(() => getSupabaseBrowserClient()!.rpc('respond_to_study_request', { _request_id: request.id, _approve: true }), tr('Could not answer the request.'), tr('Added to your workspace.'))}
                  >
                    {tr('Approve')}
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    disabled={pending}
                    onClick={() => run(() => getSupabaseBrowserClient()!.rpc('respond_to_study_request', { _request_id: request.id, _approve: false }), tr('Could not answer the request.'))}
                  >
                    {tr('Decline')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form className="account-panel account-form" onSubmit={createPost}>
        <h2>{tr('Post a study card')}</h2>
        {workspaces.length === 0 ? (
          <p>
            {tr('Create a workspace first, then come back to post a card for it.')}{' '}
            <Link href="/workspaces">{tr('Go to workspaces')}</Link>
          </p>
        ) : (
          <>
            <label htmlFor="post-goal">{tr('Learning goal')}</label>
            <select id="post-goal" value={postGoal} onChange={(event) => setPostGoal(event.target.value)}>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>{tr(goal.name)}</option>
              ))}
            </select>
            <label htmlFor="post-workspace">{tr('Workspace for the group')}</label>
            <select id="post-workspace" value={postWorkspace || workspaces[0].id} onChange={(event) => setPostWorkspace(event.target.value)}>
              {workspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>{workspace.name}</option>
              ))}
            </select>
            <label htmlFor="post-note">{tr('Short note (optional, up to 200 characters)')}</label>
            <textarea id="post-note" maxLength={200} rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
            <button className="btn btn-primary" type="submit" disabled={pending || !nameOk}>
              {pending ? tr('Posting…') : tr('Post my card')}
            </button>
            {!nameOk && <p>{tr('Enter a nickname above first.')}</p>}
          </>
        )}
      </form>

      <h2>{tr('Study board')}</h2>
      <button className="btn btn-secondary" type="button" disabled={pending} onClick={() => void load()}>
        {tr('Refresh study board')}
      </button>
      <label htmlFor="board-filter">{tr('Show goal')}</label>
      <select id="board-filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
        <option value="">{tr('All goals')}</option>
        {goals.map((goal) => (
          <option key={goal.id} value={goal.id}>{tr(goal.name)}</option>
        ))}
      </select>
      {posts === null && <p role="status">{tr('Loading…')}</p>}
      {posts?.length === 0 && <p>{tr('No study cards yet for this goal. Be the first to post one.')}</p>}
      <ul className="workspace-list">
        {posts?.map((post) => (
          <li key={post.id}>
            <strong>{post.display_name}</strong> · {goalName(post.goal_id)}
            {post.note && <p>{post.note}</p>}
            <div className="study-actions">
              {post.mine && (
                <>
                  <span>{tr('Your card')}</span>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    disabled={pending}
                    onClick={() => run(() => getSupabaseBrowserClient()!.rpc('delete_study_post', { _post_id: post.id }), tr('Could not remove the card.'), tr('Card removed.'))}
                  >
                    {tr('Remove')}
                  </button>
                </>
              )}
              {!post.mine && post.my_request_status === 'approved' && post.joined_workspace_id && (
                <Link className="btn btn-primary" href={`/workspaces/view?id=${post.joined_workspace_id}`}>
                  {tr('Open the workspace')}
                </Link>
              )}
              {!post.mine && post.my_request_status === 'pending' && <span>{tr('Request sent')}</span>}
              {!post.mine && post.my_request_status === 'declined' && <span>{tr('Not available right now')}</span>}
              {!post.mine && !post.my_request_status && askingId !== post.id && (
                <button className="btn btn-primary" type="button" disabled={!nameOk} onClick={() => setAskingId(post.id)}>
                  {tr('Ask to join')}
                </button>
              )}
              {!post.mine && <ReportButton postId={post.id} onDone={setMessage} />}
            </div>
            {askingId === post.id && (
              <form className="account-form" onSubmit={(event) => ask(event, post.id)}>
                <label htmlFor={`ask-${post.id}`}>{tr('Say hello (optional, no emails or links)')}</label>
                <input id={`ask-${post.id}`} maxLength={200} value={askText} onChange={(event) => setAskText(event.target.value)} />
                <button className="btn btn-primary" type="submit" disabled={pending}>{tr('Send request')}</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
