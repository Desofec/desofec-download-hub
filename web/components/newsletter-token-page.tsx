'use client';

import { useSearchParams } from 'next/navigation';
import { NewsletterTokenForm } from '@/components/newsletter-token-form';
import { useTr } from '@/components/tr';

export function NewsletterTokenPage({ mode }: { mode: 'confirm' | 'unsubscribe' }) {
  const tr = useTr();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return <p className="form-message" role="status">{tr('This link is missing or invalid.')}</p>;
  }

  return <NewsletterTokenForm token={token} mode={mode} />;
}
