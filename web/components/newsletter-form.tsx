'use client';

import { useActionState } from 'react';
import { subscribe, type SubscribeState } from '@/app/actions';

const initial: SubscribeState = { status: 'idle', message: '' };

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, initial);

  return (
    <section className="section newsletter">
      <div className="container newsletter-row">
        <div>
          <span className="eyebrow">Stay in the loop</span>
          <h2>Get practical AI and software guides that help you move forward.</h2>
        </div>
        <form className="newsletter-form" action={action}>
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input id="newsletter-email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp-field" />
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? 'Joining…' : 'Join'}
          </button>
          <p role="status" className={`newsletter-msg ${state.status}`}>
            {state.message}
          </p>
        </form>
      </div>
    </section>
  );
}
