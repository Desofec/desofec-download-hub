'use client';

import { useActionState } from 'react';
import { subscribe, type NewsletterActionState } from '@/app/actions';

const initialState: NewsletterActionState = { status: 'idle', message: '' };

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribe, initialState);

  return (
    <div>
      <form className="newsletter-form" action={formAction}>
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <input className="sr-only" name="company" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? 'Joining…' : 'Join the list'}
        </button>
      </form>
      <p className="form-message" role="status" data-status={state.status}>
        {state.message}
      </p>
      <p className="form-message">We’ll email you a confirmation link. You can unsubscribe any time.</p>
    </div>
  );
}
