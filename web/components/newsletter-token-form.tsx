'use client';

import { useActionState } from 'react';
import { confirmNewsletter, unsubscribeNewsletter, type NewsletterActionState } from '@/app/actions';

const initialState: NewsletterActionState = { status: 'idle', message: '' };

export function NewsletterTokenForm({ token, mode }: { token: string; mode: 'confirm' | 'unsubscribe' }) {
  const action = mode === 'confirm' ? confirmNewsletter : unsubscribeNewsletter;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={token} />
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? 'Please wait…' : mode === 'confirm' ? 'Confirm subscription' : 'Unsubscribe'}
      </button>
      <p className="form-message" role="status" data-status={state.status}>
        {state.message}
      </p>
    </form>
  );
}
