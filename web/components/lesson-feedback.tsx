'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { useTr } from '@/components/tr';
import { readLessonVote } from '@/lib/lesson-feedback';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

export function LessonFeedback({ lessonId }: { lessonId: string }) {
  const { session, ready } = useAuth();
  const tr = useTr();
  if (!ready) return null;
  if (!session?.user) {
    return (
      <section className="progress-section" aria-labelledby={`feedback-${lessonId}`}>
        <h2 id={`feedback-${lessonId}`}>{tr('Was this lesson helpful?')}</h2>
        <p><Link href="/account">{tr('Sign in to leave private lesson feedback')}</Link></p>
      </section>
    );
  }
  return <PrivateLessonFeedback key={`${session.user.id}:${lessonId}`} userId={session.user.id} lessonId={lessonId} />;
}

function PrivateLessonFeedback({ userId, lessonId }: { userId: string; lessonId: string }) {
  const tr = useTr();
  const [vote, setVote] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    let active = true;
    const controller = new AbortController();
    Promise.resolve(client.from('lesson_feedback').select('helpful')
      .eq('user_id', userId).eq('lesson_id', lessonId)
      .abortSignal(controller.signal).maybeSingle())
      .then(({ data, error }) => {
        if (!active) return;
        if (error) throw error;
        setVote(readLessonVote(data));
        setLoaded(true);
        setLoadError(false);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error('Unable to load lesson feedback:', error);
        setLoadError(true);
      });
    return () => { active = false; controller.abort(); };
  }, [lessonId, retry, userId]);

  const save = useCallback(async (next: boolean | null) => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      setMessage(tr('Could not save your feedback. Please try again.'));
      return;
    }
    setPending(true);
    setMessage('');
    try {
      const { error } = next === null
        ? await client.from('lesson_feedback').delete().eq('user_id', userId).eq('lesson_id', lessonId)
        : await client.rpc('save_lesson_feedback', { _lesson_id: lessonId, _helpful: next });
      if (error) throw error;
      setVote(next);
      setMessage(tr(next === null ? 'Your feedback was removed.' : 'Thank you. Your private feedback is saved.'));
    } catch (error) {
      console.error('Unable to save lesson feedback:', error);
      setMessage(tr('Could not save your feedback. Please try again.'));
    } finally {
      setPending(false);
    }
  }, [lessonId, tr, userId]);

  return (
    <section className="progress-section" aria-labelledby={`feedback-${lessonId}`}>
      <h2 id={`feedback-${lessonId}`}>{tr('Was this lesson helpful?')}</h2>
      <p>{tr('One private vote per lesson. You can change or remove it. No written comments are collected.')}</p>
      {loadError ? (
        <div>
          <p role="alert">{tr('Could not load your feedback. Please try again.')}</p>
          <button className="btn btn-secondary" type="button" onClick={() => {
            setLoadError(false);
            setRetry((value) => value + 1);
          }}>{tr('Try again')}</button>
        </div>
      ) : (
        <div className="cta-row" role="group" aria-label={tr('Was this lesson helpful?')}>
          <button className="btn btn-secondary" type="button" disabled={!loaded || pending} aria-pressed={vote === true} onClick={() => void save(true)}>
            {tr('Helpful')}
          </button>
          <button className="btn btn-secondary" type="button" disabled={!loaded || pending} aria-pressed={vote === false} onClick={() => void save(false)}>
            {tr('Not helpful yet')}
          </button>
          {vote !== null && (
            <button className="btn btn-secondary" type="button" disabled={pending} onClick={() => void save(null)}>
              {tr('Remove my vote')}
            </button>
          )}
        </div>
      )}
      {!loaded && !loadError && <p role="status">{tr('Loading your feedback…')}</p>}
      {message && <p role="status">{message}</p>}
    </section>
  );
}
